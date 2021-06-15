
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
         Vector3,
         LOD,
         AnimationMixer,
         CatmullRomCurve3,
         BufferGeometry,
         LineBasicMaterial,
         Vector2,
         Line} from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as CanvasSign from './CanvasSign.js';
import * as Grid from './procedural/grid.js';

const loader = new FBXLoader();
const texLoader = new TextureLoader().setPath('Assets/textures/');
const useSkyBox = true;
const environment = buildEnvironment();
var mixers_environment = [];
var basicMaterial = new MeshStandardMaterial({
    map: texLoader.load('floor_tiles.jpg')
});
var SteelBeamMaterial = new MeshStandardMaterial ({
    map: texLoader.load('SteelBeam/RustyMetalBaseColor.png'),
    normalMap: texLoader.load('Assets/textures/RustyMetalNormal.png'),
    normalScale: new Vector2(1, 1),
    roughness: 1,
    roughnessMap: texLoader.load('Assets/textures/RustyMetalRoughness.png'),
    displacementMap: texLoader.load('Assets/textures/RustyMetalDisplacement.png'),
    specularMap: texLoader.load('Assets/textures/RustyMetalSpecular.png')
})
var mugMaterial = new MeshStandardMaterial({
    map: texLoader.load('Mug/PorcelainBase.png'),
    normalScale: new Vector2(1, 1),
    roughness: 1,
    roughnessMap: texLoader.load('Mug/PorcelainBase.png'),
});
var myObject = new Object3D();
var transportShipSpeed = 0.05;
var transportShipProgress;
var transportShip;
var transportShipPath;
var animationStartPosition = new Vector3(650, 0, -200);

function buildEnvironment()
{
    const environment = new Object3D();

    return environment;
}

const loadEnvironment = function ( scene )
{    

    loadGrid( scene );
    loadBackground( scene );
    loadObjects();
    loadSigns();
    loadFBXLODs();
    loadCurveAnimation();
    loadTileGrid();

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

    const path = "assets/textures/cubemaps/approaching_storm/";
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
    //var geometry = new BoxGeometry(100, 100, 100);
    //var material = new MeshBasicMaterial( {color: 0x00ff00} );
    //var cube = new Mesh(geometry, basicMaterial);

    myObject.name = 'name';
    myObject.position.set(-250, 100, -250);

    //loading mesh data and assigning material
    loader.load('assets/models/SteelBeam.fbx', function ( object ) {

        object.traverse(function (child) {
            if( child instanceof Mesh ){
                child.material = SteelBeamMaterial;
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });
        myObject.add(object);
    });
    
    environment.add(myObject);

    //environment.add(cube); 
    
    var transportShip = new Object3D;

    transportShip.name = 'Transporter';
    transportShip.position.set(250, 100, 250);
    transportShip.scale.set(2,2,2);

    //loading mesh data and assigning material
    loader.load('assets/models/TransportShip.fbx', function ( object ) {

        object.traverse(function (child) {
            if( child instanceof Mesh ){
                child.material = basicMaterial;
                child.receiveShadow = true;
                child.castShadow = true;
            }
        });
        myObject.add(object);
    });
    
    environment.add(transportShip);
}

function loadSigns(){
    
    //  Create and add your Signs here
    var sign = new CanvasSign.create();
    sign.title = "Title";
    sign.text = "This is \n some text.";
    sign.environment = environment;
    sign.loadSign(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1));
}

function loadFBXLODs(){
    var lod = new LOD();

    var mug_LOD0 = new Object3D();
        mug_LOD0.name = 'mug_LOD0';

    loader.load('assets/models/lods/Mug/CoffeeMug(LOD0).fbx', function(obj){
        mug_LOD0.add(obj);
    });

    lod.addLevel(mug_LOD0, 500);

    var mug_LOD1 = new Object3D();
        mug_LOD1.name = 'mug_LOD1';

    loader.load('assets/models/lods/Mug/CoffeeMug(LOD1).fbx', function(obj){
        mug_LOD1.add(obj);
    });

    lod.addLevel(mug_LOD1, 1000);

    var mug_LOD2 = new Object3D();
        mug_LOD2.name = 'mug_LOD2';

    loader.load('assets/models/lods/Mug/CoffeeMug(LOD2).fbx', function(obj){
        mug_LOD2.add(obj);
    });

    lod.addLevel(mug_LOD2, 1500);

    lod.a

    lod.position.x = 200;
    lod.position.y = 0;
    lod.position.z = 200;

    environment.add(lod)
}

function loadCurveAnimation() {
    transportShip = new Object3D ();
    transportShip.name = 'transport';
    transportShip.scale.set(0.5, 0.5, 0.5);

    loader.load('assets/models/Bird_Motions.fbx', function (obj) {
        //creating mixer
        obj.mixer = new AnimationMixer(obj);
        mixers_environment.push(obj.mixer);
        //setting animation actions
        obj.mixer.clipAction(obj.animations[0]).play();
        //fixing initial rotation
        obj.rotation.z = 0.79 * Math.PI;

        //adding object to scene
        transportShip.add(obj);
    });

    environment.add(transportShip);

    //path
    let pathScale = 35;
    transportShipPath = new CatmullRomCurve3([
        new Vector3(10, 10, 0).multiplyScalar(pathScale),
        new Vector3(0, 15, 5).multiplyScalar(pathScale),
        new Vector3(-10, 10, -5).multiplyScalar(pathScale),
        new Vector3(0, 8, 0).multiplyScalar(pathScale)
    ], true);

    //path visuals (optional)
    let points = transportShipPath.getPoints(50);
    let geometry = new BufferGeometry().setFromPoints(points);
    let material = new LineBasicMaterial({ color: 0x00000000 });
    let curveObject = new Line(geometry, material);
    environment.add(curveObject);

    //animation setup
    curveObject.position.set(animationStartPosition.x, animationStartPosition.y, animationStartPosition.z)
}

function updateCurveAnimation(delta) {

    //function curve progress
    let step = transportShipProgress + transportShipSpeed * delta;
    transportShipProgress = step < 1 ? step : 0; //reset

    //update position
    let pathEval = transportShipPath.getPoint(transportShipProgress);

    let newPosition = pathEval.add(animationStartPosition);
    transportShip.lookAt(newPosition.x, newPosition.y, newPosition.z);
    transportShip.position.set(newPosition.x, newPosition.y, newPosition.z);
}

function loadTileGrid() {
    let myGrid = new Grid.gridGenerator(25, 25, 100);
    myGrid.init();
    myGrid.createVisuals();
    myGrid.sceneObject.position.set(0, 0, 0);
    environment.add(myGrid.sceneObject);
}

export {loadEnvironment, updateEnvironment, updateCurveAnimation };