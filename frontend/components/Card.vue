<script setup>
const props = defineProps({
    name: String,
})
</script>
<template>
    <div class="w-96 max-w-sm bg-white border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="flex flex-col items-center py-10">
            <h5 class="mb-1 text-xl font-bold text-gray-900 dark:text-white">{{ props.name }}</h5>
        </div>
    </div>
</template>