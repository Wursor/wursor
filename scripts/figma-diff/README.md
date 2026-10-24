# figma-diff

Renders a built screen in WebKit at a Figma frame's size and diffs it against the Figma screenshot (macOS, needs the Swift toolchain and the dev server on :5173).

```bash
swiftc -O fd.swift -o "$FD_WORK/fd"      # once
python3 -c "from run import run; print(run([dict(key='SY7-dl', node='125:23604', path='/system/unreachable', kind='d', theme='light')]))"
```

A frame that matches shows about 0.3–0.6% differing pixels (text anti-aliasing). Look at anything above about 1.5% with `side()`.
