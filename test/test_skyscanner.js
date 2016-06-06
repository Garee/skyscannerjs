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

    describe("Reference", () => {
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
