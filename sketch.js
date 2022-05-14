const P = new Pokedex.Pokedex();
let bgColor;
let currView;
let fonts;
let colors;
let images = {};
let bgGridXPos = 0;

function setup() {
    createCanvas(512, 768);
    noSmooth();

    setupFonts();
    setupColors();
    setupImages();

    bgColor = color(186, 32, 16);
    loadMainMenu();
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

function setupImages() {
    images["bg_grid_info"] = loadImage("assets/graphics/bg_grid_info.png");
    images["bg_textbox"] = loadImage("assets/graphics/bg_textbox.png");
    images["toolbar_info"] = loadImage("assets/graphics/toolbar_info.png");
    images["toolbar_bg_bottomNavi"] = loadImage("assets/graphics/toolbar_bg_bottomNavi.png");
    images["bg_grid_list"] = loadImage("assets/graphics/bg_grid_list.png");
    images["bg_list"] = loadImage("assets/graphics/bg_list.png");
    images["toolbar_natdex"] = loadImage("assets/graphics/toolbar_natdex.png");
    images["button_listEntry_up"] = loadImage("assets/graphics/button_listEntry_up.png"),
    images["button_listEntry_down"] = loadImage("assets/graphics/button_listEntry_down.png")
}

function draw() {
    background(bgColor);
    if (currView != null) {
        currView.onDraw(); 
    }
}

function keyPressed() {
    if (currView != null) currView.onKeyInput(keyCode);
}

function mouseClicked() {
    if (currView != null) currView.onMouseInput(mouseX, mouseY, mouseButton);
}

function mouseWheel(event) {
    if (currView != null) currView.onScrollInput(event.delta);
}

function loadMainMenu(presetScroll) {
    P.getPokedexByName("national").then(function(response) {
        currView = new VPokeList(response, presetScroll);
    }).catch(function(err) {
        currView = new VError(err.message);
    })
}

function loadPokeInfoView(which) {
    Promise.all([P.getPokemonByName(which), P.getPokemonSpeciesByName(which)]).then(function(results) {
        currView = new VPokeInfo(results[0], results[1])
    }).catch(function(err) {
        currView = new VError(err.message);
    });
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
