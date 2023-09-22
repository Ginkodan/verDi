<script setup>
const { data: projects, pending, error } = await useFetch(() => `http://localhost:3033/getAllProjects`)
</script>

<template>
    <div>
        <p v-if="pending">Fetching...</p>
        <pre v-else-if="error">Could not load projects: {{ error.data }}</pre>
        <div v-else>
            <h1 class="text-xl font-bold text-indigo-400">
                Projects
            </h1>
            <div class="flex flex-wrap gap-8 pt-6">
                <div v-for="project in projects">
                    <Card :name="project"></Card>
                </div>
            </div>
        </div>
    </div>
</template>
