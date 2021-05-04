
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
         MeshStandardMaterial,
         Vector3} from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as CanvasSign from './CanvasSign.js';

const loader = new FBXLoader();
const texLoader = new TextureLoader().setPath('Assets/textures/');
const useSkyBox = true;
const environment = buildEnvironment();
var mixers_environment = [];
var basicMaterial = new MeshStandardMaterial({
    map: texLoader.load('floor_tiles.jpg')
});
var myObject = new Object3D();
    

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
    loadSigns();
  
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
    //var material = new MeshBasicMaterial( {color: 0x00ff00} );
    var cube = new Mesh(geometry, basicMaterial);

    myObject.name = 'name';
    myObject.position.set(-250, 100, -250);

    //loading mesh data and assigning material
    loader.load('Assets/models/Monkey.fbx', function ( object ) {

        object.traverse(function (child) {
            if( child instanceof Mesh ){
                child.material = basicMaterial;
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });
        myObject.add(object);
    });
    
    environment.add(myObject);

    environment.add(cube);        
}

function loadSigns(){
    
    //  Create and add your Signs here
    var sign = new CanvasSign.create();
    sign.title = "Title";
    sign.text = "This is \n some text.";
    sign.environment = environment;
    sign.loadSign(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
}

export {loadEnvironment, updateEnvironment}