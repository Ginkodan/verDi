<script setup>

const { data: settings, pending, error } = useFetch('http://localhost:3033/getSettings')

const vercelAPI = ref('')
const discordWebhook = ref(settings.discordWebhook)

watch(() => settings.value, (newSettings) => {
    if (newSettings) {
        vercelAPI.value = newSettings.vercelAPI;
        discordWebhook.value = newSettings.discordWebhook;
    }
}, { immediate: true });

const saveSettings = async () => {
    useFetch('http://localhost:3033/updateSettings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            vercelAPI: vercelAPI.value,
            discordWebhook: discordWebhook.value
        })
    })
}
</script>


<template>
    <div class="container flex flex-col items-center">
        <div class="w-full max-w-lg">
            <h1 class="mb-8 text-lg font-bold text-indigo-400">Settings</h1>
            <div v-if="pending">
                <span>Loading...</span>
            </div>
            <div v-else class=" border rounded-lg border-indigo-400 p-8">
                <div class="mb-6">
                    <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vercel API
                        key</label>
                    <input type="text" id="base-input" v-model="vercelAPI" placeholder="Vercel API key"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div class="mb-6">
                    <label for="base-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Discord
                        Webhook
                        URL</label>
                    <input type="text" id="base-input" v-model="discordWebhook" placeholder="Discord Webhook URL"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <button @click="saveSettings"
                    class="bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
            </div>
        </div>
    </div>
</template>