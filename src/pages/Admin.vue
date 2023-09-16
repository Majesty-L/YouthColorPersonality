<template>
  <div class="container">
    <h1>管理页</h1>
    <div>
      <a-button type="primary" @click="create()">新增</a-button>
      <!-- <a-button @click="download()">导出</a-button> -->
      <!-- <a-button @click="test()">测试</a-button> -->
    </div>
    <a-table row-key="id" :columns="columns" :data-source="data">
      <!-- <template slot="name" slot-scope="text, row">
        <a @click="result(row)">{{ text }}</a>
      </template> -->
      <template slot="link" slot-scope="text, row">
        <a @click="view(row)">{{ text }}</a>
      </template>
      <template slot="action" slot-scope="text, row">
        <a @click="edit(row)">编辑</a>
        <a-divider type="vertical" />
        <a @click="remove(row)">删除</a>
        <a-divider type="vertical" />
        <template>
          <a-popconfirm
            ok-text="下载"
            cancel-text="取消"
            @confirm="downloadPoster"
          >
            <template slot="title">
              <p>生成分享海报</p>
              <div id="poster" class="image-container">
                <img class="qr-code" :src="qrCodeUrl" alt="QR Code">
              </div>
            </template>
            <a @click="show(row)">分享</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
    <a-modal
      title="新增问卷"
      :visible="createVisible"
      ok-text="确认"
      cancel-text="取消"
      :width="700"
      @ok="handleCreateOk"
      @cancel="createVisible=false"
    >
      <a-form-model :mode="createForm">
        <a-form-model-item label="问卷标题">
          <a-input v-model="createForm.name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="插入模板题">
          <a-checkbox-group v-model="createForm.qids">
            <a-checkbox v-for="item in moduleQuestions" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      title="编辑问卷"
      :visible="editVisible"
      ok-text="继续编辑问题"
      cancel-text="取消"
      :width="700"
      @ok="handleEditOk"
      @cancel="editVisible=false"
    >
      <a-form-model :mode="editForm">
        <a-form-model-item label="问卷标题">
          <a-input v-model="editForm.name"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const columns = [
  {
    title: '问卷名',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '链接地址',
    dataIndex: 'id',
    scopedSlots: { customRender: 'link' },
  },
  {
    title: '问题',
    dataIndex: 'qids',
  },
  // {
  //   title: '收集数',
  //   dataIndex: 'userCount',
  // },
  {
    title: '是否启用',
    dataIndex: 'if_release',
  },
  {
    title: '创建人',
    dataIndex: 'author',
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'create_time',
  // },
  // {
  //   title: '修改时间',
  //   dataIndex: 'edit_time',
  // },
  {
    title: '操作',
    dataIndex: '',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  name: 'AdminHome',
  props: {
    msg: String
  },
  data() {
    return {
      columns,
      data: [],
      qrCodeUrl: '',
      createVisible: false,
      adminName: localStorage.getItem('colorAuth'),
      createForm: {
        name: '',
        qids: [],
      },
      moduleQuestions: [{id: 9, name:'性别'}, {id: 53, name:'色彩正选题'}, {id: 54, name:'色彩反选题'}, {id: 56, name: '色条正选题'}],
      editVisible: false,
      editForm: {
        name: '',
      },
      nowPaperId: '',
    }
  },
  created() {
    this.getData();
  },
  methods: {
    test() {
      this.$axios.test().then(({data})=>console.log(data.data));
    },
    getData() {
      this.$axios.getPapers({}).then((response) => {
        console.log('response',response)
        const {code, data} = response.data;
        if (code === 20041) {
          this.data = data;
        }
      })
    },
    create() {
      console.log('create');
      this.createVisible = true;
    },
    handleCreateOk() {
      console.log('handleCreateOk',this.createForm);
      const params = {
        paper: {name: this.createForm.name, author: this.adminName},
        qids: this.createForm.qids,
      };
      this.$axios.addPaper(params).then((response) => {
        const {code} = response.data;
          if (code === 20011) {
            this.$message.success('新增成功！');
            this.createVisible = false;
            this.getData();
          }
      })
    },
    download() {
      const tableData = this.data;
      const tableColumns = this.columns.filter(item=>item.dataIndex);
      const data = tableData.map(row => {
        const rowData = {};
        tableColumns.forEach(column => {
          rowData[column.title] = row[column.dataIndex];
        });
        return rowData;
      });
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, '问卷列表.xlsx');
    },
    view(row) {
      console.log('view', row);
      this.$router.push({
        name: 'view',
        params: {
          paper_id: row.id
        },
      })
    },
    edit(row) {
      console.log('edit', row);
      this.nowPaperId = row.id;
      this.editForm.name = row.name;
      this.editVisible = true;
    },
    handleEditOk() {
      const params = {
        paper: {id:this.nowPaperId, name: this.editForm.name, author: this.adminName},
        qids: [],
      };
      this.$axios.updatePaper(params).then((response) => {
        const {code} = response.data;
          if (code === 20011) {
            this.$message.success('修改成功！');
            this.editVisible = false;
          }
      });
      this.$router.push({
        name: 'edit',
        params: {
          paper_id: this.nowPaperId,
        },
      })
    },
    remove(row) {
      console.log('remove', row);
    },
    show(row) {
      console.log('show', row);
      this.generateQRCode(row.url||'http.baidu.com');
    },
    generateQRCode(url) {
      QRCode.toDataURL(url)
        .then(qrCodeUrl => {
          this.qrCodeUrl = qrCodeUrl;
        })
        .catch(error => {
          console.error('Failed to generate QR code:', error);
        });
    },
    // 分享功能 下载海报
    downloadPoster() {
      const posterElement = document.getElementById('poster');
      html2canvas(posterElement).then(canvas => {
        const posterImage = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = posterImage;
        link.download = '分享海报.png';
        link.click();
      });
    },
    result(row) {
      console.log('result', row, this.$router);
      this.$router.push({
        name: 'result',
        params: {
          paper_id: row.id
        },
      })
    },
  },
}
</script>

<style scoped>
.container {
  margin: 36px;
}
.image-container {
  width: 200px;
  height: 300px;
  background-image: url('@/assets/logo.png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .qr-code {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
} */
</style>
