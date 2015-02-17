'use strict';

var StringUtils = {
    html_decode: function (string) {
        return string.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    },
    html_encode: function (string) {
        return string.replace('"', /&quot;/g).replace("'", /&#039;/g).replace('<', /&lt;/g).replace('>', /&gt;/g).replace('&', /&amp;/g);
    }
};