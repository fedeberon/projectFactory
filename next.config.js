const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["localhost"],
    deviceSizes: [640, 750, 828, 1080],
    imageSizes: [16, 32, 48, 64],
  },
};
