const cart = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
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
const express = document.getElementById('express');
const expressBox = document.getElementById('express-box');

if(!cart) {
    const emptyCart = document.createElement('p');
    emptyCart.className = "emptyCart";
    emptyCart.innerHTML = "Vous n'avez pas encore ajouter de produits au panier";
    const goToImportdxf = document.createElement('input');
    goToImportdxf.setAttribute('type', 'button');
    goToImportdxf.setAttribute('value', 'Importer mon DXF');
    goToImportdxf.classList.add('primary');
    goToImportdxf.id = 'import-dxf';
    tableWrapper.appendChild(emptyCart);
    tableWrapper.appendChild(goToImportdxf);
    expressBox.classList.replace('visible', 'hidden');
    deleteBox.classList.replace('visible', 'hidden');
    totalCart.classList.replace('visible', 'hidden');
    cartButtons.classList.replace('visible', 'hidden');
    goToImportdxf.addEventListener('click', () => {
        window.location.href = '/importdxf.html';
    });
};

if(cart) {
    fetch(`api/mylaser/cart/${cart}`)
    .then((res) => res.json())
    .then((cartNumber) => {
        cartNumber.quotes.forEach(product => {
            fetch(`api/mylaser/dxf/quote/${product.id}`)
            .then((res) => res.json())
            .then((product) => {
                const productRow = document.createElement('tr');
                productRow.className = "productRow";
                productRow.innerHTML =
                '<td class="img">' + JSON.parse(product.svg) + '</td>' +
                '<td>' + product.width + ' X ' + product.height +' mm</td>' + 
                '<td>' + product.steel + '</td>' +
                '<td>' + product.thickness + ' mm</td>' +
                '<td>' + product.quantity + '</td>' +
                '<td nowrap="nowrap">' + ((product.price/100)*1.2).toFixed(2) + ' €</td>' +
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
            });
        });

        if(cartNumber.express === 'yes') {
            express.checked = true;
        }

        let boxPrice = document.getElementById('total-price');
        boxPrice.innerHTML = ((cartNumber.price/100)*1.2).toFixed(2) + ' €';
        totalTVA.innerHTML = 'dont TVA (20%) : ' + ((cartNumber.price/100)*0.2).toFixed(2) + ' €';

        express.addEventListener('change', () => {
            if(express.checked === true) {
                const newCart = {
                    express: 'yes'
                }
                const updateCart = {
                    method: "PUT",
                    body: JSON.stringify(newCart),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                };
                fetch(`api/mylaser/cart/addExpress/${cart}`, updateCart)
                .then((res) => res.json())
                .then((newCartEdit) => {
                    boxPrice.innerHTML = ''
                    totalTVA.innerHTML = ''
                    boxPrice.innerHTML = ((newCartEdit.price/100)*1.2).toFixed(2) + ' €';
                    totalTVA.innerHTML = 'dont TVA (20%) : ' + ((newCartEdit.price/100)*0.2).toFixed(2) + ' €';
                })
            }
            if(express.checked === false) {
                const newCart = {
                    express: 'no'
                }
                const updateCart = {
                    method: "PUT",
                    body: JSON.stringify(newCart),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                };
                fetch(`api/mylaser/cart/removeExpress/${cart}`, updateCart)
                .then((res) => res.json())
                .then((newCartEdit) => {
                    boxPrice.innerHTML = ''
                    totalTVA.innerHTML = ''
                    boxPrice.innerHTML = ((newCartEdit.price/100)*1.2).toFixed(2) + ' €';
                    totalTVA.innerHTML = 'dont TVA (20%) : ' + ((newCartEdit.price/100)*0.2).toFixed(2) + ' €';
                })
            }
        })

        back.addEventListener('click', () => {
            window.location.href = 'importdxf.html';
        });

        order.addEventListener('click', () => {
            if(token) {
                const decodedToken = jwt_decode(token);
                fetch(`api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
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
    })
};

function deleteProduct(product) {
    fetch(`api/mylaser/dxf/quote/${product.id}`)
    .then((res) => res.json())
    .then((quote) => {
        fetch(`api/mylaser/dxf/quote/${quote.id}`, {method: "DELETE"})
        .then((res) => {
            res.json();
            fetch(`api/mylaser/cart/${cart}`)
            .then((res) => res.json())
            .then((currentCart) => {
                const price = currentCart.price - quote.price;
                const weight = Math.ceil(currentCart.weight - quote.weight);
                const height = currentCart.height - (quote.thickness)/10*quote.quantity;
                const length = getLength();
                const width = getWidth();
                function getWidth() {
                    if(quote.width < currentCart.width) {
                        return currentCart.width;
                    }
                    if(quote.width == currentCart.width) {
                        return Math.max.apply(Math, currentCart.quotes.map(function(o) {return o.width;}))
                    }
                }
                function getLength() {
                    if(quote.height < currentCart.length) {
                        return currentCart.length;
                    }
                    if(quote.height == currentCart.length) {
                        return Math.max.apply(Math, currentCart.quotes.map(function(o) {return o.height;}))
                    }
                }
                const newCart = {
                    price: price,
                    weight: weight,
                    height: height,
                    width: width,
                    length: length
                }
                const updateCart = {
                    method: "PUT",
                    body: JSON.stringify(newCart),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                };
                fetch(`api/mylaser/cart/removequote/${cart}`, updateCart)
                .then((res) => res.json())
                .then((cart) => {
                    fetch(`api/mylaser/cart/${cart.id}`)
                    .then((res) => res.json())
                    .then((currentCart) => {
                        if(currentCart.quotes.length === 0) {
                            deleteEmptyCart(cart.id);
                        } else {
                            window.location.reload();
                        }
                    })
                })
            })
        })
    })
}

function deleteEmptyCart(cartId) {
    fetch(`api/mylaser/cart/${cartId}`, {method: "DELETE"})
    .then(() => {
        localStorage.removeItem('currentCart');
        window.location.reload();
    })
}

function deleteCart() {
    fetch(`api/mylaser/cart/${cart}`)
    .then(res => res.json())
    .then((cart) => {
        cart.quotes.forEach(quote => {
            fetch(`api/mylaser/dxf/quote/${quote.id}`, {method: "DELETE"})
            .then(() => {
                fetch(`api/mylaser/cart/${cart.id}`, {method: "DELETE"})
                .then(() => {
                    localStorage.removeItem('currentCart');
                    window.location.reload();
                })
            })
        })
    })
};