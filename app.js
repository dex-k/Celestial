//All function take input and give output in SI units.
//Scale is roughly 
// --> 1 pixel = 1 km
// --> 1 tick = 1 Ms (mega-second)

const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let center = {
    x: canvas.width / 2,
    y: canvas.height / 2
};
const celestialConstant = 1 //multiplicative constant to edit the value of G to be more usable.
const G = 6.6740e-11 * celestialConstant;
const tickrate = 1e3; //ticks per second
const tickTime = 1000 / tickrate; //milliseconds per tick
const wallBounce = false //add later to make it bounce like the dvd logo lmao


//pos and vel are objects with x and y properties, vel in m/s
//radius in m, mass in kg
var Planet = function(name, radius, mass, colour, pos, vel) {
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
        ctx.fill();
        ctx.closePath();
    };
    // this.ds = function(){ //update position according to velocity [ds => delta s(displacement)]
    //     planet.pos.x += planet.vel.x;
    //     planet.pos.y += planet.vel.y;
    //     console.log("moving", planet.name, "at", planet.pos.x, planet.pos.y, "with vel:", planet.vel.x, planet.vel.y)
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.beginPath();
    //     ctx.arc(center.x + planet.pos.x, center.y + planet.pos.y, planet.radius, 0, Math.PI*2, false);
    //     ctx.fillStyle = planet.colour;
    //     ctx.fill();
    //     ctx.closePath();
    // };
    // this.dv = function(){ //update velocity according to gravity force of all planets
    //     //for each other planet - make sure to exclude itsself
    //     // --> Calculate
    // };
};


var planets = [
    new Planet("test1", 20, 6e18, "white", {x:0, y:0}, {x:0, y:0}),
    new Planet("test2", 10, 2, "white", {x:100, y:100}, {x:0, y:0}),
] //global array of existing planets, can add or remove at any time

var operations = {
    displacement: function(planet1, planet2) { //displacement FROM planet1 TO planet 2, returned as object with x, y, magnitude, angle properties in METRES and RADIANS
        let x = planet2.pos.x - planet1.pos.x,
            y = planet2.pos.y - planet1.pos.y,
            magnitude = Math.sqrt(x*x + y*y),
            angle = Math.atan2(x, y);
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
    }
}

//init
var init = function(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

var letThereBeLight = function(){ //create all planets
    for (let i = 0; i < planets.length; i++){
        planets[i].create();
    }
}

var nyoom = function(){ //move every planet
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (let i = 0; i < planets.length; i++){
        let planet = planets[i];
        planet.pos.x += planet.vel.x;
        planet.pos.y += planet.vel.y;
        ctx.fillStyle = planet.colour;
        ctx.arc(center.x + planet.pos.x, center.y - planet.pos.y, planet.radius, 0, Math.PI*2, false);
        ctx.fill();
    }
    ctx.closePath();
}
//TODO see if i can use ctx.fillArc() ?
//TODO
// - Add collision detection.
//    * on collision, add radius and mass to form 1 body

//
// !!!!!
// POBLEM WITH HARDERDADDY FUNCTION
// !!!!!
//
var harderDaddy = function(){ //force of gravity pulling on each planet
    for (let i = 0; i < planets.length; i++){
        let p1 = planets[i];
        for (let j = 0; j < planets.length; j++){
            if (planets[j] == p1) continue;
            let p2 = planets[j];
            let displacement = operations.displacement(p1, p2);
            let force = operations.gravitationalForce(p1, p2);
            let a = force / p1.mass; //acceleration
            let t = tickTime / 100; //time change is taking place over
            let ax = -a * Math.cos(displacement.angle);
            let ay = a * Math.sin(displacement.angle);
            let vx = p1.vel.x * t + 0.5 * ax * t**2;
            let vy = p1.vel.y * t + 0.5 * ay * t**2;
            p1.vel.x = vx;
            p1.vel.y = vy;
            // console.log(`displacement ${p1.name}, ${p2.name}: `, displacement);
            // console.log(`accelerated ${p1.name}: mag ${a}, comp ${ax}, ${ay}`)
            // console.log(`${p1.name} acted upon by ${p2.name} with magnitude ${force}`)
        }
    }
}

var main = function(){
    letThereBeLight();
    let tick = setInterval(function() {
        nyoom();
        harderDaddy();
    },tickTime)

};
main();