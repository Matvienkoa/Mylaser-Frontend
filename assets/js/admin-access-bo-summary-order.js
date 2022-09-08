const token = localStorage.getItem('customer');
const number = new URL (location.href).searchParams.get('order');
const numberOrder = document.getElementById('order-number');
const dateOrder = document.getElementById('order-date');
const statutOrder = document.getElementById('order-statut');
const ifExpress = document.getElementById('ifExpress');
const tableBody = document.getElementById('table-body');
const bName = document.getElementById('b-name');
const bAdress = document.getElementById('b-adress');
const dName = document.getElementById('d-name');
const dAdress = document.getElementById('d-adress');
const trans = document.getElementById('trans');

fetch(`api/mylaser/order/number/${number}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((order) => {

        console.log(order)

        numberOrder.innerHTML = 'Référence de la commande : <span class="infos-details">' + order.number + '</span>';
        const date = new Date(order.createdAt);
        const dateFormated = date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear();
        dateOrder.innerHTML = 'Date de la commande : <span class="infos-details">' + dateFormated + '</span>';
        statutOrder.innerHTML = 'Statut de la commande : <span class="infos-details">' + order.status + '</span>';
        if(order.express === 'yes') {
            ifExpress.innerHTML = 'Préparation Express - 24H'
        }

        bName.innerHTML = order.baLN + ' ' + order.baFN;
        bAdress.innerHTML = order.baLine1 + ' ' + order.baPC + ' ' + order.baCity;
        dName.innerHTML = order.daLN + ' ' + order.daFN;
        dAdress.innerHTML = order.daLine1 + ' ' + order.daPC + ' ' + order.daCity;

        trans.innerHTML = 'Transporteur : ' + order.shippingLabel;

        order.orderdetails.forEach(quote => {
            fetch(`api/mylaser/dxf/quote/${quote.quote}`)
            .then((res) => res.json())
            .then((quote) => {
                const productRow = document.createElement('tr');
                productRow.className = "productRow";
                productRow.innerHTML =
                '<td class="img">' + JSON.parse(quote.svg) + '</td>' +
                '<td>' + (quote.width).toFixed(2) + ' X ' + (quote.height).toFixed(2) +' mm</td>' + 
                '<td>' + quote.steel + '</td>' +
                '<td>' + quote.thickness + ' mm</td>' +
                '<td>' + quote.quantity + '</td>' +
                '<td>' + quote.dxf + '</td>' +
                '<td><a href=' + quote.dxf + ' id="file-link"><i class="icon solid fa-file"</i></a></td>';
                tableBody.appendChild(productRow);

                let paths = document.querySelectorAll('path');
                paths.forEach(path => {
                    path.removeAttribute('style')
                    path.setAttribute('style', 'stroke:black;stroke-width:2')
                });
                let circles = document.querySelectorAll('circle');
                circles.forEach(circle => {
                    circle.removeAttribute('style')
                    circle.setAttribute('style', 'stroke:black;stroke-width:2')
                })
                let lines = document.querySelectorAll('line');
                lines.forEach(line => {
                    line.removeAttribute('style')
                    line.setAttribute('style', 'stroke:black;stroke-width:2')
                })

                let svgs = document.querySelectorAll('svg')
                svgs.forEach(svg => {
                    svg.removeAttribute('width')
                    svg.setAttribute('width', '150')
                    svg.removeAttribute('height')
                    svg.setAttribute('height', '150')
                })
            })
        })
    })