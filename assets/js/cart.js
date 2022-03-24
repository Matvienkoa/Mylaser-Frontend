const products = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
console.log(products);

const tableBody = document.getElementById('table-body');
const tableWrapper = document.getElementById('tableWrapper');
const totalCart = document.getElementById('total-cart');
const tva = document.getElementById('tva');
const totalTVA = document.getElementById('total-tva');
const deleteBox = document.getElementById('delete-box');
const cartButtons = document.getElementById('cart-buttons');
const importDxf = document.getElementById('import-dxf');
const back = document.getElementById('back');
const order = document.getElementById('order');
let totalPrice = 0;

if(!products) {
    const emptyCart = document.createElement('p');
    emptyCart.className = "emptyCart";
    emptyCart.innerHTML = 'Votre panier est vide! Allez vite le remplir ;)';
    const goToImportdxf = document.createElement('input');
    goToImportdxf.setAttribute('type', 'button');
    goToImportdxf.setAttribute('value', 'Importer mon DXF');
    goToImportdxf.classList.add('primary');
    goToImportdxf.id = 'import-dxf';
    tableWrapper.appendChild(emptyCart);
    tableWrapper.appendChild(goToImportdxf);
    deleteBox.classList.replace('visible', 'hidden');
    totalCart.classList.replace('visible', 'hidden');
    cartButtons.classList.replace('visible', 'hidden');
    goToImportdxf.addEventListener('click', () => {
        window.location.href = '/importdxf.html';
    });
};

if(products) {
    products.forEach(product => {
        fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product}`)
        .then((res) => res.json())
        .then((product) => {
            console.log(product);

            const productRow = document.createElement('tr');
            productRow.className = "productRow";
            productRow.innerHTML =
            '<td class="img">' + JSON.parse(product.svg) + '</td>' +
            '<td>' + (product.width).toFixed(2) + ' X ' + (product.height).toFixed(2) +' mm</td>' + 
            '<td>' + product.steel + '</td>' +
            '<td>' + product.thickness + ' mm</td>' +
            '<td>' + product.quantity + '</td>' +
            '<td nowrap="nowrap">' + product.price + ' €</td>' +
            '<td class="bin-td"><i class="icon solid fa-trash bin" data-id=' + product.id + '></i></td>';
            tableBody.appendChild(productRow);

            let paths = document.querySelectorAll('path');
            paths.forEach(path => {
                path.removeAttribute('style');
                path.setAttribute('style', 'stroke:white;stroke-width:1');
            });
            let circles = document.querySelectorAll('circle');
            circles.forEach(circle => {
                circle.removeAttribute('style');
                circle.setAttribute('style', 'stroke:white;stroke-width:1');
            });
            let lines = document.querySelectorAll('line');
            lines.forEach(line => {
                line.removeAttribute('style');
                line.setAttribute('style', 'stroke:white;stroke-width:1');
            });
            let svgs = document.querySelectorAll('svg');
            svgs.forEach(svg => {
                svg.removeAttribute('width');
                svg.setAttribute('width', '100');
                svg.removeAttribute('height');
                svg.setAttribute('height', '100');
            });
            let buttonsDelete = document.querySelectorAll('.bin');
            buttonsDelete.forEach(button => {
                button.addEventListener('click', () => {
                    if(product.id === parseInt(button.dataset.id)) {
                        deleteProduct(product);
                    };
                });
            });
            totalPrice = totalPrice + product.price;
            console.log(totalPrice);
            let boxPrice = document.getElementById('total-price');
            boxPrice.innerHTML = totalPrice.toFixed(2) + ' €';
            totalTVA.innerHTML = 'dont TVA (20%) : ' + ((totalPrice/(1+20/100))*20/100).toFixed(2) + ' €';
        });
    });

    back.addEventListener('click', () => {
        window.location.href = 'importdxf.html';
    });

    order.addEventListener('click', () => {
        if(token) {
            const decodedToken = jwt_decode(token);
            fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
            .then((res) => res.json())
            .then((user) => {
                if(user.deliveryAdresses.length === 1) {
                    window.location.href = 'order-adresses.html';
                } else {
                    window.location.href = 'order-add-delivery-adress.html';
                };
            });
        } else {
            window.location.href = 'order-connection.html';
        };
    });
};

function deleteProduct(product) {
    fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product.id}`, {method: "DELETE", headers: {"Authorization": 'Bearer ' + token}})
    .then(() => {
        const index = products.findIndex(p => p === product.id);
        if(index !== -1) {
            products.splice(index, 1);
        };
        localStorage.setItem('currentCart', JSON.stringify(products));
        if(products.length === 0){
            localStorage.removeItem('currentCart');
        };
        window.location.reload();
    });
};

function deleteCart() {
    products.forEach(product => {
        fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product.id}`, {method: "DELETE", headers: {"Authorization": 'Bearer ' + token}})
        .then(() => {
            localStorage.removeItem('currentCart');
            window.location.reload();
        });
    });
};