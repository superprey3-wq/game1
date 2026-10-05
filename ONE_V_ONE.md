# DUST II 1v1 prototype

This branch is a private two-player experiment based on **ETO-ze/dust2-web**.
Original project history and attribution are preserved in this branch.

## What changed

- exactly 2 human players per room;
- one player on T and one on CT;
- joining an invite automatically picks the free side;
- bots are disabled for the 1v1 server;
- the existing mobile touch controls, weapons, Dust II map, rounds and WebSocket networking remain intact.

## Run locally

```sh
npm ci
npm run assets:fetch
npm run build
npm start
```

Open the printed HTTP address from two devices on the same reachable server.
The standalone server starts in 1v1 mode automatically.

## Free test hosting

A `render.yaml` Blueprint is included for a single free Render Web Service.
It builds the web client, serves it from the same Node process and exposes the
same-origin `/ws` WebSocket endpoint, so no separate frontend host is required.

The free service may spin down after inactivity and wake on the next HTTP or
WebSocket connection, which is acceptable for this two-person prototype.
