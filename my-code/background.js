/**
 * 参考:
 * 「Three.js入門 手軽にWebGLを扱える3Dライブラリ」
 * https://ics.media/entry/14771/
 */

import * as THREE from "three";
import * as def from "./define.js";

/*
const renderer = new THREE.WebGLRenderer({
  canvas: def.mainBackgroundCanvas, 
  alpha: true 
});

const container_style = getComputedStyle(def.mainBoard);

let width, height;
const updateContainerSize = () => ({ offsetWidth: width, offsetHeight: height } = def.mainBoard);
updateContainerSize();
renderer.setSize(width, height);

renderer.setPixelRatio(window.devicePixelRatio || 1);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
camera.position.set(0, 0, 1000);

const geometry = new THREE.SphereGeometry(500, 30, 5000);
const material = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff,
    metalness: 1,
    roughness: 0.1,
    transmission: 1,  
    thickness: 10,     
    ior: 0.8,         
    transparent: true
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);
//const geometry2 = new THREE.SphereGeometry(50000, 3000, 500);
//const box2 = new THREE.Mesh(geometry2, material);
//scene.add(box2);

const light = new THREE.DirectionalLight(0xFFFFFF);
light.intensity = 200; 
light.position.set(1, 1, 1); 

scene.add(light);

//const composer = new THREE.EffectComposer(renderer);
//const renderPass = new THREE.RenderPass(scene, camera);
//composer.addPass(renderPass);
//
//const godraysPass = new THREE.ShaderPass(THREE.GodRaysShader);
//godraysPass.renderToScreen = true;
//composer.addPass(godraysPass);


renderer.render(scene, camera);
window.addEventListener('resize', () => {
    updateContainerSize();
    camera.aspect = width / height;
    renderer.setSize(width, height);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
});


let i = 0;
def.mainBoard.addEventListener('scroll', () => {
    updateContainerSize();

    i = def.mainBoard.scrollTop
    light.position.set(
        1, 
        1 - 3*def.mainBoard.scrollTop / height,
        1
    ); 
    console.log("aiueo", 
        def.mainBoard.scrollTop,
        3*def.mainBoard.scrollTop / height);
    renderer.render(scene, camera);
})*/