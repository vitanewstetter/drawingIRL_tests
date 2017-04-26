var scene, camera, renderer;

var DEBUG = true;
var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;
var SPEED = 0.01;

var cube;
var prevX;
var prevY;

var canvas = document.querySelector('#canvas'),
    ctx = canvas.getContext('2d'),
    is_drawing = false,
    last_x, last_y,
    current_x = 0,
    current_y = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function init(){
    // scene = new THREE.Scene();
    //
    // camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 1, 10);
    // camera.position.set(0, 3.5, 5);
    // camera.lookAt(scene.position);
    //
    // renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setSize(WIDTH, HEIGHT);
    //
    // cube = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshNormalMaterial());
    // scene.add(cube);


    // document.body.appendChild(renderer.domElement);
    //
    // renderer.render(scene, camera);
}

var draw_circle = function(can, ctx, x, y) {
    x = x - can.offsetLeft; // Get mouse pos. in relationship to canvas.
    y = y - can.offsetTop;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(300 + x ,150 + y , 5, 0, 2*Math.PI);
    ctx.fill();
};

function gyroSocketOnChange(value) {
    current_x = current_x + value.accX * 1;
    current_y = current_y + value.accY * 1;
    var progress = 0.0;

    while (progress <= 1.0) {
        var x_inside = last_x + (current_x - last_x) * progress;
        var y_inside = last_y + (current_y - last_y) * progress;
        draw_circle(canvas, ctx, x_inside, y_inside);
        progress = progress + 0.05;
    }

    last_x = current_x;
    last_y = current_y;

    // Display status info
    // document.getElementById("alpha").innerHTML = "alpha : " + value.alpha;
    // document.getElementById("beta").innerHTML  = "beta  : " + value.beta;
    // document.getElementById("gamma").innerHTML = "gamma : " + value.gamma;

    // Rotate cube
    // cube.position.z = value.alpha * (Math.PI/180);
    // cube.position.y = value.beta  * (Math.PI/180);
    // cube.position.x = (value.gamma * -1) * (Math.PI/180);

    // renderer.render(scene, camera);


    if(DEBUG) console.log(value);



}

// Initialize GyroSocket instance
var gyroSocket = new GyroSocket({
    uri: '/gyrosocket',
    onchange: gyroSocketOnChange,
    debug: DEBUG
}).receive();

var gyroSocket2 = new GyroSocket({
    uri: '/gyrosocket',
    onchange: gyroSocketOnChange,
    debug: DEBUG
}).send();

init();