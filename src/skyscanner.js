import axios from "axios";
import querystring from "querystring";

export class Skyscanner {
    constructor(apiKey) {
        this.apiKey = apiKey;

        this.flights = {
            livePrices: {
                session: (data, asJSON = true) => {
                    const url = `${Skyscanner.flightPricingURL}`;
                    const headers = {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": asJSON ? "application/json" : "application/xml"
                    };
                    return this.post(url, data, {headers: headers});
                },
                poll: (session, params) => {
                    const url = `${Skyscanner.flightPricingURL}/${session}`;
                    return this.get(url, params);
                }
            },
            bookingDetails: {
                session: (session, data) => {
                    const url = `${Skyscanner.flightPricingURL}/${session}/booking`;
                    return this.put(url, data);
                },
                poll: (session, itinerary, params) => {
                    const url = `${Skyscanner.flightPricingURL}/${session}/booking/${itinerary}`;
                    return this.get(url, params);
                }
            },
            browse: {
                quotes: (params, ipAddr, asJSON = true) => {
                    let url = Skyscanner.browseQuotesURL;
                    url += `/${params.market}`;
                    url += `/${params.currency}`;
                    url += `/${params.locale}`;
                    url += `/${params.originPlace}`;
                    url += `/${params.destinationPlace}`;
                    url += `/${params.outboundPartialDate}`;

                    if (params.inboundPartialDate) {
                        url += `/${params.inboundPartialDate}`;
                    }

                    const headers = {
                        "Accept": asJSON ? "application/json" : "application/xml",
                        "X-Forwarded-For": ipAddr
                    };
                    return this.get(url, {}, {headers: headers});
                },
                routes: (params, ipAddr, asJSON = true) => {
                    let url = Skyscanner.browseRoutesURL;
                    url += `/${params.market}`;
                    url += `/${params.currency}`;
                    url += `/${params.locale}`;
                    url += `/${params.originPlace}`;
                    url += `/${params.destinationPlace}`;
                    url += `/${params.outboundPartialDate}`;

                    if (params.inboundPartialDate) {
                        url += `/${params.inboundPartialDate}`;
                    }

                    const headers = {
                        "Accept": asJSON ? "application/json" : "application/xml",
                        "X-Forwarded-For": ipAddr
                    };
                    return this.get(url, {}, {headers: headers});
                },
                dates: (params, ipAddr, asJSON = true) => {
                    let url = Skyscanner.browseDatesURL;
                    url += `/${params.market}`;
                    url += `/${params.currency}`;
                    url += `/${params.locale}`;
                    url += `/${params.originPlace}`;
                    url += `/${params.destinationPlace}`;
                    url += `/${params.outboundPartialDate}`;

                    if (params.inboundPartialDate) {
                        url += `/${params.inboundPartialDate}`;
                    }

                    const headers = {
                        "Accept": asJSON ? "application/json" : "application/xml",
                        "X-Forwarded-For": ipAddr
                    };
                    return this.get(url, {}, {headers: headers});
                }
            }
        };

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

    static get flightPricingURL() {
        return `${Skyscanner.baseURL}/pricing/v1.0`;
    }

    static get browseQuotesURL() {
        return `${Skyscanner.baseURL}/browsequotes/v1.0`;
    }

    static get browseRoutesURL() {
        return `${Skyscanner.baseURL}/browseroutes/v1.0`;
    }

    static get browseDatesURL() {
        return `${Skyscanner.baseURL}/browsedates/v1.0`;
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

    static get cabinClasses() {
        return [
            "Economy",
            "PremiumEconomy",
            "Business",
            "First"
        ];
    }

    static get sortTypes() {
        return [
            "carrier",
            "duration",
            "outboundarrivetime",
            "outbounddeparttime",
            "inboundarrivetime",
            "inbounddeparttime",
            "price"
        ];
    }

    get(url, params = {}, config = {}) {
        config.params = config.params || params;
        config.params.apiKey = this.apiKey;
        return axios.get(url, config);
    }

    post(url, data = {}, config = {}) {
        data.apiKey = this.apiKey;
        data = querystring.stringify(data);
        return axios.post(url, data, config);
    }

    put(url, data = {}, config = {}) {
        data.apiKey = this.apiKey;
        data = querystring.stringify(data);
        return axios.put(url, data, config);
    }
}
