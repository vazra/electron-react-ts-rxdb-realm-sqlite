module.exports = {
  productName: "ReactDesktopApp",
  appId: "com.test.reactdeesk",
  //   copyright: "Copyright © 2020 Vazra.",

  // Package electron code into a asar archive. Set to false to debug issues.
  asar: false,
  // npmRebuild: false,

  // Files & Directories

  //   files: [
  //     "dist/",
  //     "node_modules/",
  //     "app.html",
  //     "main.prod.js",
  //     "main.prod.js.map",
  //     "package.json",
  //   ],
  //   directories: {
  //     buildResources: "resources",
  //     output: "release",
  //   },

  // Windows configuration
  win: {
    target: [
      {
        target: "nsis-web",
        arch: ["ia32"], // x64, add 'ia32' for 32bit support.
      },
    ],
  },
  nsisWeb: {
    oneClick: true,
    perMachine: true,
    deleteAppDataOnUninstall: true,
    createDesktopShortcut: "always",
    createStartMenuShortcut: true,
    differentialPackage: true,
  },

  // Release repo
  publish: {
    provider: "github",
    repo: "electron-react-ts-rxdb",
    owner: "vazra",
    releaseType: "release",
  },
};
