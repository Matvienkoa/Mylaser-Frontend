// ----------- Upload DXF -----------
document.getElementById("form-dxf").addEventListener("submit", (e) => {
    if(document.getElementById("file").files.length !== 0 && document.getElementById('infos-dxf').className === 'hidden') {
        e.preventDefault();
        showSpinner();
        uploadDXF();
    };
});

// ----------- Show file name + size -----------
const file = document.getElementById('file');
file.addEventListener('change', (e) => {
    const [file] = e.target.files;
    const { name: fileName, size } = file;
    const fileSize = (size / 1000).toFixed(2);
    const fileNameAndSize = `${fileName} - ${fileSize} KB`;
    document.querySelector('.file-name').textContent = fileNameAndSize;
});

// ----------- Spinner -----------
function showSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.classList.replace('spinner-off', 'lds-ring');
    const body = document.querySelector('body');
    body.classList.add('on');
};
function hideSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.classList.replace('lds-ring', 'spinner-off');
    const body = document.querySelector('body');
    body.classList.remove('on');
};

// ----------- DXF -----------
function uploadDXF() {
    const formData = new FormData();
    const file = document.getElementById("file").files[0];
    formData.append('dxf', file);
    const myInit = {
        method: "POST",
        body: formData,
        headers: {
            "enctype": "multipart/form-data"
        },
    };
    fetch("http://localhost:3000/api/mylaser/dxf", myInit)
    .then(res => {
        if(!res.ok) {
            hideSpinner();
            document.getElementById('box-error').classList.replace('box-hidden', 'box-visible');
        } else {
            res.json()
            .then((arrayData) => {
                hideSpinner();
                showSVG(arrayData);
                showOptions();
            });
        };
    });
};

// ----------- Show SVG -----------
function showSVG(arrayData) {
    // Load SVG in DOM
    let svgContainer = document.getElementById('svgContainer');
    svgContainer.innerHTML = arrayData[0];
    let svg = document.querySelector('svg');
    let widthSvg = svg.getAttribute('width');
    let heightSvg = svg.getAttribute('height');
    document.getElementById('hauteur').innerHTML = Math.round(heightSvg);
    document.getElementById('largeur').innerHTML = Math.round(widthSvg) + ' mm';
    let surfaceUtile = heightSvg*widthSvg;
    // Paths
    let lengthPath = [];
    let paths = document.querySelectorAll('path');
    paths.forEach(path => {
        let Dpath = path.getAttribute('d');
        lengthPath.push(SVGPathCommander.getTotalLength(Dpath));
        path.removeAttribute('style');
        path.setAttribute('style', 'stroke:white;stroke-width:1');
    });
    // Circles
    let circles = document.querySelectorAll('circle');
    circles.forEach(circle => {
        let pathCircle = SVGPathCommander.shapeToPath(circle);
        let Cpath = pathCircle.getAttribute('d');
        lengthPath.push(SVGPathCommander.getTotalLength(Cpath));
        circle.removeAttribute('style');
        circle.setAttribute('style', 'stroke:white;stroke-width:1');
    });
    // Lines
    let lines = document.querySelectorAll('line');
    lines.forEach(line => {
        let x1 = line.getAttribute('x1');
        let x2 = line.getAttribute('x2');
        let y1 = line.getAttribute('y1');
        let y2 = line.getAttribute('y2');
        let lineAttributes = {
            type: 'line',
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        };
        let linePath = SVGPathCommander.shapeToPath(lineAttributes);
        let Lpath = linePath.getAttribute('d');
        lengthPath.push(SVGPathCommander.getTotalLength(Lpath));
        line.removeAttribute('style');
        line.setAttribute('style', 'stroke:white;stroke-width:1');
    });
    // Total Paths
    let totalLengthPath = 0;
    for (let i = 0; i < lengthPath.length; i++) {
        totalLengthPath += lengthPath[i];
    };
    // Quantity
    let quantity = parseInt(document.getElementById('quantityList').value);
    // Steel
    let steel = document.getElementById('steel-options').value;
    // Thickness
    let thickness = JSON.parse(document.getElementById('width-options').value);
    // Weight
    let density = getDensity();
    function getDensity() {
        let density;
        if(steel === 'Acier Standard' || steel === 'Acier Hardox') {
            density = 8;
            return density;
        }
        if(steel === 'Inox Standard') {
            density = 8;
            return density;
        }
        if(steel === 'Alu Standard') {
            density = 4;
            return density;
        }
    };
    // Speed
    let speed = JSON.parse(document.getElementById('width-options').value);
    // Scale SVG for frontend
    svg.removeAttribute('width');
    svg.setAttribute('width', '100%');
    svg.removeAttribute('height');
    svg.setAttribute('height', '100%');
    let svgData = JSON.stringify(arrayData[0]);

    // Send Quote to DB
    const quoteInfos = {
        width: parseInt(widthSvg),
        height: parseInt(heightSvg),
        surface: Math.ceil(surfaceUtile),
        length: Math.ceil(totalLengthPath),
        thickness: thickness.thickness,
        steel: steel,
        quantity: quantity,
        dxf: arrayData[1],
        svg: svgData,
        density: density,
        speed: speed.speed
    };

    const myInit2 = {
        method: "POST",
        body: JSON.stringify(quoteInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    };
    fetch("http://localhost:3000/api/mylaser/dxf/quote", myInit2)
    .then(res => {
        if(!res.ok) {
            // Error states
            const fileDXF = {
                filename: arrayData[1]
            };
            const myInitFile = {
                method: "DELETE",
                body: JSON.stringify(fileDXF),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
            };
            fetch("http://localhost:3000/api/mylaser/dxf/file", myInitFile)
            .then(() => {
                document.getElementById('box-error').classList.replace('box-hidden', 'box-visible');
                document.getElementById('infos-dxf').classList.replace("visible", "hidden");
            });
        } else {
            res.json()
            .then((quote) => {
                localStorage.setItem('currentQuote', JSON.stringify(quote.id))
                document.getElementById('price').textContent = ((quote.price*1.2)/100).toFixed(2) + ' € TTC'
            })
            .catch(function (error) {
                console.log(error)
            });
        };
    });
};

function showOptions() {
    document.getElementById('infos-dxf').classList.replace("hidden", "visible");
};

widthOptions();

function updatePrice() {
    const currentQuote = localStorage.getItem('currentQuote');
    const quantity = JSON.parse(document.getElementById('quantityList').value);
    const thickness = JSON.parse(document.getElementById('width-options').value);
    const steel = document.getElementById('steel-options').value;
    let speed = JSON.parse(document.getElementById('width-options').value);
    let density = getDensity();

    function getDensity() {
        let density;
        if(steel === 'Acier Standard' || steel === 'Acier Hardox') {
            density = 8;
            return density;
        }
        if(steel === 'Inox Standard') {
            density = 8;
            return density;
        }
        if(steel === 'Alu Standard') {
            density = 4;
            return density;
        }
    };

    const modifs = {
        quantity: quantity,
        steel: steel,
        thickness: thickness.thickness,
        density: density,
        speed: speed.speed
    };
    const myInit = {
        method: "PUT",
        body: JSON.stringify(modifs),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    };
    fetch(`http://localhost:3000/api/mylaser/dxf/quote/${currentQuote}`, myInit)
    .then((res) => res.json())
    .then((json) => {
        document.getElementById('price').textContent = ((json.price*1.2)/100).toFixed(2) + ' € TTC';
    });
};

function widthOptions() {
    let steelValue = document.getElementById('steel-options').value;
    let widthOption = document.getElementById('width-options');
    switch (steelValue) {
        case 'Acier Standard' : 
        widthOption.innerHTML = `<option class="options-width" value='{"thickness":1,"speed":30000}'>1 MM</option><option class="options-width" value='{"thickness":1.5,"speed":25000}'>1,5 MM</option><option class="options-width" value='{"thickness":2,"speed":18000}'>2 MM</option><option class="options-width" value='{"thickness":2.5,"speed":14000}'>2,5 MM</option><option class="options-width" value='{"thickness":3,"speed":3000}'>3 MM</option><option class="options-width" value='{"thickness":4,"speed":2800}'>4 MM</option><option class="options-width" value='{"thickness":5,"speed":2600}'>5 MM</option><option class="options-width" value='{"thickness":6,"speed":2600}'>6 MM</option><option class="options-width" value='{"thickness":8,"speed":2000}'>8 MM</option><option class="options-width" value='{"thickness":10,"speed":1800}'>10 MM</option><option class="options-width" value='{"thickness":12,"speed":1500}'>12 MM</option><option class="options-width" value='{"thickness":15,"speed":1100}'>15 MM</option><option class="options-width" value='{"thickness":20,"speed":750}'>20 MM</option>`;
        break;
        case 'Acier Hardox' : 
        widthOption.innerHTML = `<option class="options-width" value='{"thickness":4,"speed":2000}'>4 MM</option><option class="options-width" value='{"thickness":5,"speed":2000}'>5 MM</option><option class="options-width" value='{"thickness":6,"speed":1800}'>6 MM</option><option class="options-width" value='{"thickness":8,"speed":1400}'>8 MM</option><option class="options-width" value='{"thickness":10,"speed":1300}'>10 MM</option><option class="options-width" value='{"thickness":12,"speed":1000}'>12 MM</option><option class="options-width" value='{"thickness":15,"speed":900}'>15 MM</option><option class="options-width" value='{"thickness":20,"speed":700}'>20 MM</option>`;
        break;
        case 'Inox Standard' : 
        widthOption.innerHTML = `<option class="options-width" value='{"thickness":1,"speed":30000}'>1 MM</option><option class="options-width" value='{"thickness":1.5,"speed":25000}'>1,5 MM</option><option class="options-width" value='{"thickness":2,"speed":20000}'>2 MM</option><option class="options-width" value='{"thickness":2.5,"speed":16000}'>2,5 MM</option><option class="options-width" value='{"thickness":3,"speed":13000}'>3 MM</option><option class="options-width" value='{"thickness":4,"speed":6500}'>4 MM</option><option class="options-width" value='{"thickness":5,"speed":4800}'>5 MM</option><option class="options-width" value='{"thickness":6,"speed":3600}'>6 MM</option><option class="options-width" value='{"thickness":8,"speed":2500}'>8 MM</option><option class="options-width" value='{"thickness":10,"speed":1600}'>10 MM</option><option class="options-width" value='{"thickness":12,"speed":800}'>12 MM</option><option class="options-width" value='{"thickness":15,"speed":450}'>15 MM</option>`;
        break;
        case 'Alu Standard' : 
        widthOption.innerHTML = `<option class="options-width" value='{"thickness":2,"speed":8000}'>2 MM</option><option class="options-width" value='{"thickness":2.5,"speed":7500}'>2,5 MM</option><option class="options-width" value='{"thickness":3,"speed":7000}'>3 MM</option><option class="options-width" value='{"thickness":4,"speed":6000}'>4 MM</option><option class="options-width" value='{"thickness":5,"speed":5700}'>5 MM</option><option class="options-width" value='{"thickness":6,"speed":4000}'>6 MM</option><option class="options-width" value='{"thickness":8,"speed":4000}'>8 MM</option><option class="options-width" value='{"thickness":10,"speed":3000}'>10 MM</option><option class="options-width" value='{"thickness":12,"speed":2500}'>12 MM</option><option class="options-width" value='{"thickness":15,"speed":1200}'>15 MM</option>`;
        break;
    };
};

// Update price on change Options
document.getElementById('steel-options').addEventListener('change', (e) => {
    widthOptions();
    updatePrice();
});
document.getElementById('width-options').addEventListener('change', (e) => {
    updatePrice();
});
document.getElementById('quantityList').addEventListener('change', (e) => {
    updatePrice();
});
// Add to cart
document.getElementById('addToCart').addEventListener('click', (e) => {
    addToCart();
});
// If change file, delete current quote and reset
document.getElementById('file').addEventListener('change', (e) => {
    hideError();
    changeQuote();
    if(document.getElementById('infos-dxf').className === 'visible') {
        deleteQuote();
        hideOptions();
    };
});
function deleteQuote() {
    const quote = localStorage.getItem('currentQuote');
    if(quote) {
        fetch(`http://localhost:3000/api/mylaser/dxf/quote/${quote}`, {method: "DELETE"})
        .then(() => localStorage.removeItem('currentQuote'));
    };
};
function changeQuote() {
    let svgContainer = document.getElementById('svgContainer');
    svgContainer.innerHTML = '';
};
function hideOptions() {
    document.getElementById('infos-dxf').classList.replace("visible", "hidden");
};
function hideError() {
    document.getElementById('box-error').classList.replace('box-visible', 'box-hidden');
};

function addToCart () {
    const currentQuote = localStorage.getItem('currentQuote');
    fetch(`http://localhost:3000/api/mylaser/dxf/quote/${currentQuote}`)
    .then((res) => res.json())
    .then((json) => {
        let currentCart = JSON.parse(localStorage.getItem('currentCart'));
        if(currentCart !== null) {
            const modif = {
                cartId: currentCart
            };
            const myInit = {
                method: "PUT",
                body: JSON.stringify(modif),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
            };
            fetch(`http://localhost:3000/api/mylaser/dxf/linkquote/${currentQuote}`, myInit)
            .then((res) => res.json())
            .then((quote) => {
                const modifs = {
                    price: quote.price,
                    length: quote.height,
                    width: quote.width,
                    thickness: quote.thickness,
                    quantity: quote.quantity,
                    weight: quote.weight
                }
                const myInit = {
                    method: "PUT",
                    body: JSON.stringify(modifs),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                }
                fetch(`http://localhost:3000/api/mylaser/cart/${currentCart}`, myInit)
                .then((res) => res.json())
            })
        } else {
            const myCart = {
                price: json.price,
                length: json.height,
                width: json.width,
                height: (json.thickness/10)*json.quantity,
                weight: json.weight
            }
            const myInit = {
            method: "POST",
                body: JSON.stringify(myCart),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
            }
            fetch(`http://localhost:3000/api/mylaser/cart`, myInit)
            .then((res) => res.json())
            .then((cart) => {
                currentCart = cart.id;
                localStorage.setItem('currentCart', JSON.stringify(currentCart));
                const modif = {
                    cartId: cart.id
                };
                const myInit = {
                    method: "PUT",
                    body: JSON.stringify(modif),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                };
                fetch(`http://localhost:3000/api/mylaser/dxf/linkquote/${currentQuote}`, myInit)
                .then((res) => res.json())
                .then((quote) => console.log(quote))
            })
        };
    })
    .then(() => {
        apparitionNext();
    });
};

function apparitionNext () {
    const box = document.createElement('span');
    box.className = "add-cart-next-box";
    box.innerHTML = 
    "<p>Produit ajouté au panier!</p>" +
	'<span id="option-buttons">' + 
	'<input type="button" value="Importer un autre DXF" id="go-to-import">' +
    '<input type="button" value="Voir mon panier" id="go-to-cart"></span>';
    const page = document.getElementById('add-cart-next-page');
    page.className = 'add-cart-next-page';
    page.appendChild(box);
    const main = document.querySelector('#main');
    main.classList.add('on2');
    document.getElementById('go-to-import').addEventListener('click', () => {
        window.location.href = '/importdxf.html';
    });
    document.getElementById('go-to-cart').addEventListener('click', () => {
        window.location.href = '/cart.html';
    });
};




