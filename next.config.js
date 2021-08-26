const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["localhost", "https://project-factory.vercel.app", "project-factory.vercel.app"],
    deviceSizes: [640, 750, 828, 1080],
    imageSizes: [16, 32, 48, 64],
  },
};
