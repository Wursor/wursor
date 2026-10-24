"""Pixel-compare built screens with their Figma frames.

Work dir (renders, Figma PNGs, diffs, urls.tsv) is $FD_WORK, default /tmp/wursor-figma-diff.
urls.tsv holds `nodeId<TAB>url` for Figma screenshot links (they expire, so refetch when stale).
An entry is dict(key, node, path, kind, theme, script?) where kind is
  d  desktop 1440x900     m  phone 390x800 shifted under Figma's 44 px status bar     mf  phone 390x844 (full-bleed pages)
"""
import subprocess, os, sys, json
BASE = os.environ.get('FD_BASE', 'http://localhost:5173')
D = os.environ.get('FD_WORK', '/tmp/wursor-figma-diff')
for sub in ('fig', 'out', 'diff'):
    os.makedirs(f'{D}/{sub}', exist_ok=True)

def urls():
    m = {}
    p = D + '/urls.tsv'
    if os.path.exists(p):
        for l in open(p):
            l = l.strip()
            if '\t' in l:
                a, b = l.split('\t', 1); m[a] = b
    return m

def fetch_fig(node):
    f = f"{D}/fig/{node.replace(':', '_')}.png"
    if os.path.exists(f) and os.path.getsize(f) > 500: return f
    u = urls().get(node)
    if not u: return None
    subprocess.run(['curl', '-sL', '-o', f, u], check=True)
    return f if os.path.getsize(f) > 500 else None

SIZE = {'d': (1440, 900), 'm': (390, 800), 'mf': (390, 844), 'mt': (390, 800)}
REGION = {'d': ['0', '0', '1440', '900', '0'], 'm': ['0', '44', '390', '709', '44'], 'mf': ['0', '44', '390', '766', '0'], 'mt': ['0', '44', '390', '700', '44']}

def fig_height(node):
    f = fetch_fig(node)
    if not f: return 900
    o = subprocess.run(['sips', '-g', 'pixelHeight', f], capture_output=True, text=True).stdout
    return int(o.split()[-1])

def run(entries):
    jobs = []
    for e in entries:
        w, h = SIZE[e['kind']]
        if e['kind'] == 'd': h = e['h'] = fig_height(e['node'])
        if e['kind'] == 'mt': h = e['h'] = fig_height(e['node']) - 44  # a phone page taller than the screen: the frame shows all of it
        s = e.get('script', '').replace('\t', ' ').replace('\n', ' ')
        jobs.append(f"{e['key']}\t{BASE}{e['path']}\t{w}\t{h}\t{e['theme']}\t{s}\t{e.get('delay', 1400)}")
    open(D + '/jobs.tsv', 'w').write('\n'.join(jobs) + '\n')
    r = subprocess.run([D + '/fd', 'shot', D + '/jobs.tsv', D + '/out'], capture_output=True, text=True, timeout=3000)
    if r.stdout.strip() != 'done': print(r.stdout[-800:], r.stderr[-300:])
    res = []
    for e in entries:
        fig, mine = fetch_fig(e['node']), f"{D}/out/{e['key']}.png"
        if not fig or not os.path.exists(mine):
            res.append((e['key'], None)); continue
        reg = ['0', '0', '1440', str(e['h']), '0'] if e['kind'] == 'd' else (['0', '44', '390', str(e['h']), '44'] if e['kind'] == 'mt' else REGION[e['kind']])
        o = subprocess.run([D + '/fd', 'diff', fig, mine, f"{D}/diff/{e['key']}.png"] + reg, capture_output=True, text=True)
        res.append((e['key'], float(o.stdout.strip() or -1)))
    return res

def side(key, node, kind):
    out = f'{D}/diff/{key}.side.png'
    subprocess.run([D + '/fd', 'side', f"{D}/fig/{node.replace(':', '_')}.png", f'{D}/out/{key}.png', f'{D}/diff/{key}.png', out, REGION[kind][4]])
    return out


def probe(path, js, kind='m', theme='light'):
    """Run js (a body that `return`s a value) on a page and print what it returns. E.g. probe('/sites', "return document.title")"""
    w, h = SIZE[kind]
    open(D + '/probe.tsv', 'w').write(f"probe\t{BASE}{path}\t{w}\t{h}\t{theme}\tPROBE:{js.replace(chr(10), ' ')}\n")
    r = subprocess.run([D + '/fd', 'shot', D + '/probe.tsv', D + '/out'], capture_output=True, text=True, timeout=300)
    return r.stdout
