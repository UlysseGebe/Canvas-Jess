const $canvas = document.querySelector('.js-canvas')
const context = $canvas.getContext('2d')

$canvas.saison = data.ete.adj
$canvas.gradient = data.ete.bgColor

// $canvas.sounds.snow.currentTime = 0
// $canvas.sounds.snow.play()

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

let position = {}, oldWidth = 0, ecart = 200, maxLimit = $canvas.width * (4 / 3)
position.x = 0
position.y = $canvas.height / 5
position.vx = 0.1

const cursor = {}
cursor.x = 0
cursor.y = 0

$canvas.addEventListener('mousemove', (_event) => {
    cursor.x = _event.clientX
    cursor.y = _event.clientY
})

const generateText = (word, old, line, gap) => {
    context.font="60px Montserrat";
    context.strokeStyle = "white";
    context.lineWidth = 2.5;
    context.textAlign = "center";
    gap += ($canvas.width / 4.5)
    if (line%2 == 0) {
        if (position.x + gap / 2 <= (maxLimit)) {
            context.strokeText(word, position.x + gap, position.y);
        }
        if (position.x + gap * 2 >= (maxLimit)) {
            context.strokeText(word, position.x + gap - (maxLimit), position.y);
        }
    } else {
        if (-position.x - ecart + gap * 2 >= 0) {
            context.strokeText(word, (-position.x + gap) - ecart , position.y);
        }
        if (-position.x - ecart + gap / 2 <= 0) {
            context.strokeText(word, (-position.x + gap) - ecart + (maxLimit), position.y);
        }
    }
}

const createLines = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < $canvas.saison.length; i++) {
            const olderElement = $canvas.saison[i];
            const element = $canvas.saison[i];
            generateText(element.name.toUpperCase(), olderElement, j, element.position)
        }
        position.x += position.vx
        position.x = position.x % (maxLimit)
        position.y += $canvas.height / 5
        oldWidth = 0
    }
    position.y = $canvas.height / 5
}

const generateGrad = () => {
    const gradient = context.createLinearGradient(windowWidth / 2, 0, windowWidth / 2, windowHeight) // x1, y1, x2, y2
    for (let i = 0; i < $canvas.gradient.length; i++) {
        const element = $canvas.gradient[i];
        gradient.addColorStop(element[0], element[1])
    }
    context.fillStyle = gradient  // Le dégradé devient le style de remplissage
    context.fillRect(0, 0, windowWidth, windowHeight) // On dessine un carré
}

const loop = () => {
    context.clearRect(0,0,windowWidth, windowHeight); // effacer le canvas
    generateGrad()
    window.requestAnimationFrame(loop)
    createLines()
    // context.fillStyle = 'rgba(255, 255, 255, 0.3)'
    // context.fillRect(0, 0, windowWidth, windowHeight)
}
loop()