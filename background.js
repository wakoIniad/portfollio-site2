import * as THREE from "three";

import * as def from "./define.js";

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

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
// カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
camera.position.set(0, 0, 1000);

// 箱を作成
//const geometry = new THREE.SphereGeometry(500, 30, 5000);
const material = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff,
    metalness: 1,
    roughness: 0.1,
    transmission: 1,  // 透過
    thickness: 10,     // 厚みがあると屈折がわかる
    ior: 0.8,         // 屈折率
    transparent: true
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);
//const geometry2 = new THREE.SphereGeometry(50000, 3000, 500);
//const box2 = new THREE.Mesh(geometry2, material);
//scene.add(box2);

// 平行光源
const light = new THREE.DirectionalLight(0xFFFFFF);
light.intensity = 200; // 光の強さを倍に
light.position.set(1, 1, 1); // ライトの方向
// シーンに追加
scene.add(light);

// レンダリング
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
    ); // ライトの方向
    console.log("aiueo", 
        def.mainBoard.scrollTop,
        3*def.mainBoard.scrollTop / height);
    renderer.render(scene, camera);
})