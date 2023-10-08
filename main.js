import * as THREE from 'three';
import createBackground from './modules/background';
import createScene from './modules/scene';

const { scene, camera } = createScene();
const textureLoader = new THREE.TextureLoader();

const shipTexture = textureLoader.load('assets/Ships/ship_0000.png');
const bulletTexture = textureLoader.load('assets/Tiles/tile_0000.png');
const position = new THREE.Vector3();
const targetPosition = new THREE.Vector3();

//background texture
const backgroundMesh = createBackground(textureLoader);
scene.add(backgroundMesh);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor('#DFF6F5');
document.body.appendChild( renderer.domElement );

const geometry2 = new THREE.PlaneGeometry();
shipTexture.magFilter = THREE.NearestFilter;
const material2 = new THREE.MeshBasicMaterial({ map: shipTexture, transparent: true });
const planeMesh = new THREE.Mesh(geometry2, material2);
scene.add(planeMesh);

const bulletGeometry = new THREE.PlaneGeometry();
const bulletMaterial = new THREE.MeshBasicMaterial({ map: bulletTexture, transparent: true });

const bulletThreshold = 10;
let lastBulletTime = 0;

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
};

camera.position.z = 10;

function animate() {
    requestAnimationFrame( animate );
    const currentTime = Date.now();

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

    // Clamp the target position to the bounds of the screen
    targetPosition.x = THREE.MathUtils.clamp(targetPosition.x, -10, 10);
    targetPosition.y = THREE.MathUtils.clamp(targetPosition.y, -5, 5);

    backgroundMesh.position.y -= 0.02;

    // Check if the background mesh is out of bounds
    if (backgroundMesh.position.y < -10) {
        backgroundMesh.position.y = THREE.MathUtils.randFloat(10, 15);
        // Give background a random x position in between -5 and 5
        backgroundMesh.position.x = THREE.MathUtils.randFloat(-5, 5);
    }

    if(keys.space && currentTime - lastBulletTime > 200) {
        const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
        bulletMesh.position.copy(planeMesh.position);
        bulletMesh.position.y += 0.5;
        scene.add(bulletMesh);
        lastBulletTime = currentTime;
    }

    // Lerp the position towards the target position
    position.lerp(targetPosition, 0.1);

    // Update the plane's position
    planeMesh.position.copy( position );

    // Update the position of the bullet meshes
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.material === bulletMaterial) {
            child.position.y += 0.5;

            // Check if the bullet is out of bounds
            if (child.position.y > bulletThreshold) {
                scene.remove(child);
            }
        }
    });

    renderer.render( scene, camera );
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'w':
            keys.w = true;
            break;
        case 'a':
            keys.a = true;
            break;
        case 's':
            keys.s = true;
            break;
        case 'd':
            keys.d = true;
            break;
        case ' ':
            keys.space = true;
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
            case ' ':
                keys.space = false;
                break;
        }
    });
});

animate();