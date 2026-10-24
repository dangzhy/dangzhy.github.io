#!/usr/bin/env python3
"""Check generated local pages, assets, fragments, and accidental local paths."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.ids = [], set()
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if data.get("id"):
            self.ids.add(data["id"])
        for key in ("href", "src"):
            if data.get(key):
                self.links.append(data[key])


def check(root):
    pages = {p.resolve(): Page(p.read_text(encoding="utf-8")) for p in root.rglob("*.html")}
    errors, refs = [], 0
    if not (root / "index.html").is_file():
        errors.append("缺少首页 index.html")
    else:
        home = (root / "index.html").read_text(encoding="utf-8")
        for required in ('class="article-title"', 'class="left sidebar"', 'zhengyang dang', '关于我', '内容索引'):
            if required not in home:
                errors.append(f"首页缺少必要内容：{required}")
    for slug in ("notes", "about"):
        if not (root / f"{slug}.html").is_file():
            errors.append(f"缺少栏目：{slug}")
    for file, page in pages.items():
        text = file.read_text(encoding="utf-8")
        if re.search(r"/Users/|file://|TODO:username|https?://undefined|quartz\.jzhao\.xyz/static", text):
            errors.append(f"{file.relative_to(root)}: 包含本机路径或上游占位信息")
        for link in page.links:
            parts = urlsplit(link)
            if parts.scheme or parts.netloc:
                continue
            refs += 1
            dest = ((root / unquote(parts.path).lstrip("/")) if parts.path.startswith("/") else (file.parent / unquote(parts.path))).resolve() if parts.path else file
            candidates = [dest, dest.with_suffix(".html"), dest / "index.html"]
            found = next((p for p in candidates if p.is_file()), None)
            if found is None:
                errors.append(f"{file.relative_to(root)}: 无效链接 {link}")
            elif parts.fragment and found in pages and unquote(parts.fragment) not in pages[found].ids:
                errors.append(f"{file.relative_to(root)}: 无效锚点 {link}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"通过：{len(pages)} 个页面，{refs} 个站内链接与资源引用；未发现本机路径或占位链接。外链未联网逐项检查。")
    return 0


if __name__ == "__main__":
    sys.exit(check(Path(sys.argv[1]).resolve()))
