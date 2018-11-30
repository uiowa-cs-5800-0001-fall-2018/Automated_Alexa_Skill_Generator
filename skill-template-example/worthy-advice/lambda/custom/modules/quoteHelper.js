const rp = require('request-promise')

const quoteHelper = {}


quoteHelper.getQuote = function(){
    let url = "https://talaikis.com/api/quotes/random/"
    return rp(url)
}

module.exports = quoteHelper