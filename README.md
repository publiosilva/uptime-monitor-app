# Uptime Monitor App

Expo / React Native client for the self-hosted [uptime-monitor](https://github.com/publiosilva/uptime-monitor) stack. Sign in, manage HTTP monitors, watch live up/down events, and drill into 24-hour uptime, latency, and recent checks.

Companion to the [uptime-monitor-webapp](https://github.com/publiosilva/uptime-monitor-webapp) dashboard — same API, GraphQL, and WebSocket contracts, adapted for mobile.

## Features

- Email/password auth with JWT stored in SecureStore (Keychain / Keystore)
- Home dashboard with totals, operational/down counts, and monitor cards
- Add, pause/resume, and delete monitors
- Live status via worker WebSocket (toasts on up/down)
- Monitor details: GraphQL 24h stats, latency chart, uptime timeline, recent checks
- Dark UI aligned with the webapp design tokens

## Technologies

- Expo SDK 57 + Expo Router
- React 19 + React Native
- Apollo Client (GraphQL details)
- React Hook Form + Zod
- `expo-secure-store`, `expo-clipboard`, `react-native-gifted-charts`

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Expo Go](https://expo.dev/go) (or a simulator / emulator)
- A running [uptime-monitor](https://github.com/publiosilva/uptime-monitor) stack:
  - API on `http://localhost:3333`
  - Worker WebSocket on `ws://localhost:3334/ws/states`

## Local setup

```bash
git clone https://github.com/publiosilva/uptime-monitor-app.git
cd uptime-monitor-app
npm install
cp .env.example .env
npx expo start
```

Then press `i` (iOS Simulator), `a` (Android emulator), scan the QR code with Expo Go, or open the web target.

### Environment

Copy [`.env.example`](.env.example) to `.env`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3333
EXPO_PUBLIC_WS_URL=ws://localhost:3334/ws/states
```

There is no Vite-style proxy — the app calls these URLs directly. Adjust the host for your device:

| Where you run the app | Typical API / WS host |
|-----------------------|------------------------|
| iOS Simulator | `localhost` |
| Android emulator | `10.0.2.2` (maps to the host machine) |
| Physical device | Your computer’s LAN IP (e.g. `192.168.0.10`) |

Restart Metro after changing `.env` so `EXPO_PUBLIC_*` values are picked up.

## Scripts

```bash
npm start          # expo start
npm run ios        # start and open iOS
npm run android    # start and open Android
npm run web        # start web target
npm run lint       # expo lint
npx tsc --noEmit   # typecheck
```

## Project structure

```
src/
  app/                 # Expo Router screens (sign-in, home, details)
  components/          # UI building blocks
  contexts/            # Session / auth provider
  hooks/               # e.g. useWebSocket
  lib/                 # api, apollo, token, config
  services/            # auth + monitor API wrappers
  constants/           # design tokens
```

Routes live under `src/app/`. Authenticated screens are in the `(app)` group and gated with Expo Router `Stack.Protected`.

## Learning guide

If you know React and want to learn React Native from this codebase, see [docs/aprendendo-react-native.md](docs/aprendendo-react-native.md).

## License

See [LICENSE](LICENSE).
