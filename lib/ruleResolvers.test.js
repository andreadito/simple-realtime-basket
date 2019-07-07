const { buy1Get1Resolver, discountAfter3Resolver } = require("./ruleResolvers");

describe("ruleResolvers", () => {
    describe("buy1Get1Resolver", () => {
        it("should return the originalItemTotal if the quantity is 3", () => {

            const itemInfo = {id: "FR1", description: 'Fruit tea', price: 3.11, discountedPrice: 3.11};

            const result = buy1Get1Resolver(6.22, 3, itemInfo);

            expect(result).toBe(6.22);

        });
        it("should return the correctTotal with the applied rule if the quantity is 2", () => {

            const itemInfo = {id: "FR1", description: 'Fruit tea', price: 3.11, discountedPrice: 3.11};

            const result = buy1Get1Resolver(6.22, 2, itemInfo);

            expect(result).toBe(3.11);

        });

    });
    describe("discountAfter3Resolver", () => {
        it("should return the originalItemTotal if the quantity is < 3", () => {
            const itemInfo = {id: "SR1", description: 'Strawberries', price: 5, discountedPrice: 4.50};

            const result = discountAfter3Resolver(10, 2, itemInfo);

            expect(result).toBe(10);
        });
        it("should return the correctTotal with applied rule if quantity is >= 3", () => {
            const itemInfo = {id: "SR1", description: 'Strawberries', price: 5, discountedPrice: 4.50};

            const result = discountAfter3Resolver(15, 3, itemInfo);

            expect(result).toBe(13.5);
        });
    })
});
