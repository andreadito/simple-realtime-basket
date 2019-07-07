const { mockedData } = require('./mockedData');

class Basket {
    constructor(itemPricingRules = []) {
        this.itemPricingRules = itemPricingRules;
    }

    _applyItemPricingRules (itemTotal, quantity, itemInfo) {
        let result = itemTotal;

        const rulesToApply = this.itemPricingRules[itemInfo.id];

        if(rulesToApply) {
            rulesToApply.forEach((rule) => {
                if (rule.active) {
                    try {
                        result = rule.resolver(itemTotal, quantity, itemInfo);
                    } catch (e) {
                        console.log(e);
                        return result;
                    }
                }
            });
        }

        return result;
    }

    async _calculateItemTotal(basketItem) {
        const itemInfo = await this._getItemInfo(basketItem.id);

        if(itemInfo) {
            const itemTotal = itemInfo.price * basketItem.quantity;

            return this._applyItemPricingRules(itemTotal, basketItem.quantity, itemInfo);
        }

        return 0;

    }

    async _getItemInfo(id) {
        // ToDo: in the real-world this return should be cached
        // Emulating slow network condition using .5s of delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(mockedData.get(id));
            }, 500);
        });
    }

    async calculate(basketItems) {

        // ToDo: for brevity we will return just total but in the future we can return an object with more information

        if(basketItems && basketItems.length > 0) {
            return await basketItems.reduce(async (acc, basketItem) => {

                const itemTotal = await this._calculateItemTotal(basketItem);

                const partial = await acc;

                return partial + itemTotal;

            }, Promise.resolve(0));
        }

        return 0;
    }
}

module.exports = {
    Basket
};
