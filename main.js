import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor('#77dd77');
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 1, 16, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

const gravity = 0.1;
let velocity = 0;

camera.position.z = 10;

function animate() {
    requestAnimationFrame( animate );

    velocity -= gravity;
    sphere.position.y += velocity;

    if (sphere.position.y < -2) {
        velocity = -velocity * 0.8;
        sphere.position.y = -2;
    }

    renderer.render( scene, camera );
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        velocity = 2;
    }
});

animate();