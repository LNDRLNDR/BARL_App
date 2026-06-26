# 🛰️ BARL Remote Connection (Relay Tool)

This little tool lets you run **BARL on a second PC** and still get live game data from the
PC that's actually running Rocket League — as long as both PCs are on the **same network**
(same Wi-Fi / router).

You only need this if Rocket League and your stream/overlay are on **two different PCs**.

---

## 🧠 First, know your two PCs

| PC | What it does | What you do on it |
|----|--------------|-------------------|
| 🎮 **Game PC** | Runs Rocket League + BARL (run BARL once) | Almost nothing — just launch BARL once |
| 📺 **Stream PC** | Runs BARL to show the overlay on stream | Run this relay tool |

> The relay tool in this folder runs on the **Stream PC only.** You never run it on the Game PC.

---

## 🎮 Step 1 — On the GAME PC (the one with Rocket League)

You do **not** edit any files here. Just two things:

1. **Open BARL one time.** You can do this with Rocket League closed. This makes BARL set
   itself up and install its plugin. After that you can close BARL — the plugin stays installed.

2. **Find this PC's local IP address.** You'll need it for the Stream PC. To find it:
   - Press `Windows + R`, type `cmd`, press Enter.
   - Type `ipconfig` and press Enter.
   - Look for **IPv4 Address** — it looks like `192.168.1.45`. Write it down.

✅ That's it for the Game PC. Don't run this relay tool here.

---

## 📺 Step 2 — On the STREAM PC (the one you stream from)

1. **Download the relay tool and unzip it:**
   👉 [Download BARL Relay](https://github.com/LNDRLNDR/BARL_App/raw/refs/heads/main/BARL_RemoteConnection/BARLProxy.zip)

2. **Install Node.js** (only needed once, free): https://nodejs.org/ — just click the big
   "LTS" download button and install with all the default settings.

3. **Open `config.json`** (right-click → Open with → Notepad) and change **only** the
   `remote_ip` to your **Game PC's IP** from Step 1. Leave everything else exactly as it is.

   ```json
   {
     "remote_ip": "192.168.1.45",   <-- change THIS to your Game PC's IP
     "remote_port": 49123,
     "local_port": 49123,
     "debug": false
   }
   ```

4. **Double-click `run.bat`.** A black window opens and stays open — that's normal, leave it
   running. (If Windows shows a blue "Windows protected your PC" box, click *More info →
   Run anyway*.)

5. **Open BARL** on the Stream PC. It connects automatically and starts showing live data
   from the Game PC. 🎉

---

## ❓ Quick troubleshooting

- **Nothing shows up?**
  - Double-check the IP in `config.json` is the **Game PC's** IP, not the Stream PC's.
  - Make sure BARL has been opened at least once on the Game PC.
  - Make sure both PCs are on the **same Wi-Fi / router**.
- **It connected before but stopped?** Re-run `run.bat` — it reconnects automatically.
- **Still stuck?** Ask in the [BARL Discord](https://discord.gg/GtMVHa2JbP).

---

## 🤓 Technical details (you can ignore this)

- The relay forwards raw **TCP** traffic between the Game PC and Stream PC on port `49123`.
- No data is changed — it's a transparent pass-through relay.
- No npm packages required; it uses Node's built-in `net` module.
- Each Stream PC runs its own copy of the relay. Multiple Stream PCs can connect to one Game PC.
- Make sure the Game PC's firewall allows inbound TCP on port `49123` if you have a strict firewall.
- Only change `remote_port` / `local_port` if you really know what you're doing.

### File structure

```
/BARL_RemoteConnection
├── config.json      # Set your Game PC's IP here
├── index.js         # The relay script
├── run.bat          # Double-click this to start it (Windows)
└── package.json     # Project metadata
```
