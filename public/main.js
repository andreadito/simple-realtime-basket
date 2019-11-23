const cart = (io) => {

    const print = document.getElementById("print");
    const socket = io();
    let latestRequestTimeStamp = null;
    const basket = [];

    socket.on('updateBasket', (data) => {
        const result = data.timeStamp === latestRequestTimeStamp ? data : null;

        if (result) {
            document.getElementsByClassName('total')[0].innerText = result.total;
        }
    });

    const print_basket = (basket) => {
        return JSON.stringify(basket,null,'\t').replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;');
    };

    const sendUpdateBasket = (basket) => {
        print.innerHTML = print_basket(basket);
        latestRequestTimeStamp = Date.now();
        socket.emit('calculateBasket', { timeStamp:latestRequestTimeStamp , basket});
    };

    const removeFromBasket = (id) => {
        const match = basket.filter(item => item.id === id);
        const index = basket.indexOf(match[0]);

        if(match.length > 0) {
            if(basket[index].quantity >= 2) {
                basket[index].quantity--;
            } else {
                basket.splice(index, 1);
            }
        }

        sendUpdateBasket(basket);
    };

    const addToBasket = (id) => {
        const match = basket.filter(item => item.id === id);
        const index = basket.indexOf(match[0]);

        if(match.length > 0) {
            basket[index].quantity++;
        }
        else {
            basket.push({id: id, quantity: 1});
        }

        sendUpdateBasket(basket);
    };

    return { addToBasket, removeFromBasket }
};

const app = cart(io);
