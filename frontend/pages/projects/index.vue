<script setup>
const { data: projects, pending, error } = await useFetch(() => `http://localhost:3033/getProjectsFromVercel`)

const modal = ref(false)
const project = ref(null)

const onSave = async (projectId) => {
    await fetch(`http://localhost:3033/addNewProject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectId: projectId
        })
    })
    modal.value = false
    project.value = null
}

</script>


<template>
    <div>
        <h1 class="text-xl font-bold text-indigo-400">
            Projects
        </h1>
        <div class="mt-4">
            <button type="button" @click="modal = true"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add
                project</button>
        </div>


        <!-- Main modal -->
        <div id="defaultModal" tabindex="-1" aria-hidden="true" v-if="modal"
            class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
            <div class="relative w-full max-w-2xl max-h-full">
                <!-- Modal content -->
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <!-- Modal header -->
                    <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Select a project
                        </h3>
                        <button type="button" @click="modal = false; project = null"
                            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="defaultModal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <div class="p-6 space-y-6">
                        <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Select a project to add to your dashboard.
                        </p>

                        <fieldset>
                            <legend class="sr-only">Vercel Projects:</legend>
                            <div v-for="proj in projects" :key="proj.id" class="flex items-center mb-4">
                                <input type="radio" name="projects" :value="proj.id" :id="proj.id" v-model="project"
                                    class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600">
                                <label for="proj.id"
                                    class="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                    {{ proj.name }}
                                </label>
                            </div>
                        </fieldset>

                    </div>
                    <!-- Modal footer -->
                    <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button data-modal-hide="defaultModal" type="button" @click="onSave(project)"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Add</button>
                        <button data-modal-hide="defaultModal" type="button" @click="modal = false; project = null"
                            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>