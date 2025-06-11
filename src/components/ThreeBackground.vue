<template>
  <canvas ref="canvas" class="three-canvas"></canvas>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
const canvas = ref(null)
let animationId = null
let camera, renderer

onMounted(() => {
  const scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000)
  camera.position.z = 800

  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  const textureLoader = new THREE.TextureLoader()
  const imageTexture = textureLoader.load('photo-thumb.png') // ← 將此路徑設為你的相片圖路徑

  const geometry = new THREE.PlaneGeometry(120, 120)
  const material = new THREE.MeshBasicMaterial({ map: imageTexture, transparent: true, side: THREE.DoubleSide })

  const photoGroup = new THREE.Group()
  scene.add(photoGroup)

  for (let i = 0; i < 30; i++) {
    const photo = new THREE.Mesh(geometry, material.clone())
    photo.position.set(
      THREE.MathUtils.randFloatSpread(1600),
      THREE.MathUtils.randFloatSpread(900),
      THREE.MathUtils.randFloatSpread(1000)
    )
    photo.rotation.set(
      THREE.MathUtils.degToRad(Math.random() * 360),
      THREE.MathUtils.degToRad(Math.random() * 360),
      THREE.MathUtils.degToRad(Math.random() * 360)
    )
    const scale = THREE.MathUtils.randFloat(0.6, 1.2)
    photo.scale.set(scale, scale, scale)
    photoGroup.add(photo)
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    photoGroup.rotation.y += 0.0003
    renderer.render(scene, camera)
  }

  animate()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
})
const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
</script>

<style lang="scss" scoped>
.three-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: $z-index-background;
  width: 100vw;
  height: 100vh;
}
</style>
