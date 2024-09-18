// src/main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2c3e50); // Dark background for contrast

// Camera Setup
const camera = new THREE.PerspectiveCamera(
    45, // Field of View
    window.innerWidth / window.innerHeight, // Aspect Ratio
    1, // Near Clipping Plane
    1000 // Far Clipping Plane
);
camera.position.set(50, 100, 100); // Positioned above and slightly tilted
camera.lookAt(0, 0, 0); // Look at the center of the scene

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
document.body.appendChild(renderer.domElement);

// OrbitControls Setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // Set the target to the center
controls.enableDamping = true; // Enable smooth damping
controls.dampingFactor = 0.05; // Damping inertia

// Lighting Setup
const ambientLight = new THREE.AmbientLight(0xaaaaaa); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Strong directional light
directionalLight.position.set(100, 100, 100); // Position the light
directionalLight.castShadow = true; // Enable shadows from this light
scene.add(directionalLight);

// Mahjong Tile Parameters
const tileWidth = 5;
const tileHeight = 0.5;
const tileDepth = 7;
const cornerRadius = 0.5; // Radius for rounded corners

// Function to Create a Mahjong Tile
function createTile(glyphImagePath) {
    // Create RoundedBoxGeometry
    const geometry = new RoundedBoxGeometry(tileWidth, tileHeight, tileDepth, 16, cornerRadius);

    // Create Material for Side and Bottom Faces (Ivory Color)
    const sideMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFF0 }); // Ivory color

    // Load Glyph Texture for Top Face
    const textureLoader = new THREE.TextureLoader();
    const glyphTexture = textureLoader.load(glyphImagePath);
    glyphTexture.encoding = THREE.sRGBEncoding; // Correct color encoding

    const topMaterial = new THREE.MeshPhongMaterial({ map: glyphTexture });

    // Define Materials Array: [px, nx, py, ny, pz, nz]
    // py (index 2) is the top face
    const materials = [
        sideMaterial, // Positive X
        sideMaterial, // Negative X
        topMaterial,  // Positive Y (Top)
        sideMaterial, // Negative Y (Bottom)
        sideMaterial, // Positive Z
        sideMaterial  // Negative Z
    ];

    // Create Mesh with RoundedBoxGeometry and Materials
    const tile = new THREE.Mesh(geometry, materials);
    tile.castShadow = true; // Enable casting shadows
    tile.receiveShadow = true; // Enable receiving shadows
    return tile;
}

// Sample Mahjong Tiles with Corresponding Glyph Images
const tileData = [
    { glyph: '/textures/bamboo1.png' },
    { glyph: '/textures/bamboo2.png' },
    { glyph: '/textures/bamboo3.png' },
    { glyph: '/textures/character1.png' },
    { glyph: '/textures/circle1.png' },
    { glyph: '/textures/windEast.png' },
    { glyph: '/textures/dragonRed.png' },
    { glyph: '/textures/flower1.png' },
    // Add more tiles as needed
];

// Arrange Tiles in a Turtle Layout (Grid)
const rows = 4;
const cols = 8;
const spacingX = tileWidth + 1; // Horizontal spacing
const spacingZ = tileDepth + 1; // Depth spacing

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const tileIndex = (i * cols + j) % tileData.length;
        const tileInfo = tileData[tileIndex];
        const tile = createTile(tileInfo.glyph);
        tile.position.x = (j - cols / 2) * spacingX;
        tile.position.y = 0; // Flat on the ground
        tile.position.z = (i - rows / 2) * spacingZ;
        scene.add(tile);
    }
}

// Handle Window Resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls for damping
    renderer.render(scene, camera);
}
animate();
