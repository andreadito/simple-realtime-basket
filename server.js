const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { Basket } = require('./lib/basket');
const { itemPricingRules } = require('./basket.config');

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {

    const acmeBasket = new Basket(itemPricingRules);

    socket.on('calculateBasket', async ({ timeStamp, basket }) => {

        const total = await acmeBasket.calculate(basket);

        const result = {
            timeStamp,
            total: total ,
        };

        socket.emit('updateBasket',result);
    });
});

server.listen(port, () => {
    console.log('ACME SERVICE listening at port %d', port);
});

