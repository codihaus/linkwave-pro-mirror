<template>
    <div v-for="message in messages" class="flex gap-3 lg:gap-6 mb-8">
        <n-avatar
            round
            :src="message?.user?.avatar"
            class="w-8 h-8 lg:w-12 lg:h-12 flex-shrink-0"
        >
            <template v-if="!message?.user?.avatar">
                {{ currentUser?.first_name?.at(0) || '' }}{{ currentUser?.last_name?.at(0) || '' }}
            </template>
        </n-avatar>
        <div v-if="message?.type === 'loading'">
            <div class="loader"></div>
        </div>
        <div v-else class="max-w-[calc(100%-48px)] lg:max-w-[calc(100%-72px)] bg-dark-01 rounded-lg p-4" :class="message?.user?.type === 'user' ? 'bg-opacity-60' : 'bg-opacity-30'">
            <div v-if="!message?.image" class="text-lg leading-title content-block">
                <div v-if="message?.type !== 'analyzing'" v-html="renderMessage(message)"></div>
                <div v-else>
                    <span class="text-primary">{{ message?.content }}</span> is analyzing by LinkWaveAI
                    <n-progress
                        type="line"
                        :percentage="70"
                        :show-indicator="false"
                        processing
                        color="#14E3AE"
                        :height="6"
                        class="my-2 max-w-33"
                    />
                    <div></div>
                    <n-skeleton text round height="6" class="text-sm" style="width: 60%; --n-color-start: #323C61; --n-color-end: #16203E;"/>
                    <div></div>
                    <n-skeleton text round height="6" class="text-sm" style="width: 40%; --n-color-start: #323C61; --n-color-end: #16203E;"/>  
                </div>

            </div>
            <div v-else>
                <a :href="message?.image" target="_blank" download="floor_plan">
                    <img :src="message?.image" class="max-w-75"/>
                </a>
            </div>
            <div v-if="message?.annotations?.length" class="mt-2 pt-2 border-t border-solid border-dark-04 text-content-02">
                <div>Reference</div>
                <div v-for="annotation, index in message?.annotations" class="mt-1 flex items-center">
                    <span class="text-primary">({{ index+1 }})</span>
                    <span class="inline-block w-1.5 h-1.5 bg-primary rounded-full mx-1"></span>
                    {{ annotation?.name }}
                </div>
            </div>
            <attachment :items="message?.attachments" class="mt-2.5" />
            <div v-if="message?.user?.has_suggestion" class="mt-2.5">
                <div class="text-content-02">Some suggestion for you</div>
                <div class="flex gap-2.5 flex-wrap mt-2.5">
                    <n-button
                        v-for="btn in suggestions"
                        ghost
                        round
                        type="primary"
                        size="large"
                        :disabled="btn?.disabled"
                        @click="btn?.action"
                        class="btn-suggestion"
                    >{{ btn?.label }}</n-button>
                </div>
            </div>
            <div v-if="message?.askUpload" class="flex gap-2 mt-6 pt-6 border-t border-solid border-dark-04">
                <n-button type="primary" size="large" @click="emit('action-upload', true)">
                    <i class="i-custom-upload text-2xl mr-2"></i>
                    Upload
                </n-button>
                <n-button size="large" type="primary" ghost @click="emit('action-upload', false)">No</n-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import attachment from './attachment.vue'
import markdownit from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.min.css'

withDefaults(
    defineProps<{
        messages: any
        suggestions: any
    }>(),
    {
        messages: () => [],
        suggestions: () => [],
    }
)

const emit = defineEmits(['action-upload'])

const currentUser = useState('currentUser')

const md = markdownit({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
        try {
            return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
        }

        return ''; // use external default escaping
    }
});

function renderMessage(messgage) {
    return md.render(messgage?.content || '')
}
</script>

<style lang="scss">

</style>