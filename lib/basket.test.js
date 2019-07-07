const { Basket } = require('./basket');
const { itemPricingRules } = require('../basket.config');

describe("Basket", () => {
    describe("calculate()", () => {
        const testBasket = new Basket(itemPricingRules);

        it("should return 0 if basket is null undefined or empty", async () => {
            const basketNull = null;
            const resultWithNull = await testBasket.calculate(basketNull);
            const resultWithUndefined = await testBasket.calculate(undefined);
            const resultWithEmptyArray = await testBasket.calculate([]);

            expect(resultWithNull).toBe(0);
            expect(resultWithUndefined).toBe(0);
            expect(resultWithEmptyArray).toBe(0);
        });
        it("should return 0 if basket doesn't contain existing items", async () => {
            const basket4 = [{id: "Fs1", quantity: 1 }, {id: "Sg1", quantity: 3}];
            const total = await testBasket.calculate(basket4);
            expect(total).toBe(0);
        });
        it("should return the correct total with a basket FR1, SR1, FR1, CF1", async () => {
            const basket1 = [{id: "FR1", quantity: 2 }, {id: "SR1", quantity: 1},{id: "CF1", quantity: 1}];
            const total = await testBasket.calculate(basket1);
            expect(total).toBe(19.34);
        });
        it("should return the correct total with a basket FR1, FR1", async () => {
            const basket2 = [{id: "FR1", quantity: 2 }];
            const total = await testBasket.calculate(basket2);
            expect(total).toBe(3.11);
        });
        it("should return the correct total with a basket SR1, SR1, FR1, SR1", async () => {
            const basket3 = [{id: "FR1", quantity: 1 }, {id: "SR1", quantity: 3}];
            const total = await testBasket.calculate(basket3);
            expect(total).toBe(16.61);
        });
    });
    describe("_applyItemPricingRules()", () => {
        it("should return the original total when a resolver generates an exception", () => {
            const itemPriceRulesWithErrors = {
                "FR1": [
                    {
                        type: "buy1Get1",
                        active: true,
                        resolver: () => {
                            throw new Error("bad rule!");
                        }
                    },
                ],
                "SR1": [
                    {
                        type: "discountAfter3",
                        active: true,
                        resolver: () => {
                            throw new Error("bad rule!");
                        }
                    },
                ]
            };

            const testBasket = new Basket(itemPriceRulesWithErrors);

            const itemInfo = {id: "FR1", description: 'Fruit tea', price: 3.11, discountedPrice: 3.11};

            const result = testBasket._applyItemPricingRules(100, 10, itemInfo);

            expect(result).toBe(100);

        });
        it("should invoke the resolver with correct params", () => {
            const mockedResolver = jest.fn(x => 42 + x);
            const mockedItemPriceRule = {
                "FR1": [
                    {
                        type: "buy1Get1",
                        active: true,
                        resolver: mockedResolver
                    },
                ]
            };
            const testBasket = new Basket(mockedItemPriceRule);

            const itemInfo = {id: "FR1", description: 'Fruit tea', price: 3.11, discountedPrice: 3.11};

            const result = testBasket._applyItemPricingRules(100, 10, itemInfo);

            expect(mockedResolver.mock.calls.length).toBe(1);

        })
    });
    describe("_calculateItemTotal", () => {
        const testBasket = new Basket(itemPricingRules);
        it("should return the correct item total", async () => {
            const result = await testBasket._calculateItemTotal({id: "SR1", quantity: 2});
            expect(result).toBe(10);
        });
        it("should return 0 if no itemInfo are available", async () => {
            const result = await testBasket._calculateItemTotal({id: "SH1", quantity: 2});
            expect(result).toBe(0);
        });
    })
});
