#!/usr/bin/env python3
"""Create Dar el Sanaa Discord channels. Run AFTER inviting bot.
Invite first: https://discord.com/oauth2/authorize?client_id=1544448163581272204&permissions=8&scope=bot%20applications.commands
Usage: DAR_BOT_TOKEN='...' python3 /root/dar-essan3a/swarm/create_discord_channels.py
Token NEVER committed — env only.
"""
import os, json, urllib.request

BOT = os.environ.get("DAR_BOT_TOKEN", "")
GUILD = os.environ.get("DAR_GUILD_ID", "1544447884026716160")
if not BOT:
    print("Set DAR_BOT_TOKEN env. Refusing to run with hardcoded token.");
    raise SystemExit(1)

HEADERS = {"Authorization": f"Bot {BOT}", "Content-Type": "application/json",
           "User-Agent": "DarElSanaaBot/1.0 (swarm setup)"}

CHANNELS = [
  ("commander", "Orchestrator — approvals + budget"),
  ("fb-ads-expert", "FB Ads full-auto — seller never opens Ads Manager"),
  ("product-studio", "Photos, AR/FR descriptions, catalog"),
  ("store-builder", "New seller stores + subdomains"),
  ("order-cod", "COD confirmation + Yalidine"),
  ("support-inbox", "FR/AR customer support"),
  ("content-tiktok", "TikTok/Reels + SEO"),
  ("engineer", "Cloudflare + GitHub deploys"),
  ("analytics", "Pixel/CAPI/ROAS"),
  ("finance", "COD cash + returns"),
]

def api(method, path, data=None):
    req = urllib.request.Request(f"https://discord.com/api/v10{path}",
        data=json.dumps(data).encode() if data else None, method=method,
        headers=HEADERS)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode())

existing = {c["name"]: c["id"] for c in api("GET", f"/guilds/{GUILD}/channels")}
out = {}
for name, topic in CHANNELS:
    if name in existing:
        print(f"EXISTS #{name} -> {existing[name]}")
        out[name] = existing[name]
    else:
        c = api("POST", f"/guilds/{GUILD}/channels", {"name": name, "type": 0, "topic": topic})
        print(f"CREATED #{name} -> {c['id']}")
        out[name] = c["id"]

with open("/root/dar-essan3a/swarm/discord_channels.json", "w") as f:
    json.dump({"guild": GUILD, "channels": out}, f, indent=2)
print("Saved to swarm/discord_channels.json — paste IDs into .hermes/config.yaml discord.channel_prompts")
