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

    describe("flights", () => {
        describe("livePrices", () => {
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

            describe("session", () => {
                it("should create a session", () => {
                    return skyscanner.flights.livePrices.session(params)
                        .then((response) => {
                            expect(response.status).to.equal(201);
                            expect(response.headers).to.have.any.keys("location");
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
