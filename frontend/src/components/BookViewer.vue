<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { createCanvasTextureFromPage } from '@/composables/useCanvasTexture'
import { getAllPagesFromDB } from '@/utils/imageDB'
const container = ref()
let scene, camera, renderer
let leftMesh, rightMesh, flipMesh
const currentIndex = ref(0)
let isFlipping = false
const pages = ref([])
const isLastPage = computed(() => {
    if (!pages.value) return
    return currentIndex.value >= pages.value.length - 2
})
const isFirstPage = computed(() => {
    return currentIndex.value === 0
})


watchEffect(async () => {
    const result = await getPages()
    pages.value = result
    if (pages.valu == undefined) return
    if (pages.value.length > 0) {
        await renderSpread() 
    }
})

let isDragging = false, startX = 0
async function getPages() {
    const coverStorage = localStorage.getItem('storybook-cover')
    const coverID = coverStorage !== null ? Number(coverStorage) : null
    const allPagesFromDB = await getAllPagesFromDB()

    const coverFront = allPagesFromDB.find(p => p.id === coverID)
    let all = []
    if (coverFront) {
        all = [coverFront, ...allPagesFromDB.filter(p => p.id !== coverID)]

    } else {
        all = [...allPagesFromDB]
    }

    all.push({
        id: 'blank-left',
        json: { version: '5.5.2', objects: [], background: '#fff' },
        image: null
    })
    //}
    pages.value = all

}

async function createPageMesh(pageData, offsetX=0) {
    const tex = await createCanvasTextureFromPage(pageData)
    const mat = new THREE.MeshPhongMaterial({
        map: tex,
        side: THREE.DoubleSide,
        transparent: true
    })
    const geo = new THREE.PlaneGeometry(2, 3)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.x = offsetX * 0.95
    return mesh
}

async function renderSpread(prev) {
    if (!pages.value) return

    if (leftMesh) scene.remove(leftMesh)

    //  封面：顯示右頁在書本正中間
    if (currentIndex.value === 0 && prev === 'prev') {
        leftMesh = await createPageMesh(pages.value[0], -1.05)
        scene.add(leftMesh)
        if (rightMesh) scene.remove(rightMesh)
        return
    } else if (currentIndex.value === 0) {
        rightMesh = await createPageMesh(pages.value[0], -1.05)
        scene.add(rightMesh)
        return
    }
    //  最後一頁是封底：顯示左頁在書本正中間
    const isLastPage = currentIndex.value + 1 >= pages.value.length - 2
    if (isLastPage) {
        leftMesh = await createPageMesh(pages.value[currentIndex.value], -1.05)
        if (pages.value[currentIndex.value + 1]) {
            rightMesh = await createPageMesh(pages.value[currentIndex.value + 1], 1.05)
            scene.add(rightMesh)
        }
        scene.add(leftMesh)
        return
    }
    //  一般情況：顯示左右兩頁
    const left = pages.value[currentIndex.value]
    const right = pages.value[currentIndex.value + 1]
    if (left) {
        leftMesh = await createPageMesh(left, -1.05)
        scene.add(leftMesh)
    }

    if (right) {
        rightMesh = await createPageMesh(right, 1.05)
        scene.add(rightMesh)
    }
}

async function animateFlip(direction) {
    if (isFlipping || !pages.value) return
    isFlipping = true
    const isNext = direction
    const isCoverFlipping = currentIndex.value === 0 && isNext
    const isCoverReturning = currentIndex.value === 1 && !isNext
    const offset = isCoverFlipping ? 1 : isCoverReturning ? -1 : isNext ? 2 : -2
    const targetIndex = currentIndex.value + offset
    if (targetIndex < 1 || targetIndex >= pages.value.length) {
        isFlipping = false
        return
    }

    // 1️⃣ 預載左右頁（提前建立好，不放進場景中）
    const [targetLeftPage, targetRightPage] = [
        pages.value[targetIndex],
        pages.value[targetIndex + 1]
    ]
    const [targetLeftMesh, targetRightMesh] = await Promise.all([
        createPageMesh(targetLeftPage, -1.05),
        targetRightPage ? createPageMesh(targetRightPage, 1.05) : null
    ])


    // 翻頁的 flipMesh 準備
    const flipPage = isNext
        ? isCoverFlipping
            ? pages.value[1]
            : pages.value[currentIndex.value + 2]
        : isCoverReturning
            ? pages.value[0]
            : pages.value[currentIndex.value - 2] || pages.value[0]
    const tex = await createCanvasTextureFromPage(flipPage)
    tex.flipY = false
    tex.center.set(0.5, 0.5)
    tex.rotation = Math.PI
    const mat = new THREE.MeshPhongMaterial({
        map: tex,
        side: THREE.DoubleSide,
        transparent: true
    })

    const geo = new THREE.PlaneGeometry(2, 3, 50, 1)
    geo.translate(1, 0, 0)

    flipMesh = new THREE.Mesh(geo, mat)
    flipMesh.position.set(0, 0, 0.02)
    flipMesh.rotation.y = isNext ? 0 : -Math.PI
    scene.add(flipMesh)

    let addedTargetPages = false

    gsap.to(flipMesh.rotation, {
        y: isNext ? -Math.PI : 0,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
            if (!flipMesh) return
            const time = flipMesh.rotation.y / -Math.PI

            const posAttr = flipMesh.geometry.attributes.position
            for (let i = 0; i < posAttr.count; i++) {
                const x = posAttr.getX(i)
                const wave = Math.sin((x + 1) * Math.PI * 1.25) * 0.035 * Math.sin(time * Math.PI)
                posAttr.setZ(i, wave)
            }
            posAttr.needsUpdate = true

            if (!addedTargetPages && time > 0.4) {
                if (targetLeftMesh) scene.add(targetLeftMesh)
                if (targetRightMesh) scene.add(targetRightMesh)
                addedTargetPages = true
            }
        },
        onComplete: async () => {
            if (leftMesh) scene.remove(leftMesh)
            if (rightMesh) scene.remove(rightMesh)
            scene.remove(flipMesh)
            flipMesh = null
            leftMesh = targetLeftMesh
            rightMesh = targetRightMesh
            currentIndex.value += offset
            isFlipping = false
        }
    })
}

function flipNext() {
    animateFlip(true)
}

function flipPrev() {
    if (currentIndex.value === 1) {
        currentIndex.value = 0
    }
    animateFlip(false)
}

function onMouseDown(e) { isDragging = true; startX = e.clientX }
function onMouseMove(e) {
    if (!isDragging || isFlipping) return
    const delta = e.clientX - startX
    if (delta < -80) {
        isDragging = false;
        flipNext()
    }
    if (delta > 80) {
        isDragging = false; flipPrev()
    }

}


function onMouseUp() { isDragging = false }

onMounted(async () => {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 5
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0xffffff, 1)
    container.value.appendChild(renderer.domElement)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 1, 2)
    scene.add(light)

    const backLight = new THREE.DirectionalLight(0x444444, 0.4)
    backLight.position.set(0, -1, -2)
    scene.add(backLight)

    const ambient = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambient)

    await getPages()
    await renderSpread()
    animate()
})

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}


</script>

<template>
    <div ref="container" class="book-container" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp">
        <button class="nav left" @click="flipPrev" v-show="!isFirstPage">← 上一頁</button>
        <button class="nav right" @click="flipNext" v-show="!isLastPage">下一頁 →</button>
    </div>
</template>
<style lang="scss" scoped>
.book-container {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;

    .nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: $color-dark;
        color: $color-white;
        padding: 8px 16px;
        border: none;
        cursor: pointer;
        z-index: 2;

        &.left {
            left: 10px;
        }

        &.right {
            right: 10px;
        }
    }
}
</style>
