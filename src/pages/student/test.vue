<template>
    <div class="test-container">
        <div class="step">
            <headerPart v-if="current === 99" :type="2" @getStudentInfo="getStudentInfo"></headerPart>
            <step-part v-else :current="current" @back="back"></step-part>
        </div>
        <div class="content">
            <type1 v-if="type===1" :step="current" @changeCur="changeCur"></type1>
        </div>
    </div>
</template>

<script>
import headerPart from './components/headerPart.vue';
import stepPart from './components/stepPart.vue';
import type1 from './modelTests/type1.vue';
export default {
    name: 'TestPage',
    components: {
        headerPart,
        stepPart,
        type1,
    },
    data() {
        return {
            current: 99,
            type: this.$route.params.type || 1,
            studentInfo: {},
        };
    },
    methods: {
        changeCur([cur, params]) {
            this.current = cur;
            if (cur === 99) {
                this.result(params);
            }
        },
        result(params) {
            console.log(params, this.studentInfo)
            // const finalParams = {
            //     studentId: this.studentInfo.id,
            //     ...params,
            // }
            // this.$axios.studentCommit()
        },
        getStudentInfo(info) {
            this.studentInfo = info;
            if (info.type != '小学生') {
                this.addPinyin = (val) => val;
            }
        },
        back() {
            if (this.current === 99 || !this.current) {
                this.$router.push({name: 'studentIndex'});
            } else {
                this.current--;
            }
        },
    }
}
</script>

<style lang="less" scoped>
.test-container {
}
</style>