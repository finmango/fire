window._CACHE_JS = window._CACHE_JS || {};

class CacheHelper {

    static async _memoize(cacheKey, callback, cacheStore = window._CACHE_JS) {
        if (!(cacheKey in cacheStore)) cacheStore[cacheKey] = await callback();
        return cacheStore[cacheKey];
    }

    static async loadGoogleCharts(packages = ['corechart']) {
        return CacheHelper._memoize('gcharts:' + packages.join(','), () =>
            google.charts.load('current', { packages: packages }));
    }

    static fetch(url, resolution = 1000 * 10) {
        url += url.includes('?') ? '&' : '?';
        url += 'cache_timestamp=' + Math.floor(new Date().getTime() / resolution);
        return CacheHelper._memoize(url, () => fetch(url).then(res => res.clone()));
    }

}