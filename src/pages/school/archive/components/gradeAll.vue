<template>
    <div>
        <h2>各班级</h2>
        <div class="class-list">
            <div v-for="item in classes" class="class-item" :key="item.classId" @click="routerToClass(item)">{{ item.className }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            classes: [],
            grade_id: this.$route.query.gradeId,
        };
    },
    created() {
        this.getclasss();
    },
    methods: {
        getclasss() {
            this.classes = [
                { classId: 1, className: '一班' },
                { classId: 2, className: '二班' },
                { classId: 3, className: '三班' },
                { classId: 4, className: '四班' },
            ];
        },
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