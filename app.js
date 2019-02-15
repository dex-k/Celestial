const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;

//init
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

//pos and vel are arrays [x,y] vel in m/s
//radius in m, mass in kg
var Planet = function(radius, mass, posX, posY, velX, velY) {
    var planet = this;
    this.radius = radius;
    this.mass = mass;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
    this.create = function(){
        ctx.beginPath();
        ctx.arc(centerX + planet.posX, centerY + planet.posY, planet.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
    this.update = setInterval(function(){
        planet.posX += planet.velX;
        planet.posY += planet.velY;
        console.log("moving ball with vel: ", planet.velX, planet.velY)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(centerX + planet.posX, centerY + planet.posY, planet.radius, 0, Math.PI*2, false);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }, 100)
}

var test = new Planet(50, 6e24, -50, 10, .1, .21);
test.create();