<template>
    <input
        :class="['input__text', 'input__text--' + customClass]"
        :style="{maxWidth: customWidth}"
        :type="type"
        :name="name"
        :id="name"
        :placeholder="placeholder"
        :label="label"
    >
    <label :for="name" class="input__label">{{ label }}</label>
</template>

<script setup>

const props = defineProps({
    name:
        {
            type: String,
            default: '',
        },
    customClass:
        {
            type: String,
            default: 'default',
        },
    type:
        {
            type: String,
            default: 'text',
        },
    label:
        {
            type: String,
            required: true,
        },
    customWidth:
        {
            type: String,
            default: '',
        },
    placeholder:
        {
            type: String,
            default: 'Placeholder',
        },
});
</script>
<style lang="scss">
.input__text {
    border: none;
    background-color: transparent;
    width: 100%;
    padding: 5px 20px 5px 10px;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px;

    &--default {
        border-bottom: 1px solid #fefefe;
        color: #fefefe;

        &:focus {border-bottom: 1px solid #3657D3;}

        &:focus::placeholder {color: transparent;}
    }
}
</style>
