<template>
    <n-layout-footer class="lg:px-6 pt-4 relative">
        <div class="container">
            <div id="footer-content"></div>
            <div class="py-2.5 text-center lg:flex justify-center items-center gap-3 text-content-02 text-sm lg:text-base leading-relaxed">
                <div>Copyright 2024 © LinkWaveAI. All Rights Reserved</div>
                <div class="text-hex-CCD7EA underline cursor-pointer hover:text-primary" @click="showTermPolicy">Terms of Service & Privacy policy</div>
            </div>
        </div>
        <lazy-term-and-policy />
        <lazy-pricing />
    </n-layout-footer>
</template>
<script setup lang="ts">
import lazyTermAndPolicy from './components/term-and-policy.vue';
import lazyPricing from './components/pricing.vue';

const showWelcomeModal = useState('showWelcomeModal', () => false)
const showTerm = useState('showTerm', () => false)

function showTermPolicy() {
    showTerm.value = true
    showWelcomeModal.value = true
}

</script>