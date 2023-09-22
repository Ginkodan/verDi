<script setup>
const props = defineProps({
    id: String,
})
//const { data: project, pending, error } = await useFetch(() => `http://localhost:3033/projects/${props.id}`)
</script>

<template>
    <div>
        <p v-if="pending">Fetching...</p>
        <pre v-else-if="error">Could not load project: {{ error.data }}</pre>
        <div v-else>
            <h1 class="text-xl font-bold text-indigo-400">
                {{ project.name }}
            </h1>
            <div class="flex flex-wrap gap-8 pt-6">
                <div v-for="project in projects">
                    <Card :name="project"></Card>
                </div>
            </div>
        </div>
    </div>
</template>
