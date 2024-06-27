<template>
    <div>
        <div class="class-list">
            <div v-for="item in classes" class="class-item" :key="item.classId" @click="routerToClass(item)">{{ item.className }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            grade_id: this.$route.query.gradeId,
        };
    },
    computed: {
        classes() {
            return (this.$store.state.groupStudent || []).find(item => item.gradeId === this.grade_id)?.children;
        },
    },
    created() {
    },
    methods: {
        routerToClass(item) {
            this.$router.push({ path: `/school/archive?gradeId=${this.grade_id}&classId=${item.classId}` });
        },
    },
}
</script>

<style lang="less" scoped>
.class-list {
    display: flex;
    gap: 24px;

    .class-item {
        background-color: azure;
        height: 120px;
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
}
</style>