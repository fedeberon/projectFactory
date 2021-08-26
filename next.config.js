const nextTranslate = require("next-translate");

module.exports = {
  ...nextTranslate(),
  images: {
    domains: ["https://project-factory.vercel.app", "https://vps-2103012-x.dattaweb.com:8085/project-factory/api/v1"]
  },
};
