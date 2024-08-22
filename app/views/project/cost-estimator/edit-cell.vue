<template>
    <div @click="handleOnClick">
        <n-input
            v-if="isEdit"
            ref="inputRef"
            v-model:value="inputValue"
            type="number"
            @update:value="inputValue = $event"
            @change="handleChange"
        />
        <span v-else>{{ parsePrice(inputValue)}}</span>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    value: [String, Number],
    onUpdateValue: [Function, Array]
})

const isEdit = ref(false)
const inputRef = ref(null)
const inputValue = ref(props.value)
function handleOnClick() {
    isEdit.value = true
    nextTick(() => {
        inputRef.value.focus()
    })
}
function handleChange() {
    props.onUpdateValue(inputValue.value)
    isEdit.value = false
}
</script>

<style scoped>

</style>