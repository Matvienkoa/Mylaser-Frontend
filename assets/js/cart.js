const products = JSON.parse(localStorage.getItem('currentCart'));
console.log(products);
const productsBox = document.getElementById('products-box');

if(!products) {
    const emptyCart = document.createElement('p');
    emptyCart.className = "emptyCart";
    emptyCart.innerHTML = 'Votre panier est vide! Allez vite le remplir ^^';
    productsBox.appendChild(emptyCart)
}


if(products) {
products.forEach(product => {
    fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product}`)
    .then((res) => res.json())
    .then((product) => {
        console.log(product)
        const productBox = document.createElement('div');
        productBox.className = "productBox";
        productBox.innerHTML = 
        '<div class="img">' + JSON.parse(product.svg) + '</div>' + 
        '<div id="size-box"><span>Largeur :' + product.width + '</span><span>Longueur :' + product.height + '</span></div>' +
        '<div id="quantity-box"><span>Quantité :</span><span><span class="minus" data-id=' + product.id + '>➖</span><span>' + product.quantity + '</span><span class="plus" data-id=' + product.id + '>+</span></span></div>' + 
        '<div id="price-box"><span>Prix :</span><span class="priceValue">' + product.price + '</span></div>' + '<span class="bin" data-id=' + product.id + '>🗑️</span>'
        productsBox.appendChild(productBox)

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
            svg.setAttribute('width', '100%')
            svg.removeAttribute('height')
            svg.setAttribute('height', '100%')
        })

        // let buttonsPlus = document.querySelectorAll('.plus');
        // buttonsPlus.forEach(button => {
        //     button.addEventListener('click', () => {
        //         if(product.id === parseInt(button.dataset.id)) {
        //             addQuantity(product)
        //         }
        //     })
        // })
        
        let buttonsDelete = document.querySelectorAll('.bin');
        buttonsDelete.forEach(button => {
            button.addEventListener('click', () => {
                if(product.id === parseInt(button.dataset.id)) {
                    deleteProduct(product)
                }
            })
        })
        
    })
});
}

function deleteProduct(product) {
    fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product.id}`, {method: "DELETE"})
    .then(() => {
        const index = products.findIndex(p => p === product.id)
        if(index !== -1) {
            products.splice(index, 1);
        }
        localStorage.setItem('currentCart', JSON.stringify(products))
        if(products.length === 0){
            localStorage.removeItem('currentCart')
        }
        window.location.reload();
    })
}
// function addQuantity(product) {
//     const newQuantity = product.quantity += 1
//     const modifs = {
//         coef: product.coef,
//         quantity: newQuantity,
//         steel: product.steel,
//         thickness: product.thickness
//     }
//     const myInit = {
//         method: "PUT",
//         body: JSON.stringify(modifs),
//         headers: {
//             "Content-Type": "application/json; charset=utf-8"
//         },
//     }
//     fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product.id}`, myInit)
//     .then((res) => res.json())
//     .then((json) => {
//         console.log(json)
//         window.location.reload();
//     })
// }