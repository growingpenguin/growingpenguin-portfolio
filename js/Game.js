document.addEventListener('DOMContentLoaded', () => {
  console.log("Game.js is running"); // Debug log

  // Basic Three.js setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-cube'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create cube
  const geometry = new THREE.BoxGeometry();
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff5555 }), // Python
    new THREE.MeshBasicMaterial({ color: 0xffcc00 }), // PyTorch
    new THREE.MeshBasicMaterial({ color: 0x3399ff }), // Pandas
    new THREE.MeshBasicMaterial({ color: 0x00cc99 }), // AWS
    new THREE.MeshBasicMaterial({ color: 0x9966ff }), // HTML/CSS
    new THREE.MeshBasicMaterial({ color: 0xff66cc })  // JavaScript
  ];
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  camera.position.z = 3;

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  // Responsive
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
