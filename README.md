# fyrimun

A Vue+Vite clone of the https://fyrimun.com/leg-jeans mobile version.

## Coded In

[WebStorm](https://www.jetbrains.com/webstorm/)

## Free IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and
disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for
type checking. In VSCode, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the
TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Known Issues

1. **Vue Language Server error in Webstorm**
    - Description: Vue Language Server 2.0.x initialization fails on 2024.2 Version.
    - Impact: Vue files are not handled properly.
    - Workaround: Install Vue Language Server 2.1.2
      from [here](https://youtrack.jetbrains.com/issue/WEB-68756/Vue-LS-2.x-Couldnt-Start-server.watchFiles-is-not-a-function#focus=Change-27-10393848.0-0.pinned).


2. **Failed to resolve entry for package "csstype"**

    - Description: The package "csstype" has incorrect main property specified in its package.json.
    - Impact: Vite dev server won't start.
    - Workaround: change main to 'index.js.flow' in node_modules/csstype/package.json.