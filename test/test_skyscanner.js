import {expect} from "chai";
import {API} from "../lib/skyscanner";

const API_KEY = process.env.SKYSCANNERJS_TEST_API_KEY;
if (!API_KEY) {
    throw new Error("You must define the environment variable SKYSCANNERJS_TEST_API_KEY");
}

describe("API", () => {
    let api;
    let startDate;
    let endDate;

    beforeEach(() => {
        api = new API(API_KEY);

        let date = new Date()
        startDate = date.toISOString().split("T")[0]
        date.setMonth(date.getMonth() + 1)
        endDate = date.toISOString().split("T")[0]
    });

    describe("flights", () => {
        describe("livePrices", () => {
            describe("session", () => {
                it("should create a session", () => {
                    return api.flights.livePrices.session({
                        country: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        locationSchema: "Iata",
                        originplace: "EDI",
                        destinationplace: "LHR",
                        outbounddate: startDate,
                        adults: 1
                    })
                    .then((response) => {
                        expect(response.status).to.equal(201);
                        expect(response.headers).to.contain.key("location");
                    });
                });
            });

            describe("poll", () => {
                it("should poll a session", () => {
                    return api.flights.livePrices.session({
                        country: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        locationSchema: "Iata",
                        originplace: "EDI",
                        destinationplace: "LHR",
                        outbounddate: startDate,
                        adults: 1
                    })
                    .then((response) => {
                        return response.headers.location;
                    })
                    .then((session) => {
                        return api.flights.livePrices.poll(session)
                            .then((response) => {
                                expect(response.status).to.equal(200);

                                const keys = [
                                    "Itineraries",
                                    "Legs",
                                    "Carriers",
                                    "Agents",
                                    "Places",
                                    "Currencies"
                                ];

                                expect(response.data).to.contain.all.keys(keys);
                            });
                    });
                });
            });

            describe("bookingDetails", () => {
                describe("session", () => {
                    it("should create a session", () => {
                        return api.flights.livePrices.session({
                            country: "UK",
                            currency: "GBP",
                            locale: "en-GB",
                            locationSchema: "Iata",
                            originplace: "EDI",
                            destinationplace: "LHR",
                            outbounddate: startDate,
                            adults: 1
                        })
                        .then((response) => {
                            return response.headers.location;
                        })
                        .then((session) => {
                            return api.flights.livePrices.poll(session)
                                .then((response) => {
                                    const itineraries = response.data.Itineraries;
                                    const itinerary = itineraries[0];
                                    return {
                                        session: session,
                                        outboundlegid: itinerary.OutboundLegId,
                                        inboundlegid: itinerary.InboundLegId
                                    };
                                });
                        })
                        .then((itinerary) => {
                            return api.flights.livePrices.bookingDetails.session(itinerary.session, {
                                outboundlegid: itinerary.outboundlegid,
                                inboundlegid: itinerary.inboundlegid
                            })
                            .then((response) => {
                                expect(response.status).to.equal(201);
                                expect(response.headers).to.contain.key("location");
                            });
                        });
                    });
                });

                describe("poll", () => {
                    it("should poll a session", () => {
                        return api.flights.livePrices.session({
                            country: "UK",
                            currency: "GBP",
                            locale: "en-GB",
                            locationSchema: "Iata",
                            originplace: "EDI",
                            destinationplace: "LHR",
                            outbounddate: startDate,
                            adults: 1
                        })
                        .then((response) => {
                            return response.headers.location;
                        })
                        .then((session) => {
                            return api.flights.livePrices.poll(session)
                                .then((response) => {
                                    const itineraries = response.data.Itineraries;
                                    const itinerary = itineraries[0];
                                    return {
                                        session: session,
                                        outboundlegid: itinerary.OutboundLegId,
                                        inboundlegid: itinerary.InboundLegId
                                    };
                                });
                        })
                        .then((itinerary) => {
                            return api.flights.livePrices.bookingDetails.session(itinerary.session, {
                                outboundlegid: itinerary.outboundlegid,
                                inboundlegid: itinerary.inboundlegid
                            })
                            .then((response) => {
                                const location = response.headers.location;
                                return {
                                    session: itinerary.session,
                                    itinerary: location.substring(location.lastIndexOf("/") + 1)
                                };
                            });
                        })
                        .then((itinerary) => {
                            return api.flights.livePrices.bookingDetails.poll(itinerary.session, itinerary.itinerary)
                                .then((response) => {
                                    expect(response.status).to.equal(200);

                                    const keys = [
                                        "Segments",
                                        "BookingOptions",
                                        "Places"
                                    ];

                                    expect(response.data).to.contain.all.keys(keys);
                                });
                        });
                    });
                });
            });
        });

        describe("browse", () => {
            describe("quotes", () => {
                it("should return quotes", () => {
                    return api.flights.browse.quotes({
                        market: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        originPlace: "EDI",
                        destinationPlace: "LHR",
                        outboundPartialDate: startDate,
                        ip: "127.0.0.1"
                    })
                    .then((response) => {
                        expect(response.status).to.equal(200);
                        expect(response.data).to.contain.key("Quotes");
                    });
                });
            });

            describe("routes", () => {
                it("should return routes", () => {
                    return api.flights.browse.routes({
                        market: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        originPlace: "EDI",
                        destinationPlace: "LHR",
                        outboundPartialDate: startDate,
                        ip: "127.0.0.1"
                    })
                    .then((response) => {
                        expect(response.status).to.equal(200);
                        expect(response.data).to.contain.key("Quotes");
                        expect(response.data).to.contain.key("Routes");
                    });
                });
            });

            describe("dates", () => {
                it("should return dates", () => {
                    return api.flights.browse.dates({
                        market: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        originPlace: "EDI",
                        destinationPlace: "LHR",
                        outboundPartialDate: startDate,
                        ip: "127.0.0.1"
                    })
                    .then((response) => {
                        expect(response.status).to.equal(200);
                        expect(response.data).to.contain.key("Quotes");
                        expect(response.data).to.contain.key("Dates");
                    });
                });
            });

            describe("grid", () => {
                it("should return dates", () => {
                    return api.flights.browse.grid({
                        market: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        originPlace: "EDI",
                        destinationPlace: "LHR",
                        outboundPartialDate: startDate,
                        ip: "127.0.0.1"
                    })
                    .then((response) => {
                        expect(response.status).to.equal(200);
                        expect(response.data).to.contain.key("Dates");
                    });
                });
            });
        });
    });

    describe("carHire", () => {
        describe("livePrices", () => {
            describe("session", () => {
                it("should create a session", () => {
                    return api.carHire.livePrices.session({
                        market: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        pickupplace: "EDI",
                        dropoffplace: "GLA",
                        pickupdatetime: startDate + "T19:00",
                        dropoffdatetime: endDate + "T19:00",
                        driverage: 40,
                        ip: "127.0.0.1"
                    })
                    .then((response) => {
                        expect(response.status).to.equal(200);
                        expect(response.headers).to.contain.key("location");
                    });
                });
            });

            describe("poll", () => {
                it("should poll the session", () => {
                    return api.carHire.livePrices.session({
                        market: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        pickupplace: "EDI",
                        dropoffplace: "GLA",
                        pickupdatetime: startDate + "T19:00",
                        dropoffdatetime: endDate + "T19:00",
                        driverage: 40,
                        ip: "127.0.0.1"
                    })
                    .then((response) => {
                        return `http://partners.api.skyscanner.net${response.headers.location}`;
                    })
                    .then((session) => {
                        return api.carHire.livePrices.poll(session)
                            .then((response) => {
                                expect(response.status).to.equal(200);

                                const keys = [
                                    "cars",
                                    "websites"
                                ];

                                expect(response.data).to.contain.keys(keys);
                            });
                    });
                });
            });
        });
    });

    describe("hotels", () => {
        describe("livePrices", () => {
            describe("session", () => {
                it("should create a session", () => {
                    return api.hotels.livePrices.session({
                        market: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        entityId: "41.37,2.14-latlong",
                        checkindate: startDate,
                        checkoutdate: endDate,
                        guests: 1,
                        rooms: 1
                    })
                    .then((response) => {
                        expect(response.status).to.equal(200);
                        expect(response.headers).to.contain.key("location");
                    });
                });
            });

            describe("poll", () => {
                it("should poll a session", () => {
                    return api.hotels.livePrices.session({
                        market: "UK",
                        currency: "GBP",
                        locale: "en-GB",
                        entityId: "41.37,2.14-latlong",
                        checkindate: startDate,
                        checkoutdate: endDate,
                        guests: 1,
                        rooms: 1
                    })
                    .then((response) => {
                        return `http://partners.api.skyscanner.net${response.headers.location}`;
                    })
                    .then((session) => {
                        return api.hotels.livePrices.poll(session)
                            .then((response) => {
                                expect(response.status).to.equal(200);

                                const keys = [
                                    "status",
                                    "hotels",
                                    "hotels_prices"
                                ];

                                expect(response.data).to.contain.keys(keys);
                            });
                    });
                });
            });

            describe("details", () => {
                describe("session", () => {
                    it("should create a details session", () => {
                        return api.hotels.livePrices.session({
                            market: "UK",
                            currency: "GBP",
                            locale: "en-GB",
                            entityId: "41.37,2.14-latlong",
                            checkindate: startDate,
                            checkoutdate: endDate,
                            guests: 1,
                            rooms: 1
                        })
                        .then((response) => {
                            const location = response.headers.location;
                            return location.substring(location.lastIndexOf("/") + 1);
                         })
                         .then((session) => {
                             return api.hotels.livePrices.details.session(session, {
                                 HotelIds: "1,2,3"
                             })
                             .then((response) => {
                                 expect(response.status).to.equal(200);
                             });
                         });
                    });
                });
                describe("poll", () => {
                    it("should poll a session", () => {
                        return api.hotels.livePrices.session({
                            market: "UK",
                            currency: "GBP",
                            locale: "en-GB",
                            entityId: "41.37,2.14-latlong",
                            checkindate: startDate,
                            checkoutdate: endDate,
                            guests: 1,
                            rooms: 1
                        })
                        .then((response) => {
                            const location = response.headers.location;
                            return location.substring(location.lastIndexOf("/") + 1);
                         })
                         .then((session) => {
                             return api.hotels.livePrices.details.session(session, {
                                 HotelIds: "1,2,3"
                             })
                             .then(() => {
                                 return session;
                             });
                         })
                         .then((session) => {
                             return api.hotels.livePrices.details.poll(session, {
                                 HotelIds: "1,2,3"
                             })
                             .then((response) => {
                                 expect(response.status).to.equal(200);
                             });
                         });
                    });
                });
            });
        });

        describe("autosuggest", () => {
            it("should suggest places", () => {
                return api.hotels.autosuggest({
                    market: "UK",
                    currency: "GBP",
                    locale: "en-GB",
                    query: "pari"
                })
                .then((response) => {
                    expect(response.status).to.equal(200);

                    const keys = [
                        "results",
                        "places"
                    ];

                    expect(response.data).to.contain.keys(keys);
                });
            });
        });
    });

    describe("reference", () => {
        describe("currencies", () => {
            it("should return a list of currencies", () => {
                return api.reference.currencies()
                    .then((response) => {
                        expect(response.status).to.equal(200);

                        expect(response.data).to.have.key("Currencies");
                        expect(response.data.Currencies.length).to.not.equal(0);

                        const keys = [
                            "Code",
                            "DecimalDigits",
                            "DecimalSeparator",
                            "RoundingCoefficient",
                            "SpaceBetweenAmountAndSymbol",
                            "Symbol",
                            "SymbolOnLeft",
                            "ThousandsSeparator"
                        ];

                        const currency = response.data.Currencies[0];
                        expect(currency).to.have.keys(keys);
                    });
            });
        });

        describe("locales", () => {
            it("should return a list of locales", () => {
                return api.reference.locales()
                    .then((response) => {
                        expect(response.status).to.equal(200);

                        expect(response.data).to.have.key("Locales");
                        expect(response.data.Locales.length).to.not.equal(0);

                        const keys = [
                            "Code",
                            "Name"
                        ];

                        const locale = response.data.Locales[0];
                        expect(locale).to.have.keys(keys);
                    });
            });
        });

        describe("countries", () => {
            it("should return a list of countries", () => {
                const locale = "en-GB";
                return api.reference.countries(locale)
                    .then((response) => {
                        expect(response.status).to.equal(200);

                        expect(response.data).to.have.key("Countries");
                        expect(response.data.Countries.length).to.not.equal(0);

                        const keys = [
                            "Code",
                            "Name"
                        ];

                        const market = response.data.Countries[0];
                        expect(market).to.have.keys(keys);
                    });
            });
        });
    });

    describe("locationAutosuggest", () => {
        it("should return a list of places", () => {
            return api.locationAutosuggest({
                market: "UK",
                currency: "GBP",
                locale: "en-GB",
                query: "ed"
            })
            .then((response) => {
                expect(response.status).to.equal(200);
                expect(response.data).to.contain.key("Places");
            });
        });

        it("should return details for a place", () => {
            return api.locationAutosuggest({
                market: "UK",
                currency: "GBP",
                locale: "en-GB",
                id: "EDI-sky"
            })
            .then((response) => {
                expect(response.status).to.equal(200);
                expect(response.data).to.contain.key("Places");
            });
        });
    });
});
