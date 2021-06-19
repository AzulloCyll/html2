# Mini Starterkit

Based on Parcel and yarn.

### Requirements

You must have installed:

- Node.js: https://nodejs.org/en/download/ - (LTS Recommended For Most Users)

### Getting Started

Yarn instalation
https://yarnpkg.com/en/docs/getting-started

Global Parcel instalation

```bash
yarn global add parcel-bundler
```

Local project instalation

```bash
yarn
```

### Commands

Start dev server

```bash
yarn run build:dev
```

Deploy production build to separate folder (public)

```bash
yarn run build:prod
```

### Configuration of output files

package.json scripts.production:

- need maps: remove --no-source-maps
- need minify: remove --no-minify

### Changing directory and file names in production mode

All settings concerns these funcionallity are aviable in files:

- postbuild.js
- removeHashFromFilesNames.js

All settings of paths for production build are avaiable in package.json (`starterkitSettings.productionBuild.paths`).

_Important information!_

All files, which aren't **html**, **styles** or **javascript** will be moved to "static" catalog (path of catalog in package.json: `starterkitSettings.productionBuild.paths.static.baseDir`). Structure of files in **static** catalog is flatten.

#### Base settings

Base path of production files:

```js
let baseDir = "public";
```
