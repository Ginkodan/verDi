<script setup>


const route = useRoute()

const { data: project, pending, error } = await useFetch(() => `http://localhost:3033/getProjectById/?id=${route.params.id}`)
</script>

<template>
    <div>
        <p v-if="pending">Fetching...</p>
        <pre v-else-if="error">Could not load project: {{ error.data }}</pre>
        <div v-else>
            <h1 class="text-xl font-bold text-indigo-400">
                {{ project.name }}
            </h1>
        </div>
    </div>
</template>
