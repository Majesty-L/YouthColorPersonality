<template>
    <div>
        <div class="empty" v-if="!grades.length">
            <img src="@/assets/school/noArchive.png" alt="">
            <p class="">档案库是空的！</p>
            <p class="">请上传学生信息，设置初始数据</p>
            <a-button class="btn-school" @click="importStudentList">上传学生信息</a-button>
        </div>
        <div v-else class="grade-list">
            <div v-for="item in grades" :class="{'grade-item':true, 'graduate-item':item.gradeName.includes('往届')}" :key="item.gradeId" @click="routerToGrade(item)">
                <span>{{ item.gradeName }}</span>
            </div>
        </div>
        <!-- <a-modal :visible="uploadShow" title="导入学生信息" :confirm-loading="confirmLoading" @ok="handleOk"
            @cancel="handleCancel">
            <a-upload ref="upload" :beforeUpload="beforeUpload" :remove="removeFile" :fileList="fileList">
                <a-button icon="upload" type="primary">点击上传</a-button>
            </a-upload>
        </a-modal> -->
    </div>
</template>

<script>
// import * as XLSX from 'xlsx';
// import { excelHeaderMap } from '../../data.js';
export default {
    props: {
    },
    data() {
        return {
            uploadShow: false,
            confirmLoading: false,
            uploadData: [],
            fileList: [],
        };
    },
    computed: {
        grades() {
            return this.$store.state.groupStudent || [];
        },
    },
    watch: {
    },
    created() {
    },
    methods: {
        routerToGrade(item) {
            this.$router.push({ path: `/school/archive?gradeId=${item.gradeId}` });
        },
        importStudentList() {
            this.$router.push({ path: `/school/intro` });
            // this.uploadShow = true;
            // this.uploadData = [];
            // this.fileList = [];
        },
        // handleOk() {
        //     this.confirmLoading = true;
        //     console.log(this.uploadData)
        //     this.$axios.schoolUpload({ studentList: this.uploadData, schoolId: this.schoolId }).then(() => {
        //         this.$message.success('上传成功');
        //         this.confirmLoading = false;
        //         this.uploadShow = false;
        //     }).catch((err) => {
        //         this.$message.error(err);
        //         this.confirmLoading = false;
        //     });
        // },
        // handleCancel() {
        //     this.uploadData = [];
        //     this.uploadShow = false;
        //     this.fileList = [];
        // },
        // beforeUpload(file) {
        //     this.uploadData = [];
        //     this.fileList = [];
        //     const reader = new FileReader();
        //     reader.onload = (e) => {
        //         const data = new Uint8Array(e.target.result);
        //         const workbook = XLSX.read(data, { type: 'array' });
        //         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        //         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        //         this.getExcelData(jsonData);
        //         this.fileList = [file];
        //     };
        //     reader.readAsArrayBuffer(file);
        //     return false;
        // },
        // getExcelData(data) {
        //     const headers = data[1]; // 获取第二行的字段名
        //     const dataArray = data.slice(2); // 获取第二行之后的数据
        //     console.log(data)
        //     const processedData = dataArray.map((row) => {
        //         const rowData = {};
        //         row.forEach((value, index) => {
        //             const header = excelHeaderMap.find(i => i.title === headers[index])?.key;
        //             rowData[header] = value;
        //         });
        //         return rowData;
        //     });
        //     this.uploadData = processedData;
        // },
        // removeFile() {
        //     // 处理文件移除操作
        //     this.uploadData = [];
        //     this.fileList = [];
        // },
    },
}
</script>

<style lang="less" scoped>
.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
        font-size: 24px;
    }
}
.grade-list {
    display: flex;
    gap: 24px;

    .grade-item {
        height: 171px;
        width: 205px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: url('@/assets/school/gradeBg1.png');
        background-size: cover;
        span {
            margin-left: -30px;
            color: #fff;
            font-size: 24px;
            font-weight: bold;
        }
    }
    .grade-item:hover {
        background: url('@/assets/school/gradeBg2.png');
        background-size: cover;
    }
    .graduate-item {
        background: url('@/assets/school/gradeBg3.png');
        background-size: cover;
    }
    .graduate-item:hover {
        background: url('@/assets/school/gradeBg4.png');
        background-size: cover;
    }
}
</style>