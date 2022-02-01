document.getElementById("form-dxf").addEventListener("submit", (e) => {
    e.preventDefault();
    sendOrder();
})  

function sendOrder() {
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
    
    fetch("http://localhost:3000/convert", myInit)
    .then((res) => {
        return res.text();
    })
    .then((data) => {
        calcul(data);
    })
}

function calcul(data) {
    svgContainer.innerHTML = data;
        let lengthPath = [];
        let paths = document.querySelectorAll('path');
        paths.forEach(path => {
            let Dpath = path.getAttribute('d');
            path.removeAttribute('style')
            path.setAttribute('style', 'stroke:white;stroke-width:1')
            console.log(SVGPathCommander.getTotalLength(Dpath));
            lengthPath.push(SVGPathCommander.getTotalLength(Dpath));
            console.log(lengthPath);
        });

        let circles = document.querySelectorAll('circle');
        circles.forEach(circle => {
            circle.removeAttribute('style')
            circle.setAttribute('style', 'stroke:white;stroke-width:1')
            let pathCircle = SVGPathCommander.shapeToPath(circle);
            console.log(pathCircle);
            let Cpath = pathCircle.getAttribute('d');
            console.log(SVGPathCommander.getTotalLength(Cpath));
            lengthPath.push(SVGPathCommander.getTotalLength(Cpath));
            console.log(lengthPath);
        })

        let lines = document.querySelectorAll('line');
        lines.forEach(line => {
            line.removeAttribute('style')
            line.setAttribute('style', 'stroke:white;stroke-width:1')
            let x1 = line.getAttribute('x1');
            let x2 = line.getAttribute('x2');
            let y1 = line.getAttribute('y1');
            let y2 = line.getAttribute('y2');
            console.log(x1, x2, y1, y2);
            let lineAttributes = {
                type: 'line',
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            };
            let linePath = SVGPathCommander.shapeToPath(lineAttributes);
            console.log(linePath);

            let Lpath = linePath.getAttribute('d');
            console.log(SVGPathCommander.getTotalLength(Lpath));
            lengthPath.push(SVGPathCommander.getTotalLength(Lpath));
            console.log(lengthPath);
        })
        totalLengthPath = 0;
        for (let i = 0; i < lengthPath.length; i++) {
            totalLengthPath += lengthPath[i];
        }
        console.log(totalLengthPath);
}

