<template>
    <div>
        <h2>学生列表</h2>
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
                { title: '学号', dataIndex: 'id', key: 'id' },
                { title: '学籍号', dataIndex: 'idCard', key: 'idCard' },
                { title: '姓名', dataIndex: 'name', key: 'name' },
                { title: '性别', dataIndex: 'sex', key: 'sex' },
                { title: '年龄', dataIndex: 'age', key: 'age' },
                { title: '地区', dataIndex: 'position', key: 'position' },
                { title: '动物形象', dataIndex: 'animal', key: 'animal' },
                { title: '开放度', dataIndex: 'open', key: 'open' },
                { title: '多点关爱', dataIndex: 'special', key: 'special' },
                { title: '操作', dataIndex: 'action', key: 'action' },
            ],
            dataSource: [],
            loading: false,
            grade_id: this.$route.query.gradeId,
            class_id: this.$route.query.classId,
        };
    },
    created() {
        this.getStudentsInfo();
    },
    methods: {
        getStudentsInfo() {
            this.loading = true;
            this.dataSource = [
                { id: 1, idCard: 'G43024120001010171X', name: '李华', sex: '男', age: 18, classId: 1 },
                { id: 2, idCard: 'G43024120001010171X', name: '李华', sex: '男', age: 18, classId: 1 },
                { id: 3, idCard: 'G43024120001010171X', name: '李华', sex: '男', age: 18, classId: 1 },
            ];
            this.loading = false;
        },
        customRow(record) {
            return {
                style: {
                    cursor: 'pointer',
                },
                on: {
                    click: () => {
                        this.$router.push({ path: `/school/archive?gradeId=${this.grade_id}&classId=${this.class_id}&studentName=${record.name}` });
                    },
                },
            }
        },
    },
}
</script>

<style lang="less" scoped></style>