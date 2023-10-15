<div align=center>

<div style="display: flex; justify-content: center; gap: 1rem;">
<img src="assets/header.svg" style="width: 200px">
</div>

</div>

# LAPUTA
☁️🏯 a world of floating cities 🏰☁️ - EthGlobal 2023

[Sign up for the waitlist](https://www.laputa.gg)

## Development

**Install dependencies:**

### mud

[mud quick start](https://mud.dev/quick-start)

#### Prerequisites
- Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
```
- Node.js
- pnpm
```bash
# after installing node
npm install --global pnpm
```

## Available Scripts

In the project directory, you can run:
```bash
pnpm run <script>
```

| **Script**        | **Description**                                                 |
| ----------------- | --------------------------------------------------------------- |
| `build`           | Builds the app using pnpm.                                      |
| `dev`             | Runs both contracts and client in development mode concurrently.|
| `dev:client`      | Runs the client development script.                             |
| `dev:contracts`   | Runs the contracts development script.                          |
| `foundry:up`      | Downloads and runs foundry, bash, and foundryup.                |
| `mud:up`          | Sets the mud version to main and installs dependencies.        |
| `prepare`         | Installs husky and optionally runs foundryup.                   |
| `test`            | Runs tests recursively on all packages.                         |
| `preview`         | Compiles TypeScript, builds, and previews the app with Vite.    |
| `lint`            | Runs linting recursively on all packages.                       |
| `type-check`      | Runs type-checking recursively on all packages.                 |

## References / useful

- 🔥🚒 **[React-Three-Fiber Performance Pitfalls](https://docs.pmnd.rs/react-three-fiber/advanced/pitfalls)** - Must read on R3F + Three.js
- 🧸📖 **[Zustand intro](https://refine.dev/blog/zustand-react-state/#getting-started-with-zustand)** - How to use Zustand
