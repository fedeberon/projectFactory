const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["localhost", "vps-2124680-x.dattaweb.com"],
    deviceSizes: [640, 750],
    imageSizes: [16, 32],
  },
};
