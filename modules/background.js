import * as THREE from 'three';

export default function createBackground(textureLoader) {
  const backgroundTexture = textureLoader.load('assets/Backgrounds/island.png');
  backgroundTexture.magFilter = THREE.NearestFilter;
  const material = new THREE.MeshBasicMaterial({ map: backgroundTexture, transparent: true });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), material);
  mesh.position.y = THREE.MathUtils.randFloat(10, 15);
  mesh.position.x = THREE.MathUtils.randFloat(-5, 5);

  return mesh;
}