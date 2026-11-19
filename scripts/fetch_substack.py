"""Pull the Analytical Thoughts RSS feed into feed.json (title, link, date, subtitle)."""
import json
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

FEED = "https://analyticalthoughts.substack.com/feed"

req = urllib.request.Request(FEED, headers={"User-Agent": "r9r-feed/1.0"})
with urllib.request.urlopen(req, timeout=30) as r:
    root = ET.fromstring(r.read())

items = []
for it in root.iter("item"):
    title = (it.findtext("title") or "").strip()
    link = (it.findtext("link") or "").strip()
    if not title or not link.startswith("https://"):
        continue
    date = ""
    if it.findtext("pubDate"):
        date = parsedate_to_datetime(it.findtext("pubDate")).date().isoformat()
    items.append({
        "title": title,
        "link": link,
        "date": date,
        "subtitle": (it.findtext("description") or "").strip()[:200],
    })

items.sort(key=lambda x: x["date"], reverse=True)
with open("feed.json", "w") as f:
    json.dump(items, f, indent=2, ensure_ascii=False)
    f.write("\n")
print(f"wrote {len(items)} posts")
