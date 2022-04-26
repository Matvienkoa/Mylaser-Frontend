const number = new URL (location.href).searchParams.get('order');
const numberOrder = document.getElementById('number-order');
const token = localStorage.getItem('customer');
const dateOrder = document.getElementById('date-order');
const statusOption = document.getElementById('select-status');
const editStatus = document.getElementById('edit-status');
const tableBody = document.getElementById('table-body');
const subTotal = document.getElementById('subtotal');
const shipping = document.getElementById('shipping');
const totalPrice = document.getElementById('total-price');
const delivery = document.getElementById('delivery');
const dafn = document.getElementById('dafn');
const daln = document.getElementById('daln');
const dal1 = document.getElementById('dal1');
const dal2 = document.getElementById('dal2');
const dapc = document.getElementById('dapc');
const dacity = document.getElementById('dacity');
const dacountry = document.getElementById('dacountry');
const daphone = document.getElementById('daphone');
const bafn = document.getElementById('bafn');
const baln = document.getElementById('baln');
const bal1 = document.getElementById('bal1');
const bal2 = document.getElementById('bal2');
const bapc = document.getElementById('bapc');
const bacity = document.getElementById('bacity');
const bacountry = document.getElementById('bacountry');
const baphone = document.getElementById('baphone');


numberOrder.innerHTML = number;

fetch(`http://localhost:3000/api/mylaser/order/number/${number}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((order) => {
        const date = new Date(order.createdAt);
        const dateFormated = date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear();
        dateOrder.innerHTML = dateFormated;

        statusOption.value = order.status;

        editStatus.addEventListener('click', () => {
            editOrderStatus(number);
            if(statusOption.value === 'En Préparation') {
                sendEmailToCustomerOrderPrepared(order.userId)
            }
            if(statusOption.value === 'Expédiée') {
                sendEmailToCustomerOrderShipped(order.userId);
            }
        })

        subTotal.innerHTML = ((order.priceTTC-order.shippingPriceTTC)/100).toFixed(2) + ' €';
        shipping.innerHTML = (order.shippingPriceTTC/100).toFixed(2) + ' €';
        totalPrice.innerHTML = (order.priceTTC/100).toFixed(2) + ' €';

        delivery.innerHTML = order.shippingLabel;

        dafn.innerHTML = order.daFN;
        daln.innerHTML = order.daLN;
        dal1.innerHTML = order.daLine1;
        dal2.innerHTML = order.daLine2;
        dapc.innerHTML = order.daPC;
        dacity.innerHTML = order.daCity;
        dacountry.innerHTML = order.daCountry;
        daphone.innerHTML = order.daPhone;
        bafn.innerHTML = order.baFN;
        baln.innerHTML = order.baLN;
        bal1.innerHTML = order.baLine1;
        bal2.innerHTML = order.baLine2;
        bapc.innerHTML = order.baPC;
        bacity.innerHTML = order.baCity;
        bacountry.innerHTML = order.baCountry;
        baphone.innerHTML = order.baPhone;

        order.orderdetails.forEach(quote => {
            fetch(`http://localhost:3000/api/mylaser/dxf/quote/${quote.quote}`)
            .then((res) => res.json())
            .then((quote) => {
                const productRow = document.createElement('tr');
                productRow.className = "productRow";
                productRow.innerHTML =
                '<td class="img">' + JSON.parse(quote.svg) + '</td>' +
                '<td>' + (quote.width).toFixed(2) + ' X ' + (quote.height).toFixed(2) +'</td>' + 
                '<td>' + quote.steel + '</td>' +
                '<td>' + quote.thickness + ' mm</td>' +
                '<td>' + quote.quantity + '</td>' +
                '<td nowrap="nowrap">' + ((quote.price/100)*1.2).toFixed(2) + ' €</td>' +
                '<td><a href=' + quote.dxf + ' id="file-link"><i class="icon solid fa-file"</i></a></td>';
                tableBody.appendChild(productRow);

                let paths = document.querySelectorAll('path');
                paths.forEach(path => {
                    path.removeAttribute('style')
                    path.setAttribute('style', 'stroke:white;stroke-width:1')
                });
                let circles = document.querySelectorAll('circle');
                circles.forEach(circle => {
                    circle.removeAttribute('style')
                    circle.setAttribute('style', 'stroke:white;stroke-width:1')
                })
                let lines = document.querySelectorAll('line');
                lines.forEach(line => {
                    line.removeAttribute('style')
                    line.setAttribute('style', 'stroke:white;stroke-width:1')
                })
                let svgs = document.querySelectorAll('svg')
                svgs.forEach(svg => {
                    svg.removeAttribute('width')
                    svg.setAttribute('width', '100')
                    svg.removeAttribute('height')
                    svg.setAttribute('height', '100')
                })
            })
        });
        const yes = document.getElementById('yes');
        yes.addEventListener('click', () => {
            deleteOrder(order.id);
        })  
    })

function editOrderStatus(number) {
    const editOrder = {
        status: statusOption.value
    };
    const myInit = {
        method: "PUT",
        body: JSON.stringify(editOrder),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": 'Bearer ' + token,
        },
    };
    fetch(`http://localhost:3000/api/mylaser/order/${number}`, myInit)
    .then(() => {
        window.location.reload();
    })
}

function sendEmailToCustomerOrderPrepared(user) {
    fetch(`http://localhost:3000/api/mylaser/user/${user}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        const mailInfos = {
            name: user.firstName,
            intro: `Votre commande N° : ${number} est en cours de préparation !`,
            email: user.email,
            subject: `Votre Commande MyLaser N° : ${number} est en préparation !`,
            instructions: 'Elle sera expédiée rapidement et vous serez informé de son suivi. Vous la retrouverez ici :',
            text: 'Votre Commande',
            link: `http://localhost:5501/my-order.html?order=${number}`,
            outro: 'A bientôt sur MyLaser !'
        }
        const mailInit = {
            method: "POST",
            body: JSON.stringify(mailInfos),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": 'Bearer ' + token,
            },
        }
        fetch(`http://localhost:3000/api/mylaser/mail`, mailInit)
        .then((res) => {
            console.log(res)
        })
    })
}

function sendEmailToCustomerOrderShipped(user) {
    fetch(`http://localhost:3000/api/mylaser/user/${user}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        const mailInfos = {
            name: user.firstName,
            intro: `Votre commande N° : ${number} a été expédiée !`,
            email: user.email,
            subject: `Votre Commande MyLaser N° : ${number} est en route !`,
            instructions: 'Vous la retrouverez ici :',
            text: 'Votre Commande',
            link: `http://localhost:5501/my-order.html?order=${number}`,
            outro: 'A bientôt sur MyLaser !'
        }
        const mailInit = {
            method: "POST",
            body: JSON.stringify(mailInfos),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": 'Bearer ' + token,
            },
        }
        fetch(`http://localhost:3000/api/mylaser/mail`, mailInit)
        .then((res) => {
            console.log(res)
        })
    })
}

document.getElementById('back-to-orders').addEventListener('click', () => {
    window.location.href = `/admin-access-bo-orders.html`
})

function showConfirm() {
    const confirmation = document.getElementById('confirmation-delete-order');
    confirmation.classList.replace('hidden', 'visible')
}

function hideConfirm() {
    const confirmation = document.getElementById('confirmation-delete-order');
    confirmation.classList.replace('visible', 'hidden')
}

function deleteOrder(order) {
    fetch(`http://localhost:3000/api/mylaser/order/${order}`, {method: "DELETE", headers: {"Authorization": 'Bearer ' + token}})
    .then(() => {
        window.location.href = `/admin-access-bo-orders.html`;
    })
}