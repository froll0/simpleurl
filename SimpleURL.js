/*
* Fast URL access
*/
class SimpleURL {
    constructor(url) {
        try {
            if (typeof url === 'string') {
                this.location = new URL(url);
            }
            else if (!url) {
                this.location = new URL(window.location);
            }
        }
        catch (e) {
            SimpleURL.#error("invalid", {variableName: "url", variableType: "string", value: url});
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
    static #error(type, extra) {
        var errorMsg;

        switch (type) {
            case "invalid":
                errorMsg = extra.variableName + "(" + extra.variableType + ")" + " {" + extra.value + ": " + SimpleURL.#varType(extra.value) + "} invalid!";
                break;

            case "custom":
                errorMsg = extra;
                break;

            default:
                errorMsg = "Generic error";
                break;
        }

        try {
            throw new Error(errorMsg);
        }
        catch (e) {
            console.error(e.name + ': ' + e.message);
        }

        return false;
    }

    /*
     * Class methods
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
     * params = Object
     */
    add(params) {
        if (SimpleURL.#varType(params) !== 'Object' || params === null) {
            SimpleURL.#error("invalid", {variableName: "params", variableType: "object", value: params});
        }

        for (var param in params) {
            this.location.searchParams.append(param, params[param]);
        }

        return this;
    }

    /*
     * Remove params from url
     * params = Array || String
     */
    remove(params) {
        params = SimpleURL.#objToArray(params);

        if (SimpleURL.#varType(params) === 'Array') {
            params.forEach(function(param) {
                this.location.searchParams.delete(param);
            });
        }
        else {
            this.location.searchParams.delete(params);
        }

        return this;
    }

    /*
     * Remove old selected params and add new params
     * paramsRemove = Array || String
     * paramsAdd = Object
     */
    replace(paramsRemove, paramsAdd) {
        this.remove(paramsRemove).add(paramsAdd);
        return this;
    }

    /*
     * Change param's values
     * If not found, it is added
     * params = Object
     */
    change(params) {
        if (SimpleURL.#varType(params) !== 'Object' || params === null) {
            SimpleURL.#error("invalid", {variableName: "params", variableType: "object", value: params});
        }

        for (var param in params) {
            this.location.searchParams.set(param, params[param]);
        }

        return this;
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
            SimpleURL.#error("invalid", {variableName: "params", variableType: "object", value: params});
        }
    }

    /*
     * Remove all params from url
     */
    clean() {
        this.location.search = "";

        return this;
    }

    /*
     * Get compiled url
     */
    value() {
        return this.location.href;
    }
}