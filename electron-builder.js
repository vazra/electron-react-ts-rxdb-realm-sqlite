module.exports = {
  productName: "ReactDesktopApp",
  appId: "com.test.reactdeesk",
  copyright: "Copyright © 2020 Vazra.",

  // asar: true,
  // npmRebuild: true,
  // buildDependenciesFromSource: false,

  // Windows configuration
  win: {
    target: "nsis-web",
  },

  // Release repo
  publish: [
    {
      provider: "github",
      repo: "electron-react-ts-rxdb",
      owner: "vazra",
      releaseType: "release",
    },
    {
      provider: "s3",
      bucket: "shdesk",
    },
  ],
};
