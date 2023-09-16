<template>
  <div class="container">
    <a-page-header
      title="管理页"
      @back="back"
    />
    <h1>编辑页</h1>
    <div>
      <a-button type="primary" @click="create()">新增</a-button>
    </div>
    <a-table row-key="id" :columns="columns" :data-source="data">
      <template slot="name" slot-scope="text, row">
        <a @click="result(row)">{{ text }}</a>
      </template>
      <template slot="necessary" slot-scope="text">
        {{text?'是':'否'}}
      </template>
      <template slot="action" slot-scope="text, row">
        <a @click="edit(row)">编辑</a>
        <a-divider type="vertical" />
        <a @click="remove(row)">删除</a>
      </template>
      <template slot="expandedRowRender" slot-scope="record">
        <a-form layout="vertical">
          <!-- 填空题 -->
          <a-form-item v-if="record.type===0" :label="record.name" :required="record.necessary">
            <a-input></a-input>
          </a-form-item>
          <!-- 单选题 -->
          <a-form-item v-if="record.type===1" :label="record.name" :required="record.necessary">
            <a-select>
              <a-select-option v-for="item in options[record.id]" :value="item.code" :key="item.code">
                {{ item.code }}：{{ item.answer }}<img v-if="item.imageUrl" :src="item.imageUrl" />
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 判断题 -->
          <a-form-item v-if="record.type===2" :label="record.name" :required="record.necessary">
            <a-select>
              <a-select-option value="是">是</a-select-option>
              <a-select-option value="否">否</a-select-option>
            </a-select>
          </a-form-item>
          <!-- 多选题 -->
          <a-form-item v-if="record.type===3" :label="record.name" :required="record.necessary">
            <a-select mode="multiple">
              <a-select-option v-for="item in options[record.id]" :value="item.code" :key="item.code">
                {{ item.code }}：{{ item.answer }}<img v-if="item.imageUrl" :src="item.imageUrl" />
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 色彩多选题 -->
          <a-form-item v-if="record.type===4" :label="record.name" :required="record.necessary">
            <a-select mode="multiple">
              <a-select-option v-for="item in colorMap" :value="item.id" :key="item.id">
                {{ item.id }}：<img :style="{width:'20px',height:'20px',backgroundColor:item.color}" />
              </a-select-option>
            </a-select>
          </a-form-item>
          <!-- 简答题 -->
          <a-form-item v-if="record.type===5" :label="record.name" :required="record.necessary">
            <a-textarea></a-textarea>
          </a-form-item>
          <!-- 色彩多选题 -->
          <a-form-item v-if="record.type===6" :label="record.name" :required="record.necessary">
            <a-select mode="multiple">
              <a-select-option v-for="item in stripeMap" :value="item.id" :key="item.id">
                {{ item.id }}：<img :src="stripes[`stripe${item.id}`]" style="width:50px;height:30px"/>
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </template>
    </a-table>
    <a-modal
      title="新增问题"
      :visible="createVisible"
      ok-text="确认"
      cancel-text="取消"
      :width="700"
      @ok="handleCreateOk"
      @cancel="createVisible=false"
    >
      <a-form-model ref="create" :mode="createForm">
        <a-form-model-item label="标题">
          <a-textarea v-model="createForm.title" />
        </a-form-model-item>
        <a-form-model-item label="标题配图">
          <a-switch v-model="createForm.titleImg" />
          <a-upload
            v-if="createForm.titleImg"
            list-type="picture-card"
            :show-upload-list="false"
            action="http://localhost:8099/admin/upload"
            @change="handleChangeTitleImg"
          >
            <img v-if="createForm.titleImgUrl" :src="createForm.titleImgUrl" alt="上传成功" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="必填">
          <a-radio-group v-model="createForm.necessary">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="问题类型">
          <a-radio-group v-model="createForm.type">
            <a-radio v-for="(item) in typeList" :key="item.key" :value="item.key">
              {{item.value}}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="多选个数" v-if="[3,4,5,6].includes(createForm.type)">
          <a-input-number v-model="createForm.number" :min="1"/>
        </a-form-model-item>
        <template v-if="[1,3].includes(createForm.type)">
          <a-form-model-item
            v-for="(option, index) in createForm.options"
            :key="option.key"
            :label="`选项${index}`"
            :prop="'options.' + index + '.optionName'"
          >
            <a-textarea
              v-model="option.optionName"
              :rows="5"
              placeholder="选项文字"
              style="width: 60%; margin-right: 8px"
            />
            <a-upload
              list-type="picture-card"
              style="width: 30%;vertical-align: bottom;"
              :show-upload-list="false"
              action="http://localhost:8099/admin/upload"
              @change="handleChangeOptions(index,$event)"
            >
              <img v-if="option.optionImgUrl" :src="option.optionImgUrl" alt="上传成功" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
            <a-icon
              v-if="createForm.options.length > 1"
              class="dynamic-delete-button"
              type="minus-circle-o"
              :disabled="createForm.options.length === 1"
              @click="removeOption(option)"
            />
          </a-form-model-item>
        </template>
        <a-form-model-item v-if="[1,3].includes(createForm.type)">
          <a-button type="dashed" style="width: 60%" @click="addOption()">
            <a-icon type="plus" /> Add option
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      title="编辑问题"
      :visible="editVisible"
      ok-text="确认"
      cancel-text="取消"
      :width="700"
      @ok="handleEditOk"
      @cancel="editVisible=false"
    >
      <a-form-model ref="edit" :mode="editForm">
        <a-form-model-item label="标题">
          <a-textarea v-model="editForm.title" />
        </a-form-model-item>
        <a-form-model-item label="标题配图">
          <a-switch v-model="editForm.titleImg" />
          <a-upload
            v-if="editForm.titleImg"
            list-type="picture-card"
            :show-upload-list="false"
            action="http://localhost:8099/admin/upload"
            @change="handleChangeTitleImg"
          >
            <img v-if="editForm.titleImgUrl" :src="editForm.titleImgUrl" alt="上传成功" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="必填">
          <a-radio-group v-model="editForm.necessary">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="问题类型">
          <a-radio-group v-model="editForm.type">
            <a-radio v-for="(item) in typeList" :key="item.key" :value="item.key">
              {{item.value}}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="多选个数" v-if="[3,4,5,6].includes(editForm.type)">
          <a-input-number v-model="editForm.number" :min="1"/>
        </a-form-model-item>
        <template v-if="[1,3].includes(editForm.type)">
          <a-form-model-item
            v-for="(option, index) in editForm.options"
            :key="option.key"
            :label="`选项${index}`"
            :prop="'options.' + index + '.optionName'"
          >
            <a-textarea
              v-model="option.optionName"
              :rows="5"
              placeholder="选项文字"
              style="width: 60%; margin-right: 8px"
            />
            <a-upload
              list-type="picture-card"
              style="width: 30%;vertical-align: bottom;"
              :show-upload-list="false"
              action="http://localhost:8099/admin/upload"
              @change="handleChangeOptions(index,$event)"
            >
              <img v-if="option.optionImgUrl" :src="option.optionImgUrl" alt="上传成功" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
            <a-icon
              v-if="index >= 1 && !option.fixedId"
              class="dynamic-delete-button"
              type="minus-circle-o"
              :disabled="editForm.options.length === 1"
              @click="removeOption(option)"
            />
          </a-form-model-item>
        </template>
        <a-form-model-item v-if="[1,3].includes(editForm.type)">
          <a-button type="dashed" style="width: 60%" @click="addOption()">
            <a-icon type="plus" /> Add option
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {colorMap, stripeMap} from '@/assets/data.js'
import * as stripes from '@/assets/stripes'
const columns = [
  {
    title: '问题名',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '问题编号',
    dataIndex: 'id',
    scopedSlots: { customRender: 'params' },
  },
  {
    title: '类型',
    dataIndex: 'type',
    scopedSlots: { customRender: 'params' },
  },
  // {
  //   title: '图表格式',
  //   dataIndex: 'chart',
  //   scopedSlots: { customRender: 'params' },
  // },
  {
    title: '多选个数',
    dataIndex: 'number',
  },
  {
    title: '是否必填',
    dataIndex: 'necessary',
    scopedSlots: { customRender: 'necessary' },
  },
  {
    title: '是否启用',
    dataIndex: 'deleted',
    scopedSlots: { customRender: 'params' },
  },
  // {
  //   title: '创建人',
  //   dataIndex: 'person',
  // },
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
  name: 'EditPage',
  props: {
    msg: String
  },
  data() {
    return {
      paperId: this.$route.params.paper_id,
      columns,
      data: [],
      options: {},
      createVisible: false,
      createForm: {
        title: '', // 标题
        titleImg: false, // 标题是否配图
        titleImgUrl: undefined, // 标题配图
        type: '', // 问题类型
        options: [], // 下拉项
        number: 1, // 多选个数
        sort: 'normal', // 排序方式
        necessary: true, // 必填
        delete: 0, // 是否启用
      },
      editVisible: false,
      editForm: {
        title: '', // 标题
        titleImg: false, // 标题是否配图
        titleImgUrl: undefined, // 标题配图
        type: '', // 问题类型
        options: [], // 下拉项
        number: 1, // 多选个数
        sort: 'normal', // 排序方式
        necessary: true, // 必填
        delete: 0, // 是否启用
      },
      loading: false,
      typeList: [{key:0,value:'填空'},{key:1,value:'单选'},{key:3,value:'多选'},{key:4,value:'色彩正选'},{key:5,value:'色彩反选'},{key:6,value:'色条正选'}],
      colorMap,
      nowQuestionId: undefined,
      type: 'create',
      stripeMap,
      stripes,
    }
  },
  created() {
    this.getData();
  },
  methods: {
    back() {
      this.$router.push({
        name: 'admin',
      })
    },
    getData() {
      const id = this.$route.params.paper_id;
      if (id) {
        this.$axios.getPaperAllQuestions({paperId:this.$route.params.paper_id}).then((response) => {
          console.log('response',response)
          const {code, data} = response.data;
          if (code === 20041) {
            this.data = data;
            const questionIds = data.map(item=>item.id);
            console.log(questionIds,data)
            this.getOptions(questionIds);
          }
        })
      } else {
        this.data = [];
      }
    },
    getOptions(ids) {
      if (ids&&ids.length) {
        this.$axios.getAllOneQuesOptions({questionIds:ids}).then((response) => {
          console.log('response',response)
          const {code, data} = response.data;
          if (code === 20041) {
            const queOptions = {};
            ids.forEach((key, index) => {
              queOptions[key] = data[index];
            })
            this.options = queOptions;
            console.log(this.options)
          }
        })
      }
    },
    create() {
      this.type = 'create';
      this.createVisible = true;
      console.log('create');
    },
    handleCreateOk() {
      console.log('handleCreateOk',this.createForm);
      let realFormModel = this.createForm;
      realFormModel.titleImgUrl = realFormModel.titleImg ? realFormModel.titleImgUrl : undefined;
      realFormModel.options = realFormModel.options.map((item,index)=>({...item, optionIndex: String(index)}));
      const params = {
        pid: this.paperId,
        question: realFormModel,
      }
      this.$axios.addQuestion(params).then((response) => {
        const {code} = response.data;
          if (code === 20011) {
            this.$message.success('新增成功！');
            this.createVisible = false;
            this.getData();
          }
      })
    },
    handleChangeTitleImg(info) {
      console.log(info)
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        const form = this.type === 'create'?'createForm':'editForm';
        this[form].titleImgUrl = info.file.response.data.viewPath;
        this.loading = false;
      }
    },
    handleChangeOptions(index,event) {
      if (event.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (event.file.status === 'done') {
        const form = this.type === 'create'?'createForm':'editForm';
        this[form].options[index].optionImgUrl = event.file.response.data.viewPath;
        this.loading = false;
      }
    },
    addOption() {
      const form = this.type === 'create'?'createForm':'editForm';
      this[form].options.push({});
    },
    removeOption(item) {
      const form = this.type === 'create'?'createForm':'editForm';
      let index = this[form].options.indexOf(item);
      if (index !== -1) {
        this[form].options.splice(index, 1);
      }
    },
    edit(row) {
      this.type = 'edit';
      const {id, name, img, type, number, necessary} = row;
      this.nowQuestionId = id;
      this.editForm = {
        title: name, // 标题
        titleImg: img?true:false, // 标题是否配图
        titleImgUrl: img, // 标题配图
        type, // 问题类型
        options: [], // 下拉项
        number, // 多选个数
        sort: 'normal', // 排序方式
        necessary, // 必填
        delete: 0, // 是否启用
      };
      this.$axios.getAllOneQuesOptions({questionIds:[this.nowQuestionId]}).then((response) => {
        const {code, data} = response.data;
        if (code === 20041) {
          this.editForm.options = data[0].map(item=>({optionName: item.answer, optionImgUrl: item.imageUrl, fixedId: item.id}));
          this.editVisible = true;
        }
      })
    },
    handleEditOk() {
      console.log('handleEditOk',this.editForm);
      let realFormModel = this.editForm;
      realFormModel.titleImgUrl = realFormModel.titleImg ? realFormModel.titleImgUrl : undefined;
      realFormModel.options = realFormModel.options.map((item,index)=>({...item, optionIndex: String(index)}));
      const params = {
        id: this.nowQuestionId,
        ...realFormModel,
      }
      this.$axios.updateQuestion(params).then((response) => {
        const {code} = response.data;
          if (code === 20011) {
            this.$message.success('编辑成功！');
            this.editVisible = false;
            this.getData();
          }
      })
    },
    remove(row) {
      console.log('remove', row);
    },
    result(row) {
      console.log('result', row, this.$router);
      this.$router.push({
        name: 'result',
        params: {
          question_id: row.id
        },
        query: {
          row: row,
          chart: row.chart,
        }
      })
    },
  },
}
</script>

<style scoped>
.container {
  margin: 36px;
}
</style>
