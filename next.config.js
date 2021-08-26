const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["localhost"],
    deviceSizes: [640, 750],
    imageSizes: [16, 32],
  },
};
