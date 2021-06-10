
import { Clock,
         WebGLRenderer,
         Scene,
         PerspectiveCamera,
         HemisphereLight,
         DirectionalLight,
         Color,
         Fog } from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import * as Player from './player.js';
import * as Environment from './environment.js';
import * as Input from './input.js';

const clock = new Clock();
const renderer = buildRenderer();
const scene = buildScene();
const camera = buildCamera();
const light = buildLight();
const controls = buildControls();

Player.loadPlayer( scene );
Environment.loadEnvironment( scene );
Input.addEvents();

animate();


function buildRenderer()
{    
    let container = document.createElement( 'div' );
    document.body.appendChild( container );

    //creating renderer
    const renderer = new WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    return renderer;
}

function buildScene()
{
    //creating scene
    const scene = new Scene();
    scene.background = new Color( 0xffffff );
    scene.fog = new Fog( 0xcccccc, 1000, 10000);

    return scene;
}

function buildCamera()
{    
    let fov = 75;
    //creating camera
    const camera = new PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 100, 200, 500 );
    scene.add( camera );

    return camera;
}

function buildLight()
{
    //adding sky light to scene
    const light = new HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );

    return light;
}


function buildControls()
{
    //creating camera controls
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );

    return controls;
}

function animate()
{
    requestAnimationFrame( animate );

    var delta = clock.getDelta();

    Player.updatePlayer( delta );
    Player.updateControls( camera, controls, delta );
    Environment.updateEnvironment( delta );
                
    renderer.render( scene, camera );
}