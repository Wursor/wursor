import Cocoa
import WebKit

// Renders pages the way a browser would at a Figma frame's size, and compares them with the Figma screenshot.
//   fd shot jobs.tsv outdir        lines: id<TAB>url<TAB>w<TAB>h<TAB>theme<TAB>script (script optional; runs after load)
//   fd diff fig.png mine.png out.png x y w h [dy]   prints the % of pixels that differ clearly
//   fd side fig.png mine.png diff.png out.png [dy]  Figma | mine | diff, side by side
func loadCG(_ p: String) -> CGImage? {
    guard let d = NSData(contentsOfFile: p), let s = CGImageSourceCreateWithData(d, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(s, 0, nil)
}
func rgba(_ img: CGImage, _ w: Int, _ h: Int) -> [UInt8] {
    var buf = [UInt8](repeating: 255, count: w*h*4)
    let cs = CGColorSpaceCreateDeviceRGB()
    let ctx = CGContext(data: &buf, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    ctx.interpolationQuality = .high
    ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
    return buf
}
func writePNG(_ buf: [UInt8], _ w: Int, _ h: Int, _ path: String) {
    var b = buf
    let cs = CGColorSpaceCreateDeviceRGB()
    let ctx = CGContext(data: &b, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
    try? rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
}
/// My render, scaled to the Figma width and shifted down by dy rows (the phone frames have a 44 px status bar above the page).
func placed(_ a: CGImage, _ b: CGImage, _ dy: Int) -> (fa: [UInt8], fb: [UInt8], w: Int, h: Int) {
    let fw = a.width, fh = a.height
    let mh = Int((Double(b.height) * Double(fw) / Double(b.width)).rounded())
    let rm = rgba(b, fw, mh)
    var rb = [UInt8](repeating: 255, count: fw*fh*4)
    for j in 0..<mh { let tj = j + dy; if tj >= fh { break }; for i in 0..<(fw*4) { rb[tj*fw*4+i] = rm[j*fw*4+i] } }
    return (rgba(a, fw, fh), rb, fw, fh)
}

let args = CommandLine.arguments
if args[1] == "px" {
    // fd px image.png x y [x y ...]   prints rgb at each point, in the first image's scale
    let a = loadCG(args[2])!
    let sc = Double(a.width) / Double(args.count > 2 ? (Int(args[3]) != nil ? 1440 : a.width) : a.width)
    _ = sc
    let w = a.width, h = a.height
    let r = rgba(a, w, h)
    var i = 3
    while i + 1 < args.count {
        let x = Int(args[i])!, y = Int(args[i+1])!
        let k = (y*w+x)*4
        print("\(x),\(y): #\(String(format:"%02x%02x%02x", r[k], r[k+1], r[k+2]))")
        i += 2
    }
    exit(0)
}
if args[1] == "side" {
    let a = loadCG(args[2])!, b = loadCG(args[3])!, d = loadCG(args[4])!
    let p = placed(a, b, args.count > 6 ? Int(args[6])! : 0)
    let fw = p.w, fh = p.h, rd = rgba(d, fw, fh)
    let W = fw*3 + 20
    var out = [UInt8](repeating: 128, count: W*fh*4)
    for j in 0..<fh { for i in 0..<fw { for c in 0..<4 {
        out[(j*W+i)*4+c] = p.fa[(j*fw+i)*4+c]
        out[(j*W+fw+10+i)*4+c] = p.fb[(j*fw+i)*4+c]
        out[(j*W+2*fw+20+i)*4+c] = rd[(j*fw+i)*4+c]
    } } }
    writePNG(out, W, fh, args[5]); exit(0)
}
if args[1] == "diff" {
    let a = loadCG(args[2])!, b = loadCG(args[3])!
    let x = Int(args[5])!, y = Int(args[6])!, w = Int(args[7])!, h = Int(args[8])!
    let p = placed(a, b, args.count > 9 ? Int(args[9])! : 0)
    let fw = p.w, fh = p.h
    var out = p.fa, bad = 0, total = 0
    for j in y..<min(y+h, fh) { for i in x..<min(x+w, fw) {
        let k = (j*fw+i)*4
        let d = max(abs(Int(p.fa[k])-Int(p.fb[k])), abs(Int(p.fa[k+1])-Int(p.fb[k+1])), abs(Int(p.fa[k+2])-Int(p.fb[k+2])))
        total += 1
        if d > 40 { bad += 1; out[k]=255; out[k+1]=0; out[k+2]=60 } else { for c in 0..<3 { out[k+c]=UInt8((Int(p.fa[k+c])+510)/3) } }
    } }
    writePNG(out, fw, fh, args[4])
    print(String(format: "%.2f", Double(bad)*100/Double(max(total,1)))); exit(0)
}

struct Job { let id, url: String; let w, h: Int; let theme: String; let script: String; let delay: Double }
let lines = try! String(contentsOfFile: args[2], encoding: .utf8).split(separator: "\n").map(String.init)
let jobs = lines.compactMap { l -> Job? in
    let p = l.split(separator: "\t", omittingEmptySubsequences: false).map(String.init)
    return p.count >= 5 ? Job(id: p[0], url: p[1], w: Int(p[2])!, h: Int(p[3])!, theme: p[4], script: p.count > 5 ? p[5] : "", delay: p.count > 6 ? (Double(p[6]) ?? 1400) : 1400) : nil
}
let outdir = args[3]
let app = NSApplication.shared
app.setActivationPolicy(.prohibited)  // no Dock icon, never takes focus

class Runner: NSObject, WKNavigationDelegate {
    var idx = 0
    var web: WKWebView!
    var win: NSWindow!
    func next() {
        if idx >= jobs.count { print("done"); exit(0) }
        let j = jobs[idx]
        let cfg = WKWebViewConfiguration()
        let pre = "try{localStorage.setItem('wursor-theme','\(j.theme)')}catch(e){}"
        cfg.userContentController.addUserScript(WKUserScript(source: pre, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        web = WKWebView(frame: NSRect(x: 0, y: 0, width: j.w, height: j.h), configuration: cfg)
        web.navigationDelegate = self
        win = NSWindow(contentRect: NSRect(x: 0, y: 0, width: j.w, height: j.h), styleMask: [.borderless], backing: .buffered, defer: false)
        win.contentView = web
        // Kept off every screen and invisible: WebKit only needs a window to exist, not to be seen.
        win.setFrameOrigin(NSPoint(x: -30000, y: -30000))
        win.alphaValue = 0
        win.ignoresMouseEvents = true
        win.collectionBehavior = [.stationary, .ignoresCycle]
        win.orderBack(nil)
        web.load(URLRequest(url: URL(string: j.url)!))
    }
    func webView(_ w: WKWebView, didFinish n: WKNavigation!) {
        let j = jobs[idx]
        let prelude = "const sleep=ms=>new Promise(r=>setTimeout(r,ms));const q=s=>document.querySelector(s);const qa=s=>[...document.querySelectorAll(s)];const setv=(el,v)=>{const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value');d.set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));};const btns=qa('button,a,[role=radio],[role=button],[role=tab],label,li');const btn=t=>btns.find(e=>(e.textContent||'').trim().startsWith(t))||btns.find(e=>(e.textContent||'').includes(t));const click=t=>{const e=typeof t==='string'?(btn(t)||q(t)):t;if(!e)throw new Error('no '+t);e.click();};const type=(s,v)=>setv(q(s),v);document.documentElement.setAttribute('data-theme','\(j.theme)');document.head.insertAdjacentHTML('beforeend','<style>nextjs-portal{display:none!important}</style>');await sleep(500);"
        let probe = j.script.contains("PROBE:")
        w.callAsyncJavaScript(prelude + j.script.replacingOccurrences(of: "PROBE:", with: "") + (probe ? "" : ";return 1"), arguments: [:], in: nil, in: .page) { res in
            if case .failure(let e) = res { print("js fail \(j.id): \(e)") }
            if probe, case .success(let v) = res { print("probe \(j.id): \(v ?? "nil")") }
            DispatchQueue.main.asyncAfter(deadline: .now() + j.delay / 1000) {
                let c = WKSnapshotConfiguration()
                c.rect = CGRect(x: 0, y: 0, width: j.w, height: j.h)
                c.snapshotWidth = NSNumber(value: j.w)
                w.takeSnapshot(with: c) { img, err in
                    if let img = img, let t = img.tiffRepresentation, let rep = NSBitmapImageRep(data: t), let d = rep.representation(using: .png, properties: [:]) {
                        try? d.write(to: URL(fileURLWithPath: "\(outdir)/\(j.id).png"))
                    } else { print("fail \(j.id) \(String(describing: err))") }
                    self.idx += 1
                    self.next()
                }
            }
        }
    }
    func webView(_ w: WKWebView, didFail n: WKNavigation!, withError e: Error) { print("nav fail \(e)"); idx += 1; next() }
    func webView(_ w: WKWebView, didFailProvisionalNavigation n: WKNavigation!, withError e: Error) { print("prov fail \(e)"); idx += 1; next() }
}
let r = Runner()
DispatchQueue.main.async { r.next() }
app.run()
