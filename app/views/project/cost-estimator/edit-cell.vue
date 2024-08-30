<template>
    <div @click="handleOnClick" class="leading-normal">
        <template v-if="isEdit">
            <div>
                <n-input-number
                    v-if="inputType === 'number'"
                    ref="inputRef"
                    v-model:value="inputValue"
                    :type="inputType"
                    @update:value="handleChange"
                />
                <n-input
                    v-if="inputType !== 'number'"
                    ref="inputRef"
                    v-model:value="inputValue"
                    :type="inputType"
                    @update:value="handleChange"
                />
            </div>
        </template>
        <span v-if="!isEdit">{{ inputType === 'number' ? parsePrice(inputValue) : inputValue || '__'}}</span>
    </div>
    <!-- <div v-if="showAddButton" class="hidden group-hover:block absolute top-full z-9">
        <n-button type="primary" @click="onAdd">
            <i class="i-custom-add text-2xl leading-0 mr-2"></i>
            Add row after
        </n-button>
    </div> -->
</template>

<script setup lang="ts">

// const props = defineProps({
//     value: [String, Number],
//     onUpdateValue: [Function, Array],
//     editAble: [Boolean]
// })

const props = withDefaults(
    defineProps<{
        value: string | number | null
        onUpdateValue: Function
        onAdd?: Function
        editAble: boolean
        showAddButton?: boolean
        inputType?: string
    }>(),
    {
        value: '',
        onUpdateValue: () => {},
        onAdd: () => {},
        editAble: false,
        showAddButton: false,
        inputType: 'text'
    }
)

const { editAble } = toRefs(props)

const isEdit = ref(false)
const inputRef = ref(null)
const inputValue = ref(props.value)
function handleOnClick() {
    if( !editAble.value ) {
        return
    }
    isEdit.value = true
    nextTick(() => {
        inputRef.value.focus()
    })
}
function handleChange() {
    props.onUpdateValue(inputValue.value)
    // isEdit.value = false
}

watch(() => props.editAble, (newVal) => {
    if( !newVal ) {
        isEdit.value = false
    }
})
</script>

<style scoped>

</style>