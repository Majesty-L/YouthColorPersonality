<template>
    <div class="test-container">
        <div class="step">
            <step-part :current="current"></step-part>
        </div>
        <div class="content">
            <type1 v-if="type===1" @changeCur="changeCur"></type1>
        </div>
    </div>
</template>

<script>
import stepPart from './components/stepPart.vue';
import type1 from './modelTests/type1.vue';
export default {
    name: 'TestPage',
    components: {
        stepPart,
        type1,
    },
    data() {
        return {
            current: 0,
            type: this.$route.params.type || 1,
        };
    },
    methods: {
        changeCur(cur) {
            this.current = cur;
        },
    }
}
</script>

<style lang="less" scoped>
.test-container {}
</style>