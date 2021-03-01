/*
 * Fast URL access by @froll0
 */
class SimpleURL {
    constructor(url) {
        try {
            if (typeof url === 'string') {
                this.location = new URL(url);
            }
            else if (!url) {
                this.location = window.location;
            }

            this.href = this.location.href;
        }
        catch (e) {
            SimpleURL.#error("url {" + url + ": " + SimpleURL.#varType(url) + "} invalid!");
        }
    }

    /*
     * Private utility
     */

    /*
     * Get the real type of a variable
     */
    static #varType(variable) {
        return (Object.prototype.toString.call(variable).split(" "))[1].slice(0, -1);
    }

    /*
     * Array from object
     */
    static #objToArray(object) {
        if (this.#varType(object) === 'Object' && object !== null) {
            object = Object.values(object);
        }

        return object;
    }

    /*
     * Simple error manage
     */
    static #error(errorMsg) {
        try {
            throw new Error(errorMsg);
        }
        catch (e) {
            console.error(e.name + ': ' + e.message);
        }

        return false;
    }

    /*
     * Class function
     */

    /*
     * Get specific params from url
     * params = Array || String
     */
    get(params) {
        params = SimpleURL.#objToArray(params);

        var urlParams = new URLSearchParams(this.location.search);

        var returnParams;
        if (SimpleURL.#varType(params) === 'Array') {
            returnParams = new []();

            params.forEach(function(param) {
                returnParams.push(urlParams.get(param));
            });
        }
        else {
            returnParams = urlParams.get(params);
        }

        return returnParams;
    }

    /*
     * Add params to url
     * params = Object || String
     */
    add(params) {
        var hrefUrl = new URL(this.href);

        if (SimpleURL.#varType(params) !== 'Object' || params === null) {
            SimpleURL.#error("params {" + params + ": " + SimpleURL.#varType(params) + "} is a required object.");
        }

        for (var param in params) {
            hrefUrl.searchParams.append(param, params[param]);
        }

        return hrefUrl.href;
    }

    /*
     * Remove params to url
     * params = Object || String
     */
    remove(params) {
        params = SimpleURL.#objToArray(params);

        var hrefUrl = new URL(this.href);

        if (SimpleURL.#varType(params) === 'Array') {
            params.forEach(function(param) {
                hrefUrl.searchParams.delete(param);
            });
        }
        else {
            hrefUrl.searchParams.delete(params);
        }

        return hrefUrl.href;
    }

    /*
     * Create a new url with specific params
     * params = Object
     */
    build(params) {
        var buildedUrl = new URL(this.location.origin + this.location.pathname);

        if (SimpleURL.#varType(params) === 'Object' && params !== null) {
            for (var param in params) {
                buildedUrl.searchParams.append(param, params[param]);
            }

            return buildedUrl.href;
        }
        else {
            SimpleURL.#error("params {" + params + ": " + SimpleURL.#varType(params) + "} is a required object.");
        }
    }

    /*
     * Remove all params from url
     */
    clean() {
        var cleanedUrl = new URL(this.href);
        cleanedUrl.search = "";

        return cleanedUrl.href;
    }
}