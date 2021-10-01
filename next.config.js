const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["localhost", "vps-2103012-x.dattaweb.com"],
    deviceSizes: [640, 750],
    imageSizes: [16, 32],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};
