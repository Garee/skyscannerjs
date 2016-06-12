import axios from "axios";
import querystring from "querystring";

export class API {
    constructor(apiKey) {
        this.apiKey = apiKey;

        this.flights = {
            livePrices: {
                session: (data, asJSON = true) => {
                    const url = API.flightPricingURL;
                    data.apiKey = apiKey;
                    data = querystring.stringify(data);
                    return axios.post(url, data, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": asJSON ? "application/json" : "application/xml"
                        }
                    });
                },
                poll: (session, params = {}) => {
                    const url = `${API.flightPricingURL}/${session}`;
                    params.apiKey = apiKey;
                    return axios.get(url, {params: params});
                },
                bookingDetails: {
                    session: (session, data) => {
                        const url = `${API.flightPricingURL}/${session}/booking`;
                        data.apiKey = apiKey;
                        data = querystring.stringify(data);
                        return axios.put(url, data);
                    },
                    poll: (session, itinerary, params = {}) => {
                        const url = `${API.flightPricingURL}/${session}/booking/${itinerary}`;
                        params.apiKey = apiKey;
                        return axios.get(url, {params: params});
                    }
                }
            },
            browse: {
                quotes: (params, asJSON = true) => {
                    let url = API.browseQuotesURL;
                    url += `/${params.market}`;
                    url += `/${params.currency}`;
                    url += `/${params.locale}`;
                    url += `/${params.originPlace}`;
                    url += `/${params.destinationPlace}`;
                    url += `/${params.outboundPartialDate}`;

                    if (params.inboundPartialDate) {
                        url += `/${params.inboundPartialDate}`;
                    }

                    return axios.get(url, {
                        headers: {
                            "Accept": asJSON ? "application/json" : "application/xml",
                            "X-Forwarded-For": params.ip
                        },
                        params: {
                            apiKey: apiKey
                        }
                    });
                },
                routes: (params, asJSON = true) => {
                    let url = API.browseRoutesURL;
                    url += `/${params.market}`;
                    url += `/${params.currency}`;
                    url += `/${params.locale}`;
                    url += `/${params.originPlace}`;
                    url += `/${params.destinationPlace}`;
                    url += `/${params.outboundPartialDate}`;

                    if (params.inboundPartialDate) {
                        url += `/${params.inboundPartialDate}`;
                    }

                    return axios.get(url, {
                        headers: {
                            "Accept": asJSON ? "application/json" : "application/xml",
                            "X-Forwarded-For": params.ip
                        },
                        params: {
                            apiKey: apiKey
                        }
                    });
                },
                dates: (params, asJSON = true) => {
                    let url = API.browseDatesURL;
                    url += `/${params.market}`;
                    url += `/${params.currency}`;
                    url += `/${params.locale}`;
                    url += `/${params.originPlace}`;
                    url += `/${params.destinationPlace}`;
                    url += `/${params.outboundPartialDate}`;

                    if (params.inboundPartialDate) {
                        url += `/${params.inboundPartialDate}`;
                    }

                    return axios.get(url, {
                        headers: {
                            "Accept": asJSON ? "application/json" : "application/xml",
                            "X-Forwarded-For": params.ip
                        },
                        params: {
                            apiKey: apiKey
                        }
                    });
                },
                grid: (params, asJSON = true) => {
                    let url = API.browseGridURL;
                    url += `/${params.market}`;
                    url += `/${params.currency}`;
                    url += `/${params.locale}`;
                    url += `/${params.originPlace}`;
                    url += `/${params.destinationPlace}`;
                    url += `/${params.outboundPartialDate}`;

                    if (params.inboundPartialDate) {
                        url += `/${params.inboundPartialDate}`;
                    }

                    return axios.get(url, {
                        headers: {
                            "Accept": asJSON ? "application/json" : "application/xml",
                            "X-Forwarded-For": params.ip
                        },
                        params: {
                            apiKey: apiKey
                        }
                    });
                }
            }
        };

        this.carHire = {
            livePrices: {
                session: (params, asJSON = true) => {
                    let url = API.carHirePricingURL;
                    url += `/${params.market}`;
                    url += `/${params.currency}`;
                    url += `/${params.locale}`;
                    url += `/${params.pickupplace}`;
                    url += `/${params.dropoffplace}`;
                    url += `/${params.pickupdatetime}`;
                    url += `/${params.dropoffdatetime}`;
                    url += `/${params.driverage}`;

                    return axios.get(url, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": asJSON ? "application/json" : "application/xml"
                        },
                        params: {
                            apiKey: apiKey,
                            userip: params.ip
                        }
                    });
                },
                poll: (session, deltaExcludedWebsites) => {
                    const url = `${API.carHirePricingURL}/${session}`;

                    let params = {};
                    if (deltaExcludedWebsites) {
                        params.deltaExcludedWebsites = deltaExcludedWebsites;
                    }

                    return axios.get(url, {params: params});
                }
            }
        };

        this.hotels = {
            livePrices: {
                session: (params, asJSON = true) => {
                    let url = API.hotelPricingURL;
                    url += `/${params.market}`;
                    url += `/${params.currency}`;
                    url += `/${params.locale}`;
                    url += `/${params.entityId}`;
                    url += `/${params.checkindate}`;
                    url += `/${params.checkoutdate}`;
                    url += `/${params.guests}`;
                    url += `/${params.rooms}`;

                    return axios.get(url, {
                        headers: {
                            "Accept": asJSON ? "application/json" : "application/xml"
                        },
                        params: {
                            apiKey: apiKey
                        }
                    });
                },
                poll: (session, params = {}) => {
                    const url = `${API.hotelPricingURL}/${session}`;
                    return axios.get(url, {params: params});
                },
                details: {
                    session: (session, params) => {
                        const url = `${API.hotelDetailsURL}/details/${session}`;
                        return axios.get(url, {params: params});
                    },
                    poll: (session, params) => {
                        const url = `${API.hotelDetailsURL}/polldetails/${session}`;
                        return axios.get(url, {params: params});
                    }
                }
            },
            autosuggest: (params, asJSON = true) => {
                let url = API.hotelAutosuggestURL;
                url += `/${params.market}`;
                url += `/${params.currency}`;
                url += `/${params.locale}`;
                url += `/${params.query}`;

                return axios.get(url, {
                    headers: {
                        "Accept": asJSON ? "application/json" : "application/xml"
                    },
                    params: {
                        apiKey: apiKey
                    }
                });
            }
        };

        this.reference = {
            currencies: () => {
                const url = `${API.referenceURL}/currencies`;
                return axios.get(url, {
                    params: {
                        apiKey: apiKey
                    }
                });
            },
            locales: () => {
                const url = `${API.referenceURL}/locales`;
                return axios.get(url, {
                    params: {
                        apiKey: apiKey
                    }
                });
            },
            countries: (locale) => {
                const url = `${API.referenceURL}/countries/${locale}`;
                return axios.get(url, {
                    params: {
                        apiKey: apiKey
                    }
                });
            }
        };

        this.locationAutosuggest = (params, asJSON = true) => {
            let url = API.locationAutosuggestURL;
            url += `/${params.market}`;
            url += `/${params.currency}`;
            url += `/${params.locale}`;

            let reqParams = {
                apiKey: apiKey
            };

            if (params.query) {
                reqParams.query = params.query;
            } else {
                reqParams.id = params.id;
            }

            return axios.get(url, {
                headers: {
                    "Accept": asJSON ? "application/json" : "application/xml"
                },
                params: reqParams
            });
        };

        this.referral = (params) => {
            let url = API.referralURL;
            url += `/${params.market}`;
            url += `/${params.currency}`;
            url += `/${params.locale}`;
            url += `/${params.originPlace}`;
            url += `/${params.destinationPlace}`;
            url += `/${params.outboundPartialDate}`;

            if (params.inboundPartialDate) {
                url += `/${params.inboundPartialDate}`;
            }

            return axios.get(url, {
                headers: {
                    "X-Forwarded-For": params.ip
                },
                params: {
                    apiKey: apiKey
                }
            });
        };
    }

    static get baseURL() {
        return "http://partners.api.skyscanner.net/apiservices";
    }

    static get referenceURL() {
        return `${API.baseURL}/reference/v1.0`;
    }

    static get flightPricingURL() {
        return `${API.baseURL}/pricing/v1.0`;
    }

    static get browseQuotesURL() {
        return `${API.baseURL}/browsequotes/v1.0`;
    }

    static get browseRoutesURL() {
        return `${API.baseURL}/browseroutes/v1.0`;
    }

    static get browseDatesURL() {
        return `${API.baseURL}/browsedates/v1.0`;
    }

    static get browseGridURL() {
        return `${API.baseURL}/browsegrid/v1.0`;
    }

    static get carHirePricingURL() {
        return `${API.baseURL}/carhire/liveprices/v2`;
    }

    static get hotelPricingURL() {
        return `${API.baseURL}/hotels/liveprices/v2`;
    }

    static get hotelDetailsURL() {
        return `${API.baseURL}/hotels/livedetails/v2`;
    }

    static get hotelAutosuggestURL() {
        return `${API.baseURL}/hotels/autosuggest/v2`;
    }

    static get locationAutosuggestURL() {
        return `${API.baseURL}/autosuggest/v1.0`;
    }

    static get referralURL() {
        return `${API.baseURL}/referral/v1.0`;
    }
}
