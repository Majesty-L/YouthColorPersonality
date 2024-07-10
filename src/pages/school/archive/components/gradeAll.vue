<template>
    <div>
        <div class="class-list">
            <div v-for="item in classes" class="class-item" :key="item.classId" @click="routerToClass(item)">
                <div class="number">
                    {{ item.className }}
                    <!-- <span class="name">{{ item.className?.slice(0, -2) }}</span>
                    <span class="footer">班级</span> -->
                </div>
            </div>
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
        height: 222px;
        width: 274px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: url('@/assets/school/classBg1.png');
        background-size: cover;
        .number {
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            max-width: 200px;
        }
    }
    .class-item:hover {
        background: no-repeat url('@/assets/school/classBg2.png');
        background-size: contain;
    }
}
</style>