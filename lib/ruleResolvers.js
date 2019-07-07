const buy1Get1Resolver = (itemTotal, quantity, itemInfo) => {
    if(quantity%2 === 0) {
        return itemTotal - ((quantity / 2) * itemInfo.price);
    }
    return itemTotal;
};

const discountAfter3Resolver = (itemTotal, quantity, itemInfo) => {
    if(quantity >= 3) {
        return quantity * itemInfo.discountedPrice;
    }
    return itemTotal;
};

module.exports = { buy1Get1Resolver, discountAfter3Resolver };
