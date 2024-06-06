<template>
    <div>
        <h2>各年级</h2>
        <div class="grade-list">
            <div v-for="item in grades" class="grade-item" :key="item.gradeId" @click="routerToGrade(item)">{{ item.gradeName }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            grades: [],
        };
    },
    created() {
        this.getGrades();
    },
    methods: {
        getGrades() {
            this.grades = [
                { gradeId: 1, gradeName: '一年级' },
                { gradeId: 2, gradeName: '二年级' },
                { gradeId: 3, gradeName: '三年级' },
                { gradeId: 4, gradeName: '四年级' },
                { gradeId: 5, gradeName: '五年级' },
                { gradeId: 6, gradeName: '六年级' },
            ];
        },
        routerToGrade(item) {
            this.$router.push({ path: `/school/archive?gradeId=${item.gradeId}` });
        }
    },
}
</script>

<style lang="less" scoped>
.grade-list {
    display: flex;
    gap: 24px;
    .grade-item {
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