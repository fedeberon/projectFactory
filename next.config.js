const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["project-factory.vercel.app"],
    deviceSizes: [640, 750],
    imageSizes: [16, 32],
  },
};
