<template>
  <div class="admin-container">
    <div class="banner">
      <div class="banner-img">
        <img class="logo" src="@/assets/banner.png" alt="">
      </div>
      <a-button style="margin-right: 12px;" type="default" @click="quit()">退出系统</a-button>
    </div>
    <div class="operation">
      <a-button type="primary" class="add-btn" @click="create()">+新增问卷</a-button>
      <!-- <a-button @click="download()">导出</a-button> -->
    </div>
    <div class="list">
      <p>问卷列表（{{ data.length }}）</p>
      <a-table row-key="id" :columns="columns" :data-source="data" :scroll= "{x: 'max-content'}">
        <template slot="name" slot-scope="text, row">
          <a @click="view(row)">{{ text }}</a>
        </template>
        <!-- <template slot="link" slot-scope="text, row">
          <a @click="view(row)">{{ text }}</a>
        </template> -->
        <template slot="ifRelease" slot-scope="text, row">
          <img class="circle" :style="{backgroundColor:statusColor[row.ifRelease].color}" />
          {{statusColor[row.ifRelease].tag}}
        </template>
        <template slot="action" slot-scope="text, row">
          <a @click="edit(row)">编辑</a>
          <a-divider type="vertical" class="hide" />
          <template v-if="adminName===parentName">
            <a-popconfirm
              title="确认删除？此操作会永久删除所有答卷，无法撤销，请谨慎操作！"
              ok-text="确认"
              cancel-text="取消"
              @confirm="remove(row)"
            >
              <a>删除</a>
            </a-popconfirm>
            <a-divider type="vertical" class="hide" />
          </template>
          <template>
            <a-popconfirm
              ok-text="下载"
              cancel-text="取消"
              @confirm="downloadPoster('poster')"
            >
              <template slot="title">
                <div class="share-modal">
                  <p>生成分享海报</p>
                  <div id="poster" class="image-container">
                    <img class="logo-title" src="@/assets/share.png" alt="logo-title">
                    <img class="qr-code" :src="qrCodeUrl" alt="QR Code">
                  </div>
                  <a-textarea class="url-container" :auto-size="{ minRows: 3 }" :value="shareUrl"></a-textarea>
                </div>
              </template>
              <a @click="show(row)">分享</a>
            </a-popconfirm>
          </template>
          <a-divider type="vertical" class="hide" />        
          <a @click="release(row)">{{ row.ifRelease ? '启用':'停用' }}</a>
        </template>
        <template slot="preview" slot-scope="text, row">
          <a-icon type="eye" theme="twoTone" @click="view(row)" />
        </template>
        <template slot="report" slot-scope="text, row">
          <a @click="result(row)">查看报告</a>
        </template>
      </a-table>
    </div>
    <a-modal
      :visible="createVisible"
      ok-text="确认"
      cancel-text="取消"
      :width="700"
      :confirmLoading="createConfirmLoading"
      @ok="handleCreateOk"
      @cancel="createVisible=false"
    >
      <template #title><span style="color: #0F8EFF;">新增问卷</span></template>
      <a-form-model :mode="createForm">
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">问卷标题</span></template>
          <a-input v-model="createForm.name"></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">拷贝已有问卷</span></template>
          <a-input v-model="createForm.model"></a-input>
        </a-form-model-item>
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">插入模板题</span></template>
          <a-checkbox-group v-model="createForm.qids">
            <a-checkbox v-for="item in moduleQuestions" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      :visible="editVisible"
      ok-text="继续编辑问题"
      cancel-text="取消"
      :width="700"
      :confirmLoading="editConfirmLoading"
      @ok="handleEditOk"
      @cancel="editVisible=false"
    >
      <template #title><span style="color: #0F8EFF;">编辑问卷</span></template>
      <a-form-model :mode="editForm">
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">问卷标题</span></template>
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

const statusColor = [{color:'#80E7CA',tag:'启用中'}, {color:'#F67D7D',tag:'已停用'}, {color:'#D3D3D3',tag:'未发布'}];

export default {
  name: 'AdminHome',
  props: {
    msg: String
  },
  data() {
    return {
      data: [],
      qrCodeUrl: '',
      createVisible: false,
      adminName: localStorage.getItem('color_name'),
      parentName: localStorage.getItem('color_parent'),
      createForm: {
        name: '',
        qids: [],
      },
      moduleQuestions: [{id: 1, name:'年龄'}, {id: 9, name:'性别'}, {id: 53, name:'130色正偏好'}, {id: 54, name:'130色负偏好'}, {id: 56, name: '色条正偏好'}],
      editVisible: false,
      editForm: {
        name: '',
      },
      nowPaperId: '',
      statusColor,
      shareUrl: '',
      windowWidth: window.innerWidth,
      createConfirmLoading: false,
      editConfirmLoading: false,
      row: {},
      shareVisible: false,
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  },
  computed: {
    columns() {
      return [
        {
          title: '编号',
          dataIndex: 'id',
          width: 190,
          scopedSlots: { customRender: 'link' },
        },
        {
          title: '问卷名',
          dataIndex: 'name',
          width: 180,
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '创建人',
          dataIndex: 'author',
          width: 80,
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          width: 180,
          defaultSortOrder: 'descend',
          sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
        },
        {
          title: '状态',
          dataIndex: 'ifRelease',
          width: 100,
          scopedSlots: { customRender: 'ifRelease' },
        },
        // {
        //   title: '问题',
        //   dataIndex: 'qids',
        // },
        {
          title: '答卷数',
          align: 'center',
          dataIndex: 'userCount',
          width: 80,
        },
        // {
        //   title: '修改时间',
        //   dataIndex: 'edit_time',
        // },
        {
          title: '管理',
          align: 'center',
          dataIndex: '',
          width: 220,
          fixed: this.windowWidth > 768 ? 'right' : null,
          scopedSlots: { customRender: 'action' },
        },
        {
          title: '预览',
          align: 'center',
          dataIndex: '',
          width: 60,
          fixed: this.windowWidth > 768 ? 'right' : null,
          scopedSlots: { customRender: 'preview' },
        },
        {
          title: '报告',
          align: 'center',
          dataIndex: '',
          width: 100,
          fixed: this.windowWidth > 768 ? 'right' : null,
          scopedSlots: { customRender: 'report' },
        },
      ];
    },
  },
  methods: {
    quit() {
      localStorage.removeItem('color_name');
      localStorage.removeItem('color_parent');
      this.$router.push({name: 'login'});
    },
    getData() {
      this.$axios.getPapers({parent: this.parentName, username: this.adminName}).then((data) => {
        this.data = data;
      }).catch(error => {
        console.log(error);
      })
    },
    create() {
      // console.log('create');
      this.createVisible = true;
    },
    handleCreateOk() {
      // console.log('handleCreateOk',this.createForm);
      this.createConfirmLoading = true;
      const params = {
        paper: {name: this.createForm.name, author: this.adminName, model: this.createForm.model},
        qids: this.createForm.qids,
      };
      this.$axios.addPaper(params).then(() => {
        this.createConfirmLoading = false;
        this.$message.success('新增成功！');
        this.createVisible = false;
        this.getData();
      }).catch(error => {
        this.createConfirmLoading = false;
        this.$message.error('新增失败！');
        console.log(error);
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
      // console.log('view', row);
      this.$router.push({
        name: 'view',
        params: {
          paper_id: row.id
        },
      })
    },
    edit(row) {
      // console.log('edit', row);
      this.nowPaperId = row.id;
      this.editForm.name = row.name;
      this.row = row;
      this.editVisible = true;
    },
    handleEditOk() {
      if (this.row.name === this.editForm.name) {
        // 没变化
        this.$router.push({
          name: 'edit',
          params: {
            paper_id: this.nowPaperId,
            paper_name: this.row.name,
          },
        })
      } else {
        this.editConfirmLoading = true;
        const params = {
          paper: {id:this.nowPaperId, name: this.editForm.name, author: this.adminName},
          qids: '',
        };
        this.$axios.updatePaper(params).then(() => {
          this.editConfirmLoading = false;
          this.$message.success('修改成功！');
          this.editVisible = false;
          this.$router.push({
            name: 'edit',
            params: {
              paper_id: this.nowPaperId,
            },
          })
        }).catch(error => {
          this.editConfirmLoading = false;
          console.log(error);
        });
      }
    },
    release(row) {
      // console.log('release', row);
      this.$axios.releasePaper({pid:row.id,release:row.ifRelease?0:1}).then(() => {
        this.$message.success('操作成功！');
        this.getData();
      }).catch(error => {
        console.log(error);
      });
    },
    remove(row) {
      // console.log('remove', row);
      this.$axios.deletePaper({pid:row.id}).then(() => {
        this.$message.success('删除成功！');
        this.getData();
      }).catch(error => {
        console.log(error);
      });
    },
    show(row) {
      this.row = row;
      // console.log('show', row);
      this.shareUrl = `${window.location.origin}/color_web/view/${row.id}`;
      this.generateQRCode(this.shareUrl);
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
    downloadPoster(posterName='poster') {
      // console.log(this.row)
      const posterElement = document.getElementById(posterName);
      const originalDevicePixelRatio = window.devicePixelRatio;
      // window.devicePixelRatio = 4;
      html2canvas(posterElement, { scale: window.devicePixelRatio }).then(canvas => {
        const posterImage = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = posterImage;
        link.download = `${this.row.name}分享海报.png`;
        link.click();
        window.devicePixelRatio = originalDevicePixelRatio;
      });
    },
    result(row) {
      // console.log('result', row, this.$router);
      this.$router.push({
        name: 'result',
        params: {
          paper_id: row.id
        },
      })
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  },
}
</script>

<style scoped>
/* .container {
  margin: 6px;
} */
.share-modal {
  margin-right: 12px;
}
.image-container {
  width: 200px;
  height: 300px;
  /* background-image: url('@/assets/share.png');
  background-size: 160px;
  background-position: center 15%;
  background-repeat: no-repeat; */
  background-color: #DBEEFF;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.logo-title {
  display: block;
  width: 100%;
}
/* .qr-code {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
} */
/* .url-container {
  width: 80%;
} */
/* 头部logo区域 */
.banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 114px;
  overflow: hidden;
  border-bottom: 2px solid #C9C9C9;
}
.banner-img {
  margin: 30px 16px;
}
.logo {
  height: 54px;
}

/* 新增等操作区 */
.operation {
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 48px;
  height: 154px;
  background-color: #FAFAFA;
}
/* -正常状态 */
.add-btn {
  background-color: #0F8EFF;
  color: #fff;
  border-radius: 0;
}
.operation >>> .ant-btn {
  height: 54px;
  width: 160px;
}

/* -悬停状态 */
.add-btn:hover {
  background-color: #252525;
  border-color: #252525;
}

/* -按下状态 */
.add-btn:active {
  background-color: #fff;
  color: #0F8EFF;
  border-color: #0F8EFF;
}

/* -禁用状态 */
.add-btn:disabled {
  background-color: #868686;
  color: #fff;
}

/* 问卷列表 */
.list {
  margin: 16px;
  overflow-x: auto;
}

.list >>> .ant-table-thead th {
  height: 60px;
  background-color: #F7FBFE;
}

.list >>> .ant-table-tbody td {
  height: 44px;
  padding: 10px 16px;
}

.list >>> .ant-table-body {
  overflow-x: auto !important;
}

.circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.hide {
  opacity: 0;
  padding: 0 2px;
}
@media (max-width: 768px) {
  .list >>> .ant-table-fixed-right {
    position: static;
    top: 0;
    right: 0;
    /* width: 100%; */
  }
}

.center {
  margin: 0 auto 12px;
}
</style>
