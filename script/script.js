const $canvas = document.querySelector('.js-canvas')
const context = $canvas.getContext('2d')

$canvas.saison = data.ete

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

let position = {}
position.x = 0
position.y = $canvas.height/2
position.vx = 0

const generateText = (word, old, line) => {
    context.font="30px Comic Sans MS";
    context.fillStyle = "red";
    context.textAlign = "center";
    if (old) {
        position.x += context.measureText(old).width
    }
    if (line == 1 || line == 3) {
        context.fillText(word, position.vx * -1 + position.x, position.y);
    }
    else {
        context.fillText(word, position.vx + position.x, position.y);
    }
}

const cursor = {}
cursor.x = 0
cursor.y = 0

$canvas.addEventListener('mousemove', (_event) => {
    cursor.x = _event.clientX
    cursor.y = _event.clientY
})

const createLines = () => {
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < $canvas.saison.length; i++) {
            const olderElement = $canvas.saison[i];
            const element = $canvas.saison[i];
            generateText(element.name, olderElement, j)
        }
        position.x = 0
        position.y += 50
    }
    position.y = $canvas.height/2
}

const loop = () => {
    context.clearRect(0,0,windowWidth, windowHeight); // effacer le canvas
    window.requestAnimationFrame(loop)
    position.vx += 0.75
    createLines()
    position.x += 1
    // context.fillStyle = 'rgba(255, 255, 255, 0.3)'
    // context.fillRect(0, 0, windowWidth, windowHeight)
}
loop()