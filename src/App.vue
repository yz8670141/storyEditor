<script setup>
import { RouterView,useRoute  } from 'vue-router'
const route = useRoute ()
</script>

<template>
  <div>
   <RouterView v-slot="{ Component }">
      <KeepAlive include="PageEditor">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>  
  </div>
</template>



<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
body {
  font-family: $font-main;
  width: 100%;
  padding: 1rem;
  background-color: $color-light;
}
</style>
