import axios from "axios";

export class Skyscanner {
    constructor(apiKey) {
        this.apiKey = apiKey;

        this.reference = {
            currencies: () => {
                const url = `${Skyscanner.referenceURL}/currencies`;
                return this.get(url);
            },
            locales: () => {
                const url = `${Skyscanner.referenceURL}/locales`;
                return this.get(url);
            },
            countries: (locale) => {
                const url = `${Skyscanner.referenceURL}/countries/${locale}`;
                return this.get(url);
            }
        };
    }

    static get baseURL() {
        return "http://partners.api.skyscanner.net/apiservices";
    }

    static get referenceURL() {
        return `${Skyscanner.baseURL}/reference/v1.0`;
    }

    static get locationSchemas() {
        return [
            "Iata",
            "GeoNameCode",
            "GeoNameId",
            "Rnid",
            "Sky"
        ];
    }

    static get carrierSchemas() {
        return [
            "Iata",
            "Icao",
            "Skyscanner"
        ];
    }

    get(url, params, config) {
        return this.request(axios.get, url, params, config);
    }

    post(url, params, config) {
        return this.request(axios.post, url, params, config);
    }

    put(url, params, config) {
        return this.request(axios.put, url, params, config);
    }

    request(method, url, params = {}, config = {}) {
        config.params = config.params || params;
        config.params.apiKey = this.apiKey;
        return method(url, config);
    }
}
