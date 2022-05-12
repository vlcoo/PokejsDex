const P = new Pokedex.Pokedex();
let bgColor;
let currView;
let fonts;
let colors;

function setup() {
    createCanvas(512, 768);
    noSmooth();

    setupFonts();
    setupColors();

    bgColor = color(186, 32, 16);
    let which = "piplup"
    Promise.all([P.getPokemonByName(which), P.getPokemonSpeciesByName(which)]).then(function(results) {
        currView = new VPokeInfo(results[0], results[1])
    }).catch(function(err) {
        currView = new VError("Sorry. " + err.message);
    });
}

function setupFonts() {
    fonts = [];
    fonts[0] = loadFont("assets/fonts/truthideals_normal.ttf");
    textFont(fonts[0]);
    textSize(20.5);
}

function setupColors() {
    colors = {
        "blFg": color(86, 81, 80),
        "blSh": color(163, 164, 171),
        "whFg": color(251, 251, 251),
        "whSh": color(104, 105, 111),
    };
}

function draw() {
    background(bgColor);
    if (currView != null) currView.onDraw();
}

function shText(msg, x, y, colorFg, colorSh, x2=300, y2=700) {
    msg = msg.toString().replace(/(\r\n|\n|\r)/gm, " ");

    push();
    textLeading(30);
    fill(colorSh);
    text(msg, x+2, y+2, x2, y2);
    fill(colorFg);
    text(msg, x, y, x2, y2);
    pop();
}

function capitalize(msg) {
    return msg.charAt(0).toUpperCase() + msg.slice(1);
}
