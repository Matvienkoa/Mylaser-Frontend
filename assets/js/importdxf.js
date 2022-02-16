document.getElementById("form-dxf").addEventListener("submit", (e) => {
    e.preventDefault();
    uploadDXF();
})  

widthOptions()

function uploadDXF() {
    const formData = new FormData();
    const file = document.getElementById("file").files[0];
    formData.append('dxf', file)
    const myInit = {
        method: "POST",
        body: formData,
        headers: {
            "enctype": "multipart/form-data"
        },
    }
    fetch("http://localhost:3000/api/mylaser/dxf", myInit)
    .then((res) => res.json())
    .then((arrayData) => {
        showSVG(arrayData)
        showOptions();
    })
}

function showSVG(arrayData) {
    // Load SVG in DOM
    let svgContainer = document.getElementById('svgContainer');
    svgContainer.innerHTML = arrayData[0];
    let svg = document.querySelector('svg')
    let widthSvg = svg.getAttribute('width')
    let heightSvg = svg.getAttribute('height')
    document.getElementById('hauteur').innerHTML = Math.round(heightSvg)
    document.getElementById('largeur').innerHTML = Math.round(widthSvg)
    let surfaceUtile = heightSvg*widthSvg
    console.log(surfaceUtile)

    // Paths
    let lengthPath = [];
    let paths = document.querySelectorAll('path');
    paths.forEach(path => {
        let Dpath = path.getAttribute('d');
        lengthPath.push(SVGPathCommander.getTotalLength(Dpath));
        path.removeAttribute('style')
        path.setAttribute('style', 'stroke:white;stroke-width:1')
    });
    // Circles
    let circles = document.querySelectorAll('circle');
    circles.forEach(circle => {
        let pathCircle = SVGPathCommander.shapeToPath(circle);
        let Cpath = pathCircle.getAttribute('d');
        lengthPath.push(SVGPathCommander.getTotalLength(Cpath));
        circle.removeAttribute('style')
        circle.setAttribute('style', 'stroke:white;stroke-width:1')
    })
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
        line.removeAttribute('style')
        line.setAttribute('style', 'stroke:white;stroke-width:1')
    })

    // Total Paths
    let totalLengthPath = 0;
    for (let i = 0; i < lengthPath.length; i++) {
        totalLengthPath += lengthPath[i];
    }
    console.log(totalLengthPath);

    // Coef Acier
    let coef =  parseFloat(document.getElementById('width-options').value)
    console.log(coef)

    // Quantity
    let quantity = parseInt(document.getElementById('quantityList').value)
    console.log(quantity)

    // Steel
    let steel = document.getElementById('steel-options').value
    console.log(steel)

    // Thickness
    let thickness = document.getElementById('width-options').value
    console.log(thickness)

    // Scale SVG for frontend
    svg.removeAttribute('width')
    svg.setAttribute('width', '100%')
    svg.removeAttribute('height')
    svg.setAttribute('height', '100%')

    let svgData = JSON.stringify(arrayData[0])

    // Send Quote to DB
    const quoteInfos = {
        length: totalLengthPath,
        coef: coef,
        surface: surfaceUtile,
        quantity: quantity,
        width: widthSvg,
        height: heightSvg,
        dxf: arrayData[1],
        svg: svgData,
        steel: steel,
        thickness: thickness
    }
    const myInit2 = {
        method: "POST",
        body: JSON.stringify(quoteInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    }
    fetch("http://localhost:3000/api/mylaser/dxf/quote", myInit2)
    .then((res) => res.json())
    .then((quote) => {
        localStorage.setItem('currentQuote', JSON.stringify(quote.id))
        document.getElementById('price').textContent = (quote.price).toFixed(2)
    })
}

function showOptions() {
    document.getElementById('infos-dxf').classList.replace("hidden", "visible")
}

function updatePrice() {
    const currentQuote = localStorage.getItem('currentQuote')

    console.log(currentQuote)

    const coef = document.getElementById('width-options').value
    const quantity = document.getElementById('quantityList').value
    const thickness = document.getElementById('width-options').value
    const steel = document.getElementById('steel-options').value

    const modifs = {
        coef: coef,
        quantity: quantity,
        steel: steel,
        thickness: thickness
    }

    const myInit = {
        method: "PUT",
        body: JSON.stringify(modifs),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    }
    fetch(`http://localhost:3000/api/mylaser/dxf/quote/${currentQuote}`, myInit)
    .then((res) => res.json())
    .then((json) => {
        document.getElementById('price').textContent = (json.price).toFixed(2)
    })
}

function widthOptions() {
    let steelValue = document.getElementById('steel-options').value;
    let widthOption = document.getElementById('width-options');
    switch (steelValue) {
        case 'Acier standard' : 
        widthOption.innerHTML = `<option class="options-width" value="1">1 MM</option><option class="options-width" value="2">2 MM</option><option class="options-width" value="1.5">1.5 MM</option>`;
        break;
        case 'Acier galvanise' : 
        widthOption.innerHTML = `<option class="options-width" value="1">1 MM</option><option class="options-width" value="2">2 MM</option><option class="options-width" value="1.5">1.5 MM</option>`;
        break;
        case 'Acier brillant' : 
        widthOption.innerHTML = `<option class="options-width" value="1">1 MM</option><option class="options-width" value="2">2 MM</option><option class="options-width" value="1.5">1.5 MM</option>`;
        break;
        case 'Inox standard' : 
        widthOption.innerHTML = `<option class="options-width" value="4">4 MM</option><option class="options-width" value="5">5 MM</option><option class="options-width" value="7">7 MM</option>`;
        break;
        case 'Inox brosse' : 
        widthOption.innerHTML = `<option class="options-width" value="4">4 MM</option><option class="options-width" value="5">5 MM</option><option class="options-width" value="7">7 MM</option>`;
        break;
        case 'Inox brillant' : 
        widthOption.innerHTML = `<option class="options-width" value="4">4 MM</option><option class="options-width" value="5">5 MM</option><option class="options-width" value="7">7 MM</option>`;
        break;
        case 'Alu standard' : 
        widthOption.innerHTML = `<option class="options-width" value="1.3">1.3 MM</option><option class="options-width" value="1.7">1.7 MM</option><option class="options-width" value="1.9">1.9 MM</option>`;
        break;
        case 'Alu brosse' : 
        widthOption.innerHTML = `<option class="options-width" value="1.3">1.3 MM</option><option class="options-width" value="1.7">1.7 MM</option><option class="options-width" value="1.9">1.9 MM</option>`;
        break;
        case 'Alu brillant' : 
        widthOption.innerHTML = `<option class="options-width" value="1.3">1.3 MM</option><option class="options-width" value="1.7">1.7 MM</option><option class="options-width" value="1.9">1.9 MM</option>`;
        break;
    }
}

document.getElementById('steel-options').addEventListener('change', (e) => {
    widthOptions()
    updatePrice()
})

document.getElementById('width-options').addEventListener('change', (e) => {
    updatePrice()
})

document.getElementById('quantityList').addEventListener('change', (e) => {
    updatePrice()
})

document.getElementById('addToCart').addEventListener('click', (e) => {
    addToCart()
})

function addToCart () {
    const currentQuote = localStorage.getItem('currentQuote');
    console.log(currentQuote)
    fetch(`http://localhost:3000/api/mylaser/dxf/quote/${currentQuote}`)
    .then((res) => res.json())
    .then((json) => {
        let currentCart = JSON.parse(localStorage.getItem('currentCart'));
        console.log(currentCart)
        if(currentCart !== null) {
            if(currentCart[json.id] === undefined) {
                currentCart.push(json.id)
            }
            console.log('existe')
        } else {
            console.log('n existe pas')
            currentCart = [json.id]
        }
        localStorage.setItem('currentCart', JSON.stringify(currentCart))
    })
    .then(() => {
        window.location.reload();
    })
}


