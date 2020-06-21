# Electron React (Typescript) with RxDB, Realm & SQLite

> Demo of Native Databases with Electron and ReactJS. Realm, SQLite and RxDB ( with LevelDB/IndexedDB/InMemory adapters)

- The electron & react part is bootstraped with [`electron-webpack-typescript-react boilerplate`](https://github.com/vazra/electron-webpack-typescript-react) which is based in `electron-webpack`.

  - Use of [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server) for development
  - HMR for both `renderer` and `main` processes
  - Use of [`babel-preset-env`](https://github.com/babel/babel-preset-env) that is automatically configured based on your `electron` version
  - Use of [`electron-builder`](https://github.com/electron-userland/electron-builder) to package and build a distributable electron application

  Make sure to check out [`electron-webpack`'s documentation](https://webpack.electron.build/) for more details.

- Implemented RxDB with native adapters of LevelDB & NodeSQL
- Implemented native [Realm database](https://github.com/realm/realm-js)
- Implemented native [SQLite3 database](https://github.com/mapbox/node-sqlite3)

## Getting Started

Simply fork/clone this repository, install dependencies, and try `yarn dev`.

```bash
# clone thee repo
mkdir electron-react-dbs && cd electron-react-dbs
git clone https://github.com/vazra/electron-react-ts-rxdb-realm-sqlite.git
cd electron-react-dbs

# install dependencies
yarn

# run in dev mode
yarn dev

```

You will be able to tryout all the databases available.

The use of the [yarn](https://yarnpkg.com/) package manager is **strongly** recommended, as opposed to using `npm`.

## FAQ

1. Can I use this as a boilerplate for my electron-react app with native databases

   Ans. Yes, you can. this project itself is bootstrapped with [`electron-react boilerplate`](https://github.com/vazra/electron-webpack-typescript-react) You can either take it as the base project or fork this repo and remove unwanted db codes. The code is structured in such a way that any db code can be removed without much effort.

For any bugs or requests create issues [here](https://github.com/vazra/electron-react-ts-rxdb-realm-sqlite/issues)

Pull requests are also invited. :rocket:
