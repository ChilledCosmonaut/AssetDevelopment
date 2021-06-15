import {
	Object3D,
	BoxGeometry,
	MeshPhongMaterial,
	Mesh
	
} from 'three';

import * as Random from './random.js';

let NodeTypes = {
	Street: "Street",
	Tree: "Tree",
	random: function(){
		let max = Object.keys(this).length;
		let r = Random.randomRangeInt(0, max-2);
		return this[Object.keys(this)[r]];
	}
}

 let Node = function(row, col, size, nodeType){
	this.sceneObject = new Object3D();

	this.row = row;//z
	this.col = col;//x
	this.size = size;
	this.nodeType = nodeType;
	switch(this.nodeType){
		case NodeTypes.Street:
			let tileGeo = new BoxGeometry(this.size, 5, this.size);
			let tileMat = new MeshPhongMaterial({color:0xff00ff});
			this.sceneObject.add( new Mesh(tileGeo, tileMat) );

		break;

		default:
		break;
	}
}

function gridGenerator(length, width, tilesize){
	this.sceneObject = new Object3D();

	this.length = length;
	this.width = width;
	this.tilesize = tilesize;
	this.offsetX = -this.width * this.tilesize/4;
	this.offsetZ = -this.length * this.tilesize/4;
	this.sceneObject.position.set(this.offsetX, 0, this.offsetZ);

	this.init = function(){
		this.nodes = new Array(this.length);

		// create empty grid of nodes
		for (let i=0; i<length; i++) {
			//create row
			this.nodes[i] = new Array(this.width);
			//populate
			for (let j=0; j<width; j++) {
				//register new node
				this.nodes[i][j] = new Node(i, j, this.tilesize, NodeTypes.random());
			}
		}
	}

	this.createVisuals = function(){
		for (let i=0; i<length; i++) {
			for (let j=0; j<width; j++) {
				let node = this.nodes[i][j];
				let visual = node.sceneObject;
				let PosX = this.sceneObject.position.x + j * tilesize;
				let PosZ = this.sceneObject.position.z + i * tilesize;
				this.sceneObject.add(visual);
				visual.position.set(PosX, 0, PosZ);
			}
		}
	}

	this.getNode = function(row, col){
		return this.nodes[row][col];
	}

	this.getNeighbors = function(row, col){
		//create simple object holding any node
		let result = { };
		result.up = this.nodes[row-1][col];
		result.down = this.nodes[row+1][col];
		result.left = this.nodes[row][col-1];
		result.right = this.nodes[row][col+1];
		return result;
	}

	this.getNodes = function(){
		return this.nodes;
	}
}

export {NodeTypes, gridGenerator}