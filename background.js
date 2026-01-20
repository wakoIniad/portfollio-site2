import * as THREE from "three";

const target = document.querySelector("#myCanvas");
const container = document.querySelector("#main-container");
const renderer = new THREE.WebGLRenderer({
  canvas: target, 
  alpha: true 
});

const container_style = getComputedStyle(container);

let { offsetWidth: width, offsetHeight: height } = target;

renderer.setSize(container.offsetWidth, container.offsetHeight);

renderer.setPixelRatio(window.devicePixelRatio || 1);
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 10000);
// カメラの初期座標を設定（X座標:0, Y座標:0, Z座標:0）
camera.position.set(0, 0, 1000);

// 箱を作成
const geometry = new THREE.BoxGeometry(50000, 3000, 500);
const material = new THREE.MeshPhysicalMaterial({
    color: 0x00ffff,
    metalness: 1,
    roughness: 0.1,
    transmission: 1,  // 透過
    thickness: 10,     // 厚みがあると屈折がわかる
    ior: 2,         // 屈折率
    transparent: true
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

// 平行光源
const light = new THREE.DirectionalLight(0xFFFFFF);
light.intensity = 200; // 光の強さを倍に
light.position.set(1, 1, 1); // ライトの方向
// シーンに追加
scene.add(light);

// レンダリング
renderer.render(scene, camera);
window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
});


let i = 0;
container.addEventListener('scroll', () => {
    i = container.scrollTop
    light.position.set(
        1, 
        1 - 3*container.scrollTop / container.offsetHeight,
        1
    ); // ライトの方向
    console.log("aiueo", 
        container.scrollTop,
        3*container.scrollTop / container.offsetHeight);
    renderer.render(scene, camera);
})