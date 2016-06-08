import {expect} from "chai";
import {Skyscanner} from "../lib/skyscanner";

const API_KEY = process.env.SKYSCANNERJS_TEST_API_KEY;
if (!API_KEY) {
    throw new Error("You must define the environment variable SKYSCANNERJS_TEST_API_KEY");
}

describe("Skyscanner", () => {
    let skyscanner;
    beforeEach(() => {
        skyscanner = new Skyscanner(API_KEY);
    });

    const params = {
        country: "UK",
        currency: "GBP",
        locale: "en-GB",
        locationSchema: "Iata",
        originplace: "EDI",
        destinationplace: "LHR",
        outbounddate: "2016-06-13",
        adults: 1
    };

    const ipAddr = "127.0.0.1";

    describe("flights", () => {
        describe("livePrices", () => {
            describe("session", () => {
                it("should create a session", () => {
                    return skyscanner.flights.livePrices.session(params)
                        .then((response) => {
                            expect(response.status).to.equal(201);
                            expect(response.headers).to.contain.key("location");
                        });
                });
            });

            describe("poll", () => {
                it("should poll a session", () => {
                    return skyscanner.flights.livePrices.session(params)
                        .then((response) => {
                            const location = response.headers.location;
                            return location.substring(location.lastIndexOf("/") + 1);
                        })
                        .then((session) => {
                            return skyscanner.flights.livePrices.poll(session)
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
        });

        describe("bookingDetails", () => {
            describe("session", () => {
                it("should create a session", () => {
                    return skyscanner.flights.livePrices.session(params)
                        .then((response) => {
                            const location = response.headers.location;
                            return location.substring(location.lastIndexOf("/") + 1);
                        })
                        .then((session) => {
                            return skyscanner.flights.livePrices.poll(session)
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
                            return skyscanner.flights.bookingDetails.session(itinerary.session, itinerary)
                                .then((response) => {
                                    expect(response.status).to.equal(201);
                                    expect(response.headers).to.contain.key("location");
                                });
                        });
                });
            });

            describe("poll", () => {
                it("should poll a session", () => {
                    return skyscanner.flights.livePrices.session(params)
                        .then((response) => {
                            const location = response.headers.location;
                            return location.substring(location.lastIndexOf("/") + 1);
                        })
                        .then((session) => {
                            return skyscanner.flights.livePrices.poll(session)
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
                            return skyscanner.flights.bookingDetails.session(itinerary.session, itinerary)
                                .then((response) => {
                                    const location = response.headers.location;
                                    return {
                                        session: itinerary.session,
                                        itinerary: location.substring(location.lastIndexOf("/") + 1)
                                    };
                                });
                        })
                        .then((itinerary) => {
                            return skyscanner.flights.bookingDetails.poll(itinerary.session, itinerary.itinerary)
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

        describe("browse", () => {
            const query = {
                market: "UK",
                currency: "GBP",
                locale: "en-GB",
                originPlace: "EDI",
                destinationPlace: "LHR",
                outboundPartialDate: "2016-06-13"
            };

            describe("quotes", () => {
                it("should return quotes", () => {
                    return skyscanner.flights.browse.quotes(query, ipAddr)
                        .then((response) => {
                            expect(response.status).to.equal(200);
                            expect(response.data).to.contain.key("Quotes");
                        });
                });
            });

            describe("routes", () => {
                it("should return routes", () => {
                    return skyscanner.flights.browse.routes(query, ipAddr)
                        .then((response) => {
                            expect(response.status).to.equal(200);
                            expect(response.data).to.contain.key("Quotes");
                            expect(response.data).to.contain.key("Routes");
                        });
                });
            });

            describe("dates", () => {
                it("should return dates", () => {
                    return skyscanner.flights.browse.dates(query, ipAddr)
                        .then((response) => {
                            expect(response.status).to.equal(200);
                            expect(response.data).to.contain.key("Quotes");
                            expect(response.data).to.contain.key("Dates");
                        });
                });
            });

            describe("grid", () => {
                it("should return dates", () => {
                    return skyscanner.flights.browse.grid(query, ipAddr)
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
            const q = {
                market: "UK",
                currency: "GBP",
                locale: "en-GB",
                pickupplace: "EDI",
                dropoffplace: "GLA",
                pickupdatetime: "2016-06-13T19:00",
                dropoffdatetime: "2016-06-14T19:00",
                driverage: 40
            };

            describe("session", () => {
                it("should create a session", () => {
                    return skyscanner.carHire.livePrices.session(q, ipAddr)
                        .then((response) => {
                            expect(response.status).to.equal(200);
                            expect(response.headers).to.contain.key("location");
                        });
                });
            });

            describe("poll", () => {
                it("should poll the session", () => {
                    return skyscanner.carHire.livePrices.session(q, ipAddr)
                        .then((response) => {
                            const location = response.headers.location;
                            return location.substring(location.lastIndexOf("/") + 1);
                        })
                        .then((session) => {
                            return skyscanner.carHire.livePrices.poll(session)
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

    describe("reference", () => {
        describe("currencies", () => {
            it("should return a list of currencies", () => {
                return skyscanner.reference.currencies()
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
                return skyscanner.reference.locales()
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
                return skyscanner.reference.countries(locale)
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
});
