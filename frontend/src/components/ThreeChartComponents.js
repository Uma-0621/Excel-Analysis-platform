import React, { useEffect } from 'react';
import * as THREE from 'three';
import { getColumnData } from '../utils'; // Import data logic if required

const ThreeChartComponent = () => {
  useEffect(() => {
    const canvas = document.getElementById('threeCanvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });

    // Create points
    const points = [];
    const xData = getColumnData('column1');
    const yData = getColumnData('column2');
    const zData = getColumnData('column3');

    for (let i = 0; i < xData.length; i++) {
      points.push(new THREE.Vector3(xData[i], yData[i], zData[i]));
    }

    geometry.setFromPoints(points);
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    camera.position.z = 5;
    
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }, []);

  return (
    <canvas id="threeCanvas"></canvas>
  );
};

export default ThreeChartComponent;
