const { buy1Get1Resolver, discountAfter3Resolver } = require('./lib/ruleResolvers');

const itemPricingRules = {
    "FR1": [
        {
            type: "buy1Get1",
            active: true,
            resolver: buy1Get1Resolver
        },
    ],
    "SR1": [
        {
            type: "discountAfter3",
            active: true,
            resolver: discountAfter3Resolver
        },
    ]
};

module.exports = { itemPricingRules };
