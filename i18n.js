const NextI18Next = require('next-i18next').default

module.exports = new NextI18Next({
    otherLanguages: ['es'],
    defaultNS: 'common',
    localeSubpaths: {
        es: 'es'
    },
    localePath: 'public/static/locales',
})