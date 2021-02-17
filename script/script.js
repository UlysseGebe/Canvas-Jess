const $canvas = document.querySelector('.js-canvas')
const context = $canvas.getContext('2d')

// Récupération de la clée 'saison' en GET
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

// Récueration des données en fonction de la clée 'saison'
for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
        $canvas.saison = key == $_GET() ? data[key].adj : data['ete'].adj
        $canvas.gradient = key == $_GET() ? data[key].bgColor : data['ete'].bgColor
    }
}

// Chargement de l'image
let image = new Image();
image.addEventListener('load', () => {
    context.drawImage(image, 0, 0, windowWidth, windowHeight)
})

// Resize de la page Start
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

// Resize de la page End

let position = {}, // Position du text animé
    ecart = 200,
    maxLimit = $canvas.width * (4 / 3), // Limite des mots
    textPosition = [], // Tableau de donnée
    count = 0, // Index de textPosition
    x = 0 // abscisse enregistrée dans textPosition
position.x = 0
position.y = $canvas.height / 5
position.vx = 0.1

// Récupération de la position de la souris
const cursor = {}
cursor.x = 0
cursor.y = 0
$canvas.addEventListener('mousemove', (_event) => {
    cursor.x = _event.clientX
    cursor.y = _event.clientY
})

// Génération du text
// Enregistrement de la position des texts présents dans textPosition[]
const generateText = (element, line) => {
    let word = element.name.toUpperCase(), // Nom en uppercase
        gap = element.position // Ecart entre les mots
    gap += ($canvas.width / 4.5)

    // Parametre du text
    context.font = "60px Montserrat";
    context.strokeStyle = "white";
    context.lineWidth = 2.5;
    context.textAlign = "center";

    if (line % 2 == 0) { // Concerne les lignes 0 et 2
        if (position.x + gap / 2 <= (maxLimit)) {
            x = position.x + gap

            // Positionement du mot
            context.strokeText(word, position.x + gap, position.y);

            // Enregistrement des données
            textPosition[count] = {
                w: context.measureText(word).width,
                h: 60, // Font size in px
                x: x - context.measureText(word).width / 2,
                y: position.y - 50,
                music: element.sound,
                img: element.bar,
                bg: element.bg
            }

            // Incrémentation de count
            count++
        }
        if (position.x + gap * 2 >= (maxLimit)) {
            x = position.x + gap - (maxLimit)

            // Positionement du mot
            context.strokeText(word, position.x + gap - (maxLimit), position.y);

            // Enregistrement des données
            textPosition[count] = {
                w: context.measureText(word).width,
                h: 60, // Font size in px
                x: x - context.measureText(word).width / 2,
                y: position.y - 50,
                music: element.sound,
                img: element.bar,
                bg: element.bg
            }

            // Incrémentation de count
            count++
        }
    }
    if (line % 2 != 0) { // Concerne les lignes 1 et 3
        if (-position.x - ecart + gap * 2 >= 0) {
            x = (-position.x + gap) - ecart

            // Positionement du mot
            context.strokeText(word, (-position.x + gap) - ecart, position.y);

            // Enregistrement des données
            textPosition[count] = {
                w: context.measureText(word).width,
                h: 60, // Font size in px
                x: x - context.measureText(word).width / 2,
                y: position.y - 50,
                music: element.sound,
                img: element.bar,
                bg: element.bg
            }

            // Incrémentation de count
            count++
        }
        if (-position.x - ecart + gap / 2 <= 0) {
            x = (-position.x + gap) - ecart + (maxLimit)

            // Positionement du mot
            context.strokeText(word, (-position.x + gap) - ecart + (maxLimit), position.y);

            // Enregistrement des données
            textPosition[count] = {
                w: context.measureText(word).width,
                h: 60, // Font size in px
                x: x - context.measureText(word).width / 2,
                y: position.y - 50,
                music: element.sound,
                img: element.bar,
                bg: element.bg
            }

            // Incrémentation de count
            count++
        }
    }
}

// Génération des 4 lignes
const createLines = () => {
    for (let j = 0; j < 4; j++) {
        // Génération des mots dans chaques lignes
        for (let i = 0; i < $canvas.saison.length; i++) {
            const element = $canvas.saison[i];
            generateText(element, j)

        }
        // Mouvement
        position.x += position.vx
        // Réinitialisation de la position
        position.x = position.x % (maxLimit)
        position.y += $canvas.height / 5
    }
    // Reinitioalisation de count
    count = 0
    // Découpage proportionnelle
    position.y = $canvas.height / 5
}

// Gradient
const generateGrad = () => {
    const gradient = context.createLinearGradient(windowWidth / 2, 0, windowWidth / 2, windowHeight) // x1, y1, x2, y2
    for (let i = 0; i < $canvas.gradient.length; i++) {
        const element = $canvas.gradient[i];
        gradient.addColorStop(element[0], element[1])
    }
    context.fillStyle = gradient // Le dégradé devient le style de remplissage
    context.fillRect(0, 0, windowWidth, windowHeight) // On dessine un carré
}

// Création du menu en bas de page
const generateMenu = (src) => {
    // Suppression de l'ancien
    let oldImage = document.querySelector('.soundBar')
    if (oldImage) {
        oldImage.outerHTML = ''
    }
    // Création du nouveau
    if (src) {
        let image = document.createElement('img')
        image.classList.add('soundBar')
        image.src = src
        document.querySelector('body').appendChild(image)
    }
}

// Event click
$canvas.addEventListener('click', () => {
    for (let i = 0; i < textPosition.length; i++) {
        const element = textPosition[i];
        // Filtre (dans le tableau, il y a des undefined)
        if (element != undefined) {
            // Condition click, dans un des mots
            if (cursor.x >= element.x && cursor.y >= element.y && cursor.x <= element.x + element.w && cursor.y <= element.y + element.h) {
                // Si il y avait déjà un sons, arret
                if ($canvas.sound != undefined) {
                    if (!$canvas.sound.paused) {
                        $canvas.sound.pause()
                    }
                }

                // Enregistrement du sons dans la variable globale
                $canvas.sound = element.music
                // Lecture du sons
                $canvas.sound.currentTime = 0
                $canvas.sound.play()

                // Génération du menu en bas de page
                generateMenu(element.img)

                // Changement de décor
                image.src = element.bg ? element.bg : '';
            }
        }
    }
})

const loop = () => {
    context.clearRect(0, 0, windowWidth, windowHeight); // effacer le canvas
    generateGrad()
    window.requestAnimationFrame(loop)
    context.drawImage(image, 0, 0, windowWidth, windowHeight) // Pour chaque frame, voir le décor (image -> décore)
    textPosition = [] // Réinitialisation des données du tableaux
    createLines()

    // Visialisation de la zone de click
    // for (let i = 0; i < textPosition.length; i++) {
    //     const element = textPosition[i];
    //     if (element != undefined) {
    //         context.fillStyle = 'rgba(0,0,250, 0.5)'
    //         context.fillRect(element.x, element.y, element.w, element.h)
    //     }
    // }
}
loop()