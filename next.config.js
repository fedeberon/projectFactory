const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: [
      "project-factory.vercel.app",
      "https://project-factory.vercel.app",
    ],
  },
};
