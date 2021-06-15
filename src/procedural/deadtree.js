/*

MIT License

Copyright (c) 2016 Lauri-Matti Parppei

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

DEADTREE 1.1

A dead simple randomly generated tree for Three.js.
Some parameters (such as shrink modifier) are hard-coded but you can
tweak them yourself.

Example:
var material = new THREE.MeshPhongMaterial({ color: 0x555555 });
var tree = deadTree(5, material, 5);
scene.add(tree);

*/

import {
    Object3D,
    Mesh,
    CylinderGeometry,
    MeshPhongMaterial

} from 'three';

import * as Random from './random.js';

function deadTree (size, material, children) {
    var sizeModifier = 0.55;
    var branchPivots = [];

    var tree = createBranch(size, material, children, false, sizeModifier)
    tree.branchPivots = branchPivots;
    return tree;

    // Recursive branch function
    function createBranch (size, material, children, isChild = false, sizeModifier) {
        var branchPivot = new Object3D();
        var branchEnd = new Object3D();

        var length = Math.random() * (size * 10) + size * 15;
        
        if (children == 0) { var endSize = 0; } else { var endSize = size * sizeModifier; }

        var branch = new Mesh(new CylinderGeometry(endSize, size, length, 5, 1, true), material);

        branchPivot.add(branch);
        branch.add(branchEnd);

        branch.position.y = length / 2 ;
        branchEnd.position.y = length / 2 - size* 0.2;
        
        if (isChild) {
            branchPivot.rotation.z += Math.random() * 1.5 - sizeModifier * 1.05;
            branchPivot.rotation.x += Math.random() * 1.5 - sizeModifier * 1.05;
        }

        if (children > 0) {
            for (var c=0; c<children; c++) {
                var child = createBranch(size * sizeModifier, material, children - 1, true, sizeModifier);
                branchEnd.add(child);
            }
        }

        return branchPivot;
    }
}

function randomizedTree(maxChildren){
    if(maxChildren === undefined) {
        maxChildren = 5;
    }

    // randomized tree properties
    let size = Random.randomRange(5, 7.5); // thickness
    let material = new MeshPhongMaterial({ color: Random.randomColor() }); // material
    let children = Random.randomRangeInt(2, maxChildren);  // branches
    let tree = deadTree(size, material, children);

    return tree;
}

export { randomizedTree };
