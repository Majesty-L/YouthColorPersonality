<template>
    <div>
        <div class="table-container">
            <a-table :columns="columns" :data-source="dataSource" :pagination="false" :row-key="record => record.id"
                :loading="loading" :customRow="customRow">
            </a-table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            columns: [
                { title: '学号', dataIndex: 'classId', key: 'classId' },
                { title: '学籍号', dataIndex: 'cardId', key: 'cardId' },
                { title: '姓名', dataIndex: 'name', key: 'name' },
                { title: '性别', dataIndex: 'sex', key: 'sex' },
                { title: '年龄', dataIndex: 'age', key: 'age' },
                { title: '地区', dataIndex: 'province', key: 'province' },
                { title: '动物形象', dataIndex: 'animal', key: 'animal' },
                { title: '开放度', dataIndex: 'open', key: 'open' },
                { title: '多点关爱', dataIndex: 'special', key: 'special' },
                { title: '操作', dataIndex: 'action', key: 'action' },
            ],
            loading: false,
            grade_id: this.$route.query.gradeId,
            class_id: this.$route.query.classId,
        };
    },
    computed: {
        dataSource() {
            const thisGrade = (this.$store.state.groupStudent || []).find(item => item.gradeId === this.grade_id)?.children || [];
            const thisClass = thisGrade.find(item => item.classId === this.class_id)?.children || [];
            return thisClass;
        },
    },
    created() {
    },
    methods: {
        customRow(record) {
            return {
                style: {
                    cursor: 'pointer',
                },
                on: {
                    click: () => {
                        this.$router.push({ path: `/school/archive?gradeId=${this.grade_id}&classId=${this.class_id}&studentId=${record.id}` });
                    },
                },
            }
        },
    },
}
</script>

<style lang="less" scoped></style>