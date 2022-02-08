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
    .then((res) => {
        return res.text();
    })
    .then((data) => {
        showSVG(data);


        
        showOptions();
        calculPrice();
    })
}

function showSVG(data) {
    // Load SVG in DOM
    let svgContainer = document.getElementById('svgContainer');
    svgContainer.innerHTML = data;

    let svg = document.querySelector('svg')
    let widthSvg = svg.getAttribute('width')
    let heightSvg = svg.getAttribute('height')
    document.getElementById('hauteur').innerHTML = Math.round(heightSvg)
    document.getElementById('largeur').innerHTML = Math.round(widthSvg)

    let paths = document.querySelectorAll('path');
    paths.forEach(path => {
        path.removeAttribute('style')
        path.setAttribute('style', 'stroke:white;stroke-width:1')
    });
    // Circles
    let circles = document.querySelectorAll('circle');
    circles.forEach(circle => {
        circle.removeAttribute('style')
        circle.setAttribute('style', 'stroke:white;stroke-width:1')
    })
    // Lines
    let lines = document.querySelectorAll('line');
    lines.forEach(line => {
        line.removeAttribute('style')
        line.setAttribute('style', 'stroke:white;stroke-width:1')
    })

    // Scale SVG for frontend
    svg.removeAttribute('width')
    svg.setAttribute('width', '100%')
    svg.removeAttribute('height')
    svg.setAttribute('height', '100%')
}

function showOptions() {
    document.getElementById('infos-dxf').classList.replace("hidden", "visible")
}

function calculPrice() {
    // Calcul Paths from SVG
    // Paths
    let lengthPath = [];
    let paths = document.querySelectorAll('path');
    paths.forEach(path => {
        let Dpath = path.getAttribute('d');
        lengthPath.push(SVGPathCommander.getTotalLength(Dpath));
    });
    // Circles
    let circles = document.querySelectorAll('circle');
    circles.forEach(circle => {
        let pathCircle = SVGPathCommander.shapeToPath(circle);
        let Cpath = pathCircle.getAttribute('d');
        lengthPath.push(SVGPathCommander.getTotalLength(Cpath));
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
    })
    // Total Paths
    let totalLengthPath = 0;
    for (let i = 0; i < lengthPath.length; i++) {
        totalLengthPath += lengthPath[i];
    }
    console.log(totalLengthPath);

    let svg = document.querySelector('svg')
    let viewBox = svg.getAttribute('viewBox')
    let viewBoxSplit = viewBox.split(' ')
    let width = parseInt(viewBoxSplit[2])
    let height = parseInt(viewBoxSplit[3])
    let surfaceUtile = height*width
    console.log(surfaceUtile)

    // Coef Acier
    let coef =  parseFloat(document.getElementById('width-options').value)
    console.log(coef)

    const infos = {
        longueur : totalLengthPath,
        coefficient : coef,
        surface : surfaceUtile
    }
    const myInit2 = {
        method: "POST",
        body: JSON.stringify(infos),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    }
    fetch("http://localhost:3000/api/mylaser/dxf/price", myInit2)
    .then((res) => res.json())
    .then((price) => {
        document.getElementById('price').textContent = price.toFixed(2)
        console.log(price)
    })
}

function widthOptions() {
    let steelValue = document.getElementById('steel-options').value;
    let widthOption = document.getElementById('width-options');
    switch (steelValue) {
        case 'Acier standard' : 
        widthOption.innerHTML = `<option class="options-width" value=1>1 MM</option><option class="options-width" value="2">2 MM</option><option class="options-width" value=1.5>1.5 MM</option>`;
        break;
        case 'Acier galvanise' : 
        widthOption.innerHTML = `<option class="options-width" value="1">1 MM</option><option class="options-width" value="2">2 MM</option><option class="options-width" value="1,5">1.5 MM</option>`;
        break;
        case 'Acier brillant' : 
        widthOption.innerHTML = `<option class="options-width" value="1">1 MM</option><option class="options-width" value="2">2 MM</option><option class="options-width" value="1,5">1.5 MM</option>`;
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
        widthOption.innerHTML = `<option class="options-width" value="1,3">1.3 MM</option><option class="options-width" value="1,7">1.7 MM</option><option class="options-width" value="1,9">1.9 MM</option>`;
        break;
        case 'Alu brosse' : 
        widthOption.innerHTML = `<option class="options-width" value="1,3">1.3 MM</option><option class="options-width" value="1,7">1.7 MM</option><option class="options-width" value="1,9">1.9 MM</option>`;
        break;
        case 'Alu brillant' : 
        widthOption.innerHTML = `<option class="options-width" value="1.3">1.3 MM</option><option class="options-width" value="1.7">1.7 MM</option><option class="options-width" value="1.9">1.9 MM</option>`;
        break;
    }
}

document.getElementById('steel-options').addEventListener('change', (e) => {
    widthOptions()
    calculPrice()
})

document.getElementById('width-options').addEventListener('change', (e) => {
    calculPrice()
})


