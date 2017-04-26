var container;
var camera, scene, renderer;
var splineHelperObjects = [], splineOutline;
var splinePointsLength = 4;
var positions = [];

var geometry;

var ARC_SEGMENTS = 200;
var splineMesh;

var splines = {};

var x = 0;
var y = 0;
var z = 0;

var button = document.getElementById("button");

var params = {
    tension: 0.5,
    chordal: true,
    addPoint: addPoint,
    removePoint: removePoint,
    spline: splines.chordal,
    scale: 4,
    extrusionSegments: 100,
    radiusSegments: 5,
    closed: true,
    animationView: false,
    lookAhead: false,
    cameraHelper: false
};

var material = new THREE.MeshLambertMaterial( { color: 0xff00ff } );

function addTube() {
    var extrudePath = params.spline;
    var tubeGeometry = new THREE.TubeBufferGeometry( extrudePath, params.extrusionSegments, 2, params.radiusSegments, params.closed );
    addGeometry( tubeGeometry );
    setScale();
}

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 250, 100 );
    scene.add( camera );


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( '#F7F7F7' );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );


    // Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.damping = 0.2;
    controls.addEventListener( 'change', render );


    /*******
     * Curves
     *********/

    var i;
    for ( i = 0; i < splinePointsLength; i ++ ) {
        addSplineObject( positions[ i ] );
    }
    positions = [];
    for ( i = 0; i < splinePointsLength; i ++ ) {
        positions.push( splineHelperObjects[ i ].position );
    }

    var geometry = new THREE.Geometry();
    for ( var i = 0; i < ARC_SEGMENTS; i ++ ) {
        geometry.vertices.push( new THREE.Vector3() );
    }

    var curve;

    curve = new THREE.CatmullRomCurve3( positions );
    curve.type = 'chordal';
    curve.mesh = new THREE.Line( geometry.clone(), new THREE.LineBasicMaterial( {
        color: 0xff0000,
        opacity: 0.35,
        linewidth: 100
    } ) );
    curve.mesh.castShadow = true;
    splines.chordal = curve;

    // for ( var k in splines ) {
    //     var spline = splines[ k ];
        scene.add( splines.chordal.mesh );
    // }

    load( [ new THREE.Vector3( 28.76843686945404, 45.51481137238443, 56.10018915737797 ),
        new THREE.Vector3( -53.56300074753207, 11.49711742836848, -14.495472686253045 ),
        new THREE.Vector3( -91.40118730204415, 16.4306956436485, -6.958271935582161 ),
        new THREE.Vector3(x, y, z)
        ] );

    /*******
     * Extrusion
     *********/

}

function addSplineObject( position ) {
    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial);

        x += Math.random()*10;
        y += Math.random()*10;
        z += Math.random()*10;

        object.position.x = x;
        object.position.y = y;
        object.position.z = z;

    scene.add( object );
    splineHelperObjects.push( object );
    return object;
}

function addPoint() {
    splinePointsLength ++;
    positions.push( addSplineObject().position );

    updateSplineOutline();
}

function removePoint() {
    if ( splinePointsLength <= 4 ) {
        return;
    }
    splinePointsLength --;
    positions.pop();
    scene.remove( splineHelperObjects.pop() );

    updateSplineOutline();
}

function updateSplineOutline() {
    var p;
    for ( var k in splines ) {
        var spline = splines[ k ];
        splineMesh = spline.mesh;

        for ( var i = 0; i < ARC_SEGMENTS; i ++ ) {
            p = splineMesh.geometry.vertices[ i ];
            p.copy( spline.getPoint( i /  ( ARC_SEGMENTS - 1 ) ) );
        }
        splineMesh.geometry.verticesNeedUpdate = true;
    }
}

function load( new_positions ) {
    while ( new_positions.length > positions.length ) {
        addPoint();
    }
    while ( new_positions.length < positions.length ) {
        removePoint();
    }
    for ( i = 0; i < positions.length; i ++ ) {
        positions[ i ].copy( new_positions[ i ] );
    }
    updateSplineOutline();
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    splines.chordal.mesh.visible = params.chordal;
    renderer.render( scene, camera );
}

button.onclick = function(){
    console.log("clicked");
    addPoint();
};

var myVar = setInterval(adding, 500);


function adding() {
    addPoint();
}