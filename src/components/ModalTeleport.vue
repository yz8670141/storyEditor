<script setup>
const props = defineProps({ message: String })
const emit = defineEmits(['close'])
</script>

<template>
    <Teleport to="body">
        <!-- 自己加的遮罩 -->
        <div class="modal-backdrop fade show"></div>
        <div class="modal fade show d-block" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">提示</h5>
                        <button @click="emit('close')" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>{{ message }}</p>
                    </div>
                    <div class="modal-footer">
                        <button @click="emit('close')" type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

</template>
