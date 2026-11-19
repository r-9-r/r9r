"""Pull the Analytical Thoughts RSS feed into feed.json (title, link, date, subtitle)."""
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

FEED = "https://analyticalthoughts.substack.com/feed"

BROWSER = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=BROWSER), timeout=30) as r:
        return r.read()


def from_rss():
    root = ET.fromstring(get(FEED))
    for it in root.iter("item"):
        yield it.findtext("title"), it.findtext("link"), it.findtext("pubDate"), it.findtext("description")


def from_proxy():
    # Substack sometimes blocks cloud servers; rss2json fetches the same public feed for us.
    data = json.loads(get("https://api.rss2json.com/v1/api.json?rss_url=" + urllib.parse.quote(FEED, safe="")))
    if data.get("status") != "ok":
        raise RuntimeError(f"rss2json: {data.get('message')}")
    for it in data["items"]:
        yield it.get("title"), it.get("link"), it.get("pubDate"), it.get("description")


def parse_date(s):
    s = (s or "").strip()
    if not s:
        return ""
    if s[:4].isdigit():  # rss2json gives "2026-11-12 14:00:00"
        return s[:10]
    return parsedate_to_datetime(s).date().isoformat()


try:
    raw = list(from_rss())
    print("source: substack rss")
except Exception as e:
    print(f"direct feed failed ({e}); using rss2json")
    raw = list(from_proxy())

items = []
for title, link, pub, desc in raw:
    title = (title or "").strip()
    link = (link or "").strip()
    if not title or not link.startswith("https://"):
        continue
    items.append({"title": title, "link": link, "date": parse_date(pub), "subtitle": re.sub(r"<[^>]+>", "", desc or "").strip()[:200]})

if not items:
    raise SystemExit("no posts found; leaving feed.json unchanged")

items.sort(key=lambda x: x["date"], reverse=True)
with open("feed.json", "w") as f:
    json.dump(items, f, indent=2, ensure_ascii=False)
    f.write("\n")
print(f"wrote {len(items)} posts")
