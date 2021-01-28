window._CACHE_JS = window._CACHE_JS || {};

class Formatter {

    static price(value) {
        value = Number(value);
        const str = value.toLocaleString(undefined, { maximumFractionDigits: 2 }).replace('-', '');
        const prefix = (value < 0 ? '-' : '') + '$';
        return prefix + str;
    }

    static number(value, signed = false) {
        const prefix = signed && value > 0 ? '+' : '';
        return prefix + Number(value).toLocaleString();
    }

    static percent(value, signed = false) {
        const prefix = signed && value > 0 ? '+' : '';
        return prefix + (100 * Number(value)).toLocaleString() + '%';
    }

}