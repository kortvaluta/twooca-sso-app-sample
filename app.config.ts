export default {
  name: "twooca-sso-app-sample",
  slug: "twooca-sso-app-sample",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/images/favicon.png"
  },
  extra: {
    twooca: {
      baseUrl: process.env.TWOOCA_BASE_URL,
      clientId: process.env.TWOOCA_CLIENT_ID,
      clientSecret: process.env.TWOOCA_CLIENT_SECRET,
      oauthRedirectUrl: process.env.TWOOCA_OAUTH_REDIRECT_URL
    }
  }
}
