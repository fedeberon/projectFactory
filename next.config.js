const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["https://project-factory.vercel.app/portfolio"],
    deviceSizes: [640, 750],
    imageSizes: [16, 32],
  },
};
