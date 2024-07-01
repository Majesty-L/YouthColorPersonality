<template>
    <div>
        <div class="table-container">
            <a-table :columns="columns" :data-source="dataSource" :pagination="false" :row-key="record => record.id"
                :loading="loading" :customRow="customRow">
                <template slot="special" slot-scope="text">
                    <img v-if="text" src="@/assets/school/safe.png" alt="">
                </template>
                <template slot="action" slot-scope="text, row">
                    <a-button @click.native.stop="changeStudentInfo(row)">修改</a-button>
                </template>
            </a-table>
        </div>
        <a-modal class="modal" :visible="changeVisible" @ok="handleOk"
            @cancel="handleCancel">
            <div slot="title" class="title">修改档案信息</div>
            <div slot="footer" class="footer">
                <a-button key="back" :loading="loadingDelete" @click="handleDelete">
                    删除档案
                </a-button>
                <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">
                    保存修改
                </a-button>
            </div>
            <a-form-model class="form" layout="horizontal" :model="changeForm">
                <a-form-model-item label="姓名">
                    <a-input v-model="changeForm.name" placeholder="姓名">
                    </a-input>
                </a-form-model-item>
                <a-form-model-item label="年级">
                    <a-select v-model="changeForm.grade" placeholder="年级" :options="gradeList">
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="班级">
                    <a-input v-model="changeForm.classNum" placeholder="班级"></a-input>
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
import _ from 'lodash';
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
                { title: '多点关爱', dataIndex: 'special', key: 'special', scopedSlots: { customRender: 'special' } },
                { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } },
            ],
            loading: false,
            grade_id: this.$route.query.gradeId,
            class_id: this.$route.query.classId,
            changeVisible: false,
            confirmLoading: false,
            changeForm: {},
            gradeList: [
                {key: '1', title: '一年级'},
                {key: '2', title: '二年级'},
                {key: '3', title: '三年级'},
                {key: '4', title: '四年级'},
                {key: '5', title: '五年级'},
                {key: '6', title: '六年级'},
            ],
            editRow: {},
            loadingDelete: false,
            schoolId: this.$static.school_id,
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
        changeStudentInfo(row) {
            this.editRow = row;
            this.changeForm = {
                name: row.name,
                grade: row.grade,
                classNum: row.classNum,
            }
            this.changeVisible = true;
        },
        handleOk() {
            this.confirmLoading = true;
            this.$axios.modifyStudentInfo({...this.changeForm, id: this.editRow.id}).then(() => {
                this.$message.success('修改成功');
                this.initList();
                this.confirmLoading = false;
                this.changeVisible = false;
            }).catch((err) => {
                this.$message.error(err);
                this.confirmLoading = false;
            });
        },
        initList() {
            this.$axios.schoolStudentInfo({schoolId: this.schoolId}).then((res) => {
                const originStudentAll = res;
                const groupStudent = _.map(_.groupBy(originStudentAll, 'grade'), (val, key) => {
                    return {
                    gradeId: key, gradeName: `${key}年级`, children: _.map(_.groupBy(val, 'classNum'), (v, k) => {
                        return {
                        classId: `${key}-${k}`, className: `${k}班级`, children: v,
                        }
                    }),
                    }
                });
                this.archiveList = groupStudent;
                this.$store.commit('updateGroupStudent', this.archiveList);
            });
        },
        handleCancel() {
            this.changeVisible = false;
        },
        handleDelete() {
            this.loadingDelete = true;
            this.$message.success('删除成功');
            this.loadingDelete = false;
            this.changeVisible = false;
        },
    },
}
</script>

<style lang="less" scoped>
.table-container {
    /deep/.ant-table-body {
        background-color: #fff;
    }
}
.modal {
    .title {
        text-align: center;
    }
    .footer {
        display: flex;
        justify-content: center;
        gap: 24px;
    }
    .form {
        /deep/.ant-form-item {
            display: flex;
        }
        /deep/.ant-form-item-label {
            flex: 0 0 125px;
        }
    }
}
</style>