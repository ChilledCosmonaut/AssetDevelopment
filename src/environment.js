
import { Object3D,
		 GridHelper,
         TextureLoader,
		 RGBFormat,
		 CubeTextureLoader,
		 CubeRefractionMapping,
         Color,
         BoxGeometry,
         MeshBasicMaterial,
         Mesh,
         MeshStandardMaterial} from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as CanvasSign from './CanvasSign.js';

const loader = new FBXLoader();
const texLoader = new TextureLoader().setPath('Assets/textures/');
const useSkyBox = true;
const environment = buildEnvironment();
var mixers_environment = [];

function buildEnvironment()
{
    const environment = new Object3D();

    return environment;
}

const loadEnvironment = function ( scene )
{    

    loadGrid( scene );
    loadBackground( scene );
    //loadObjects();
    //loadSigns();
  
    scene.add(environment);
}

const updateEnvironment = function( delta )
{
    for(let i = 0; i < mixers_environment.length; i++) {
        mixers_environment[i].update(delta);
    }
}

function loadGrid( scene ) {

    // grid helper
    const grid = new GridHelper( 10000, 200, 0xaaaaaa, 0x000000 );
    grid.material.opacity = 0.5;
    grid.material.transparent = true;
    scene.add( grid );

}

function loadBackground( scene ) {

    const path = "Assets/textures/cubemaps/approaching_storm/";
    const format = '.jpg';
    const urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];

    const reflectionCube = new CubeTextureLoader().load(urls);
    reflectionCube.format = RGBFormat;

    const refractionCube = new CubeTextureLoader().load(urls);
    refractionCube.mapping = CubeRefractionMapping;
    refractionCube.format = RGBFormat;

    if (!useSkyBox)
    {   
        scene.background = new Color( 0xffffff );
    }
    else {
        scene.background = reflectionCube;
    }
}

function loadObjects()
{     

    //  Create and add your Objects here
    var geometry = new BoxGeometry(100, 100, 100);
    var material = new MeshBasicMaterial({color: 0x00ff00});
    var cube = new Mesh(geometry, material);

    environment.add(cube);        
}

function loadSigns(){
    
    //  Create and add your Signs here
}

export {loadEnvironment, updateEnvironment}