module.exports = {
  appId: "com.validadoraiken.app",
  productName: "Validador Aiken",
  copyright: "Copyright © 2024 Validador Aiken",
  directories: {
    output: "dist-electron"
  },
  files: [
    "dist/**/*",
    "main.cjs",
    "preload.cjs",
    "package.json",
    "assets/**/*"
  ],
  win: {
    target: {
      target: "portable", 
      arch: ["x64"]
    },
    icon: "public/icon.ico",
    requestedExecutionLevel: "asInvoker"
  },
  mac: {
    target: "dmg",
    icon: "public/icon.ico",
    category: "public.app-category.education"
  },
  linux: {
    target: "AppImage",
    icon: "public/icon.png",
    category: "Education"
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "Validador Aiken"
  }
};