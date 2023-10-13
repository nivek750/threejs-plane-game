import * as THREE from 'three';
import createBackground from './modules/background';
import createScene from './modules/scene';

function createMesh(texture, geometry) {
    texture.magFilter = THREE.NearestFilter;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function spawnEnemy(enemyTexture, enemyGeometry, scene) {
    const enemyMesh = createMesh(enemyTexture, enemyGeometry);
    enemyMesh.position.set(0, 10, 0);
    // enemyMesh.rotation.z = Math.PI;
    console.log("spawn enemy");
    scene.add(enemyMesh);
}

const { scene, camera } = createScene();
const textureLoader = new THREE.TextureLoader();

const shipTexture = textureLoader.load('assets/Ships/ship_0000.png');
const bulletTexture = textureLoader.load('assets/Tiles/tile_0000.png');
const enemyTexture = textureLoader.load('assets/Ships/ship_0017.png');
const position = new THREE.Vector3();
const targetPosition = new THREE.Vector3();

//background texture
const backgroundMesh = createBackground(textureLoader);
scene.add(backgroundMesh);

//set renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor('#DFF6F5');
document.body.appendChild( renderer.domElement );

//set geometry and materials
const geometry2 = new THREE.PlaneGeometry();
const planeMesh = createMesh(shipTexture, geometry2);
scene.add(planeMesh);

const bulletGeometry = new THREE.PlaneGeometry();
const bulletMaterial = new THREE.MeshBasicMaterial({ map: bulletTexture, transparent: true });

// enemy plane
const enemyGeometry = new THREE.PlaneGeometry();
const enemyMesh = createMesh(enemyTexture, enemyGeometry);
enemyMesh.position.set(0, 10, 0);
enemyMesh.rotation.z = Math.PI; // rotate the plane to point downwards
scene.add(enemyMesh);

let enemySpeed = 0.05;
let enemyDirection = 1;
let enemyX = 0;

//initialise weapon states
const bulletThreshold = 10;
let lastBulletTime = 0;

//initialise key states
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

    console.log(enemyMesh.position.y);

    // Check for collisions between the player's plane and the enemy plane
    if (planeMesh.position.distanceTo(enemyMesh.position) < 1) {
        scene.remove(planeMesh);
        scene.remove(enemyMesh);
        enemyMesh.position.y = -10;
        // setTimeout(spawnEnemy(enemyTexture, enemyGeometry, scene), 5000);
    }

    // Update the position of the bullet meshes
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.material === bulletMaterial) {
            child.position.y += 0.5;

            // Check if the bullet is out of bounds
            if (child.position.y > bulletThreshold) {
                scene.remove(child);
            }

            if (child.position.distanceTo(enemyMesh.position) < 1) {
                scene.remove(child);
                scene.remove(enemyMesh);
                enemyMesh.position.y = -10;
                // setTimeout(spawnEnemy(enemyTexture, enemyGeometry, scene), 5000);
            }
        }
    });

    // move enemy plane downwards
    enemyMesh.position.y -= enemySpeed;

    // move enemy plane side to side
    if (enemyMesh.position.y < 5) {
        enemyMesh.position.x = enemyX;
        enemyX += enemyDirection * 0.1;
        if (enemyX > 2 || enemyX < -2) {
            enemyDirection = -enemyDirection;
        }
    }

    renderer.render( scene, camera );
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            keys.w = true;
            break;
        case 'a':
        case 'ArrowLeft':
            keys.a = true;
            break;
        case 's':
        case 'ArrowDown':
            keys.s = true;
            break;
        case 'd':
        case 'ArrowRight':
            keys.d = true;
            break;
        case ' ':
            keys.space = true;
            break;
    }

    document.addEventListener('keyup', event => {
        switch (event.key) {
            case 'w':
            case 'ArrowUp':
                keys.w = false;
                break;
            case 'a':
            case 'ArrowLeft':
                keys.a = false;
                break;
            case 's':
            case 'ArrowDown':
                keys.s = false;
                break;
            case 'd':
            case 'ArrowRight':
                keys.d = false;
                break;
            case ' ':
                keys.space = false;
                break;
        }
    });
});

animate();