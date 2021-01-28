const EVENT_RELOAD = 'component-reload';

class ComponentHelper {

    constructor() {
        this._form = null;
    }

    static saveFormData(form, refresh = false) {
        const elems = [].slice.call(form.querySelectorAll('input, select'));

        const url = new URL(window.location.href);
        elems.forEach(elem => url.searchParams.set(elem.id, elem.value));

        if (refresh) window.location.href = url;
        else window.history.pushState({}, '', url);
    }

    static loadFormData(form) {
        const url = new URL(window.location);

        const removeKeys = [];
        url.searchParams.forEach((value, key) => {
            const elem = form.querySelector(`#${key}`);
            if (!elem) removeKeys.push(key);
            else elem.value = value;
        });

        // Clean up URL params which have no use
        // removeKeys.forEach(key => url.searchParams.delete(key));

        window.history.replaceState({}, '', url);
    }

    onLoad(loadFunction) {
        this._onload = loadFunction;

        (async () => {

            // Symbol is a very common parameter, assign it on user's behalf upon attach
            const symbol = new URLSearchParams(window.location.search).get('symbol');
            if (symbol) {
                const symbolElem = this._form.querySelector('#symbol');
                if (symbolElem) symbolElem.value = symbol;
                else this._form.attach('input', { 'type': 'hidden', 'id': 'symbol', 'value': symbol });
            }

            [EVENT_RELOAD, 'popstate'].forEach(eventName => {
                window.addEventListener(eventName, () => {
                    if (this._form) ComponentHelper.loadFormData(this._form);
                    loadFunction();
                });
            });

        })();

        return this;
    }

    init() {
        if (this._form) ComponentHelper.loadFormData(this._form);
        this._onload();
    }

    addFormData(form) {
        this._form = form;
        const inputElements = [].slice.call(form.querySelectorAll('input, select'));

        inputElements.forEach(elem => {
            elem.addEventListener('change', () => {
                ComponentHelper.saveFormData(form, elem.dataset['refresh']);
                window.dispatchEvent(new Event(EVENT_RELOAD));
            });
        });

        return this;
    }
}
