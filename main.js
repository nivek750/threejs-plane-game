import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load('assets/Ships/ship_0000.png');
const position = new THREE.Vector3();
const targetPosition = new THREE.Vector3();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor('#77dd77');
document.body.appendChild( renderer.domElement );

const geometry2 = new THREE.PlaneGeometry();
texture.magFilter = THREE.NearestFilter;
const material2 = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
const planeMesh = new THREE.Mesh(geometry2, material2);
scene.add(planeMesh);

const gravity = 0.1;
let velocity = 0;

const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

camera.position.z = 10;

function animate() {
    requestAnimationFrame( animate );

    if(keys.w) {
        targetPosition.y += 0.2;
    }

    if(keys.a) {
        targetPosition.x -= 0.2;
    }

    if(keys.s) {
        targetPosition.y -= 0.2;
    }

    if(keys.d) {
        targetPosition.x += 0.2;
    }

    // Lerp the position towards the target position
    position.lerp(targetPosition, 0.1);

    // Update the plane's position
    planeMesh.position.copy( position );

    renderer.render( scene, camera );
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'w':
            // targetPosition.y += 0.2;
            keys.w = true;
            break;
        case 'a':
            // targetPosition.x -= 0.2;
            keys.a = true;
            break;
        case 's':
            // targetPosition.y -= 0.2;
            keys.s = true;
            break;
        case 'd':
            // targetPosition.x += 0.2;
            keys.d = true;
            break;
    }

    document.addEventListener('keyup', event => {
        switch (event.key) {
            case 'w':
                keys.w = false;
                break;
            case 'a':
                keys.a = false;
                break;
            case 's':
                keys.s = false;
                break;
            case 'd':
                keys.d = false;
                break;
        }
    });
});

animate();