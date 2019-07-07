const cart = (io) => {

    const print = document.getElementById("print");
    const socket = io();
    let responses = [];
    const basket = [];

    socket.on('updateBasket', (data) => {
        // TODO: in a real-world scenario, should be emptied in another external service or another thread
        responses.push(data);

        // TODO: in a real-world scenario, the reordering should be implemented in another external service or another thread.
        const reordered = responses.sort((a,b) => {
            return new Date(b.timeStamp) - new Date(a.timeStamp);
        });


        // TODO: in a real-world this should be an observable field
        document.getElementsByClassName('total')[0].innerText = reordered[0].total;

    });

    const print_basket = (basket) => {
        return JSON.stringify(basket,null,'\t').replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;');
    };

    const sendUpdateBasket = (basket) => {
        print.innerHTML = print_basket(basket);
        socket.emit('calculateBasket', { timeStamp: Date.now(), basket});
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

    return { addToBasket, removeFromBasket}
};

const app = cart(io);
