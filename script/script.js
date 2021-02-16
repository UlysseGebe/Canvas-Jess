const $canvas = document.querySelector('.js-canvas')
const context = $canvas.getContext('2d')

function $_GET() {
    var vars = {};
    window.location.href.replace(location.hash, '').replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function (m, key, value) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ('saison') {
        return vars['saison'] ? vars['saison'] : null;
    }
    return vars;
}

for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
        $canvas.saison = key == $_GET() ? data[key].adj : data['ete'].adj
        $canvas.gradient = key == $_GET() ? data[key].bgColor : data['ete'].bgColor
    }
}

let image = new Image();
image.addEventListener('load', () => {
    context.drawImage(image, 0, 0, windowWidth, windowHeight)
})

let windowWidth = $canvas.width
let windowHeight = $canvas.height

const resize = () => {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight
    $canvas.width = windowWidth
    $canvas.height = windowHeight
}
window.addEventListener('resize', resize)
resize()

let position = {},
    ecart = 200,
    maxLimit = $canvas.width * (4 / 3),
    click = false
position.x = 0
position.y = $canvas.height / 5
position.vx = 0.1
let textPosition = []
let count = 0

const cursor = {}
cursor.x = 0
cursor.y = 0

$canvas.addEventListener('mousemove', (_event) => {
    cursor.x = _event.clientX
    cursor.y = _event.clientY
})

const clickEvent = (coord, music) => {
    $canvas.addEventListener('click', () => {
        click = true
        if (click) {
            if (cursor.x >= coord.x && cursor.y >= coord.y && cursor.x <= coord.x + coord.w && cursor.y <= coord.y + coord.h) {
                // music.currentTime = 0
                // music.play()
                console.log('ok');
            }
        }
        click = false
    })
}
let x = 0
const generateText = (element, line) => {
    let word = element.name.toUpperCase(), gap = element.position
    context.font = "60px Montserrat";
    context.strokeStyle = "white";
    context.lineWidth = 2.5;
    context.textAlign = "center";
    gap += ($canvas.width / 4.5)
    if (line % 2 == 0) {
        if (position.x + gap / 2 <= (maxLimit)) {
            x = position.x + gap
            context.strokeText(word, position.x + gap, position.y);
            textPosition[count] = {
                w: context.measureText(word).width,
                h: 60, // Font size in px
                x: x - context.measureText(word).width / 2,
                y: position.y - 50,
                music: element.sound,
                img: element.bar,
                bg: element.bg
            }
            count++
        }
        if (position.x + gap * 2 >= (maxLimit)) {
            x = position.x + gap - (maxLimit)
            context.strokeText(word, position.x + gap - (maxLimit), position.y);
            textPosition[count] = {
                w: context.measureText(word).width,
                h: 60, // Font size in px
                x: x - context.measureText(word).width / 2,
                y: position.y - 50,
                music: element.sound,
                img: element.bar,
                bg: element.bg
            }
            count++
        }
    }
    if (line % 2 != 0) {
        if (-position.x - ecart + gap * 2 >= 0) {
            x = (-position.x + gap) - ecart
            context.strokeText(word, (-position.x + gap) - ecart, position.y);
            textPosition[count] = {
                w: context.measureText(word).width,
                h: 60, // Font size in px
                x: x - context.measureText(word).width / 2,
                y: position.y - 50,
                music: element.sound,
                img: element.bar,
                bg: element.bg
            }
            count++
        }
        if (-position.x - ecart + gap / 2 <= 0) {
            x = (-position.x + gap) - ecart + (maxLimit)
            context.strokeText(word, (-position.x + gap) - ecart + (maxLimit), position.y);
            textPosition[count] = {
                w: context.measureText(word).width,
                h: 60, // Font size in px
                x: x - context.measureText(word).width / 2,
                y: position.y - 50,
                music: element.sound,
                img: element.bar,
                bg: element.bg
            }
            count++
        }
    }
}

const createLines = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < $canvas.saison.length; i++) {
            const element = $canvas.saison[i];
            generateText(element, j)

        }
        position.x += position.vx
        position.x = position.x % (maxLimit)
        position.y += $canvas.height / 5
    }
    count = 0
    position.y = $canvas.height / 5
}

const generateGrad = () => {
    const gradient = context.createLinearGradient(windowWidth / 2, 0, windowWidth / 2, windowHeight) // x1, y1, x2, y2
    for (let i = 0; i < $canvas.gradient.length; i++) {
        const element = $canvas.gradient[i];
        gradient.addColorStop(element[0], element[1])
    }
    context.fillStyle = gradient // Le dégradé devient le style de remplissage
    context.fillRect(0, 0, windowWidth, windowHeight) // On dessine un carré
}

const generateMenu = (src) => {
    let oldImage = document.querySelector('.soundBar')
    if (oldImage) {
        oldImage.outerHTML = ''
    }
    if (src) {
        let image = document.createElement('img')
        image.classList.add('soundBar')
        image.src = src
        document.querySelector('body').appendChild(image)
    }
}

$canvas.addEventListener('click', () => {
    for (let i = 0; i < textPosition.length; i++) {
        const element = textPosition[i];
        if (element != undefined) {
            if (cursor.x >= element.x && cursor.y >= element.y && cursor.x <= element.x + element.w && cursor.y <= element.y + element.h) {
                if ($canvas.sound != undefined) {
                    if (!$canvas.sound.paused) {
                        $canvas.sound.pause()
                    }
                }
                $canvas.sound = element.music
                $canvas.sound.currentTime = 0
                $canvas.sound.play()
                generateMenu(element.img)
                image.src = element.bg ? element.bg : '';
            }
        }
    }
})

const loop = () => {
    context.clearRect(0, 0, windowWidth, windowHeight); // effacer le canvas
    generateGrad()
    window.requestAnimationFrame(loop)
    context.drawImage(image, 0, 0, windowWidth, windowHeight)
    textPosition = []
    createLines()

    // for (let i = 0; i < textPosition.length; i++) {
    //     const element = textPosition[i];
    //     if (element != undefined) {
    //         context.fillStyle = 'rgba(0,0,250, 0.5)'
    //         context.fillRect(element.x, element.y, element.w, element.h)
    //     }
    // }
}
loop()