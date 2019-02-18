//All function take input and give output in SI units.
//Scale is roughly 
// --> 1 pixel = 10 km
// --> 1 tick = 1 Ms (mega-second)

const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let center = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

// Preliminary code for normalising the distances to the masses etc. 
// to better reflect the scale of the universe while taking into
// account the size of the screen. Using some form of logarithmic 
// for displaying all distances, but making calculations with unscaled distances.
const normal = 6.371e6
const normalConstant = normal/Math.log10(normal) //constant which will multiply to a scale of making 'normal' = 10px

const G = 6.6740e-11 /* celestialConstant;*/
let tickrate = 16; //milliseconds between each update. 60fps ~= 16.666.. ms per frame
let forceTime = 6e-5; //seconds over which acceleration is calculated

const sys = {
    paused: false,
    colours: false,
    wallBounce: false, //add later to make it bounce like the dvd logo lmao
    help: function() { //console log a guide
        //how to add, remove planets
        //how to pause/resume
        //how to view planet info
        //how to change tickrate
    },
    pause: function() { //pause the system
        this.paused = true;
        console.log("System paused")
    },
    resume: function() { //resume the system
        this.paused = false;
        console.log("System resumed")
    },
    toggleColours: function() {
        //todo
        //add colours based on mass
    },
    addPlanet: function(name, radius, mass, colour, pos, vel) {
        let newPlanet = new Planet(name, radius, mass, colour, pos, vel);
        planets.push(newPlanet)
        planets.slice(-1)[0].create() //access last element of planets array and create it. hopefully the last element is the one created just now.
    },
    removePlanet: function(name) {
        //search through planets array, if matching name is found then remove, else error
    },
    resize: function(args) { //resize viewport to either pixel amount or percentage of screen
        //check if last char is % or x (from px) then parseint value and change
        let pixels;
        if (true/*percent*/) {
            let percent = parseInt(args),
                screenHeight = window.innerHeight,
                screenWidth = window.innerWidth;
            if (screenHeight < screenWidth) {
                pixels = screenHeight * percent / 100;
            } else {
                pixels = screenWidth * percent / 100
            }
        } else if (false/*px*/) {

        } else { //error
            console.log("Unrecognised input to system.resize().");
            return;
        }
        canvas.width = pixels;
        canvas.height = pixels;

        center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
    },
    info: function(planet) { //console log the info for a particular planet
        //
    },
    tickrate: function(int) { //change tickrate to specified integer
        if (int === undefined) return tickrate;
        tickrate = int;
    },
    suicide: function() {
        planets = [];
    }
}

//pos and vel are objects with x and y properties, vel in m/s
//radius in m, mass in kg
const Planet = function(name, radius, mass, colour, pos, vel) {
    const planet = this;
    this.name = name;
    this.radius = radius;
    this.mass = mass;
    this.colour = colour;
    this.pos = pos;
    this.vel = vel;
    this.create = function(){
        ctx.beginPath();
        ctx.arc(center.x + planet.pos.x, center.y - planet.pos.y, planet.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = planet.colour;
        ctx.stroke();
        ctx.closePath();
    };
};


// let planets = [ //earth moon type system
//     new Planet("earth", 10, 5e17, "white", {x:0, y:0}, {x:0, y:0}),
//     new Planet("moon", 3, 7e9, "white", {x:190, y:0}, {x:0, y:1.4})
// ]

let planets = [ //two body simulatneous orbit
    new Planet("no", 10, 6e16, "white", {x:300, y:100}, {x:-2e-2, y:-2.5e-1}),
    new Planet("homo", 10, 6e16, "white", {x:-300, y:-100}, {x:2e-2, y:2.5e-1}),
]

const ops = {
    displacement: function(planet1, planet2) { //displacement FROM planet1 TO planet 2, returned as object with x, y, magnitude, angle properties in METRES and RADIANS
        let x = planet2.pos.x - planet1.pos.x,
            y = planet2.pos.y - planet1.pos.y,
            magnitude = Math.sqrt(x*x + y*y);
            // magnitude = ops.normalise( Math.sqrt(x*x + y*y) ), //see normalise funtion. Lets F(grav) act as if distances were normal
            angle = Math.atan2(y, x); //fucking hell atan2 needs y first then x (i mean obviously)
        return {
            x: x, 
            y: y, 
            magnitude: magnitude, 
            angle: angle
        }
    },
    gravitationalForce: function(planet1, planet2) { //returns the magnitude of gravitational force planet2 exerts on planet1
        let r = this.displacement(planet1, planet2).magnitude,
            m1 = planet1.mass,
            m2 = planet2.mass,
            g = ( G * m1 * m2 )/( r**2 );
        return g;
    },
    normalise: function(int) { //scales distances so force acts as if distances were bigger, normalised so that "vanilla" system reflects the mood/earth syste
        let normalInt = normalConstant * Math.log10(int);
        return normalInt;
    }
}

var letThereBeLight = function(){ //create all planets
    for (let i = 0; i < planets.length; i++){
        planets[i].create();
    }
}
//function for moving planets
const nyoom = function(){ 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < planets.length; i++){
        ctx.beginPath();
        let planet = planets[i];
        planet.pos.x += planet.vel.x;
        planet.pos.y += planet.vel.y;
        ctx.strokeStyle = planet.colour;
        ctx.arc(center.x + planet.pos.x, center.y - planet.pos.y, planet.radius, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.stroke();
    }
}
//TODO
// - Add collision detection.
//    * on collision, add radius and mass to form 1 body

const collision = function() {
    for (let i = 0; i < planets.length; i++){
        let p1 = planets[i];
        let xFullDisplacement = Math.abs(p1.pos.x) + p1.radius;
        let yFullDisplacement = Math.abs(p1.pos.y) + p1.radius;

        if ( xFullDisplacement >= canvas.width / 2 ) { //if planet touches vert walls
            p1.vel.x *= -1;
        } else if ( yFullDisplacement >= canvas.height / 2 ) { //if planet touches horizontal walls
            p1.vel.y *= -1;
        }
        for (let j = 0; j < planets.length; j++){
            if (planets[j] == p1) continue; //skip if p1 = p2, more robust check than i===j in case [planets] is changed
            let p2 = planets[j];
       }
    }
}

const harderDaddy = function(){ //force of gravity pulling on each planet
    for (let i = 0; i < planets.length; i++){
        let p1 = planets[i];
        for (let j = 0; j < planets.length; j++){
            if (planets[j] == p1) continue;
            let p2 = planets[j];
            let displacement = ops.displacement(p1, p2);
            let force = ops.gravitationalForce(p2, p1);
            let a = force / p1.mass; //acceleration
            let t = forceTime; //time change is taking place over
            let ax = a * Math.cos(displacement.angle);
            let ay = a * Math.sin(displacement.angle);
            p1.vel.x += ax * t;
            p1.vel.y += ay * t;
            // console.log(p1.name, "->", p2.name, displacement.angle / Math.PI * 180)
            // console.log(`displacement ${p1.name}, ${p2.name}: `, displacement);
            // console.log(`accelerated ${p1.name}: mag ${a}, comp ${ax}, ${ay}`)
            // console.log(`${p1.name} acted upon by ${p2.name} with magnitude ${force}`)
        }
    }
}



const tick = function() {
    if (!sys.paused){
        nyoom();
        collision();
        harderDaddy();
        window.setTimeout(tick, tickrate) // better than setinterval because allows for changing of interval
    } else {
        window.setTimeout(tick, tickrate)
    }
}

//init
var init = function(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

var main = function(){
    tick();
};

init();
main();