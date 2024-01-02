<template>
  <div class="edit-container">
    <div class="banner">
      <div class="banner-img">
        <img class="logo point" src="@/assets/banner.png" alt="" @click="backAdmin">
      </div>
    </div>
    <!-- <h1>编辑页</h1> -->
    <a-page-header title="返回问卷列表" class="back-btn" @back="back" />
    <div class="operation">
      <a-button type="primary" class="add-btn" @click="create()">+添加题目</a-button>
      <div>
        <a-button type="primary" class="publish-btn" style="margin-right: 4px;" @click="preview()"><img src="@/assets/overview.png" height="100%" /></a-button>
        <a-button type="primary" class="publish-btn" @click="commit()"><img src="@/assets/publish.png" height="100%" /></a-button>
      </div>
    </div>
    <div class="list">
      <p>问题列表（{{ data.length }}）</p>
      <a-table :row-key="(record)=>record.id||record.pre_id" :columns="columns" :data-source="data" :scroll= "{x: 'max-content'}" @change="pageChange">
        <template slot="index" slot-scope="text, row, index">
          {{ indexBegin + index + 1 }}
        </template>
        <!-- <template slot="name" slot-scope="text, row">
          <a @click="result(row)">{{ text }}</a>
        </template> -->
        <template slot="necessary" slot-scope="text">
          {{ text ? '是' : '否' }}
        </template>
        <template slot="type" slot-scope="text">
          {{ typeName[text] }}
        </template>
        <template slot="action" slot-scope="text, row, index">
          <a @click="move(index)">上移</a>
          <a-divider type="vertical" class="hide" />
          <a @click="edit(row)">编辑</a>
          <a-divider type="vertical" class="hide" />
          <a-popconfirm title="确认删除？" @confirm="remove(row)">
            <a>删除</a>
          </a-popconfirm>
        </template>
        <template slot="expandedRowRender" slot-scope="record, index">
          <a-form-model ref="ruleForm" layout="vertical" :model="model" style="margin-top:12px">
            <!-- 填空题 -->
            <a-form-model-item v-if="record.type===0" :prop="String(record.id)"
              :rules="[{ required: Boolean(record.necessary), message: '该项为必填项！' }]"
            >
              <template #label>
                {{index+1}}.{{record.name}}
                <img class="title_img" v-if="record.img" :src="record.img" />
              </template>
              <a-input v-model="model[record.id]"></a-input>
            </a-form-model-item>
            <!-- 所有单选题 -->
            <a-form-model-item v-if="[1,2].includes(record.type)" :prop="String(record.id)"
              :rules="[{ required: Boolean(record.necessary), message: '该项为必填项！' }]"
            >
              <template #label>
                {{index+1}}.{{record.name}}
                <img class="title_img" v-if="record.img" :src="record.img" />
              </template>
              <a-radio-group v-model="model[record.id]">
                <a-radio v-for="item in options[record.id||record.pre_id]" :value="item.code" :key="item.id">
                  {{ item.code }}：{{ item.answer }}<img class="option_img" v-if="item.imageUrl" :src="item.imageUrl" />
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <!-- 所有多选题 -->
            <a-form-model-item v-if="[3].includes(record.type)" :prop="String(record.id)"
              :rules="[{ required: Boolean(record.necessary), type: 'array', message: `该项为必填项！` }]"
            >
              <template #label>
                {{index+1}}.{{record.name}}
                <img class="title_img" v-if="record.img" :src="record.img" />
              </template>
              <a-checkbox-group v-model="model[record.id]">
                <a-row>
                  <a-col v-for="item in options[record.id||record.pre_id]" :key="item.id">
                    <a-checkbox :value="item.code">
                      {{ item.code }}：{{ item.answer }}<img class="option_img" v-if="item.imageUrl" :src="item.imageUrl" />
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-model-item>
            <!-- 色彩多选题 -->
            <a-form-model-item v-if="[4,5].includes(record.type)" :prop="String(record.id)"
              :rules="[{ required: Boolean(record.necessary), type: 'array', max: record.number, min: Boolean(record.necessary)?record.number:0, message: `请选中${record.number}项` }]"
            >
              <template #label>
                {{index+1}}.{{record.name}}（{{record.number}}个）
                <img class="title_img" v-if="record.img" :src="record.img" />
              </template>
              <a-checkbox-group v-model="model[record.id]" class="color_back">
                <div v-for="item in record.sort==='normal'?colorMap:shuffleColor" :key="item.id" class="display_check hue_class">
                    <a-checkbox :value="String(item.id)">
                      <p :style="{backgroundColor:item.color}" />
                    </a-checkbox>
                  </div>
              </a-checkbox-group>
            </a-form-model-item>
            <!-- 色条多选题 -->
            <a-form-model-item v-if="record.type===6" :prop="String(record.id)"
              :rules="[{ required: Boolean(record.necessary), type: 'array', max: record.number, min: Boolean(record.necessary)?record.number:0, message: `请选中${record.number}项` }]"
            >
              <template #label>
                {{index+1}}.{{record.name}}（{{record.number}}个）
                <img class="title_img" v-if="record.img" :src="record.img" />
              </template>
              <a-checkbox-group v-model="model[record.id]" class="color_back" >
                <div v-for="item in record.sort==='normal'?stripeMap:shuffleStripe" :key="item.id" class="display_check stripe_class">
                    <a-checkbox :value="String(item.id)">
                      <img :src="stripes[`stripe${item.id}`]"/>
                      <!-- <span>{{ item.id }}</span> -->
                    </a-checkbox>
                  </div>
              </a-checkbox-group>
            </a-form-model-item>
            <!-- 所有排序题 -->
            <a-form-model-item v-if="[7].includes(record.type)" :prop="String(record.id)"
              :rules="[{ required: Boolean(record.necessary), type: 'array', max: record.number, min: Boolean(record.necessary)?record.number:0, message: `请选中${record.number}项` }]"
            >
              <template #label>
                {{index+1}}.{{record.name}}
                <img class="title_img" v-if="record.img" :src="record.img" />
              </template>
              <a-checkbox-group v-model="model[record.id]">
                <a-row>
                  <a-col v-for="item in options[record.id||record.pre_id]" :key="item.id">
                    <div class="sort_no">{{ model[record.id]?.indexOf(item.code)+1 || ' ' }}</div>
                    <a-checkbox :value="item.code">
                      {{ item.code }}：{{ item.answer }}<img class="option_img" v-if="item.imageUrl" :src="item.imageUrl" />
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
              <!-- <p>{{ model[record.id] }}</p> -->
            </a-form-model-item>
            <!-- 所有选填题 -->
            <a-form-model-item v-if="[8].includes(record.type)" :prop="String(record.id)"
              :rules="[{ required: Boolean(record.necessary), message: '该项为必填项！' }]"
            >
              <template #label>
                {{index+1}}.{{record.name}}
                <img class="title_img" v-if="record.img" :src="record.img" />
              </template>
              <a-radio-group v-model="model[record.id]" class="vertical">
                <a-radio v-for="item in options[record.id||record.pre_id]" :value="item.code" :key="item.id" class="height_normal">
                  {{ item.code }}：{{ item.answer }}<img class="option_img" v-if="item.imageUrl" :src="item.imageUrl" />
                </a-radio>
                <a-radio value="etcValue" class="height_normal">
                  {{ convertToLetter(Object.keys(options[record.id||record.pre_id] || {})?.length || 0) }}：其他 <a-input class="single-line-input" @change="selectInputChange($event, record.id)" size="small"/>
                </a-radio>
              </a-radio-group>
              <!-- <p>{{ model }}:{{ record.id }} ：{{ etcValue[record.id] }}</p> -->
            </a-form-model-item>
        </a-form-model>
        </template>
      </a-table>
    </div>
    <a-modal :visible="createVisible" ok-text="确认" cancel-text="取消" :width="800" @ok="handleCreateOk"
      @cancel="createVisible = false">
      <template #title><span style="color: #0F8EFF;">新增问题</span></template>
      <a-form-model ref="create" :mode="createForm">
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">标题</span></template>
          <a-textarea v-model="createForm.title" />
        </a-form-model-item>
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">标题配图</span></template>
          <a-switch v-model="createForm.titleImg" />
          <a-upload v-if="createForm.titleImg" list-type="picture-card" :show-upload-list="false"
            action="/api/admin/upload" @change="handleChangeTitleImg">
            <img v-if="createForm.titleImgUrl" class="fit-content" :src="createForm.titleImgUrl" alt="上传成功" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">必填</span></template>
          <a-radio-group v-model="createForm.necessary">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">问题类型</span></template>
          <a-radio-group v-model="createForm.type">
            <a-radio v-for="(item) in typeList" :key="item.key" :value="item.key">
              {{ item.value }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="多选个数" v-if="[4, 5, 6, 7].includes(createForm.type)">
          <a-input-number v-model="createForm.number" :min="1" />
        </a-form-model-item>
        <a-form-model-item label="排序方式" v-if="[4, 5, 6].includes(createForm.type)">
          <a-radio-group v-model="createForm.sort">
            <a-radio value="random">乱序</a-radio>
            <a-radio value="normal">正序</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <template v-if="[1, 3, 7, 8].includes(createForm.type)">
          <a-form-model-item v-for="(option, index) in createForm.options" :key="option.key"
            :label="`选项${convertToLetter(index)}`" :prop="'options.' + index + '.optionName'">
            <a-textarea v-model="option.optionName" :rows="5" placeholder="选项文字" style="width: 60%; margin-right: 8px" />
            <a-upload list-type="picture-card" style="width: 30%;vertical-align: bottom;" :show-upload-list="false"
              action="/api/admin/upload" @change="handleChangeOptions(index, $event)">
              <img v-if="option.optionImgUrl" class="fit-content" :src="option.optionImgUrl" alt="上传成功" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
            <a-icon v-if="createForm.options.length > 1" class="dynamic-delete-button" type="minus-circle-o"
              :disabled="createForm.options.length === 1" @click="removeOption(option)" />
          </a-form-model-item>
        </template>
        <a-form-model-item v-if="[1, 3, 7, 8].includes(createForm.type)">
          <a-button type="dashed" style="width: 60%" @click="addOption()">
            <a-icon type="plus" /> Add option
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal :visible="editVisible" ok-text="确认" cancel-text="取消" :width="800" @ok="handleEditOk"
      @cancel="editVisible = false">
      <template #title><span style="color: #0F8EFF;">编辑问题</span></template>
      <a-form-model ref="edit" :mode="editForm">
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">标题</span></template>
          <a-textarea v-model="editForm.title" />
        </a-form-model-item>
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">标题配图</span></template>
          <a-switch v-model="editForm.titleImg" />
          <a-upload v-if="editForm.titleImg" list-type="picture-card" :show-upload-list="false"
            action="/api/admin/upload" @change="handleChangeTitleImg">
            <img v-if="editForm.titleImgUrl" class="fit-content" :src="editForm.titleImgUrl" alt="上传成功" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">必填</span></template>
          <a-radio-group v-model="editForm.necessary">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item>
          <template #label><span style="font-weight: bold;">问题类型</span></template>
          <a-radio-group v-model="editForm.type">
            <a-radio v-for="(item) in typeList" :key="item.key" :value="item.key">
              {{ item.value }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="多选个数" v-if="[4, 5, 6, 7].includes(editForm.type)">
          <a-input-number v-model="editForm.number" :min="1" />
        </a-form-model-item>
        <a-form-model-item label="排序方式" v-if="[4, 5, 6].includes(editForm.type)">
          <a-radio-group v-model="editForm.sort">
            <a-radio value="random">乱序</a-radio>
            <a-radio value="normal">正序</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <template v-if="[1, 3, 7, 8].includes(editForm.type)">
          <a-form-model-item v-for="(option, index) in editForm.options" :key="option.key"
            :label="`选项${convertToLetter(index)}`" :prop="'options.' + index + '.optionName'">
            <a-textarea v-model="option.optionName" :rows="5" placeholder="选项文字" style="width: 60%; margin-right: 8px" />
            <a-upload list-type="picture-card" style="width: 30%;vertical-align: bottom;" :show-upload-list="false"
              action="/api/admin/upload" @change="handleChangeOptions(index, $event)">
              <img v-if="option.optionImgUrl" class="fit-content" :src="option.optionImgUrl" alt="上传成功" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">
                  上传
                </div>
              </div>
            </a-upload>
            <a-icon v-if="index >= 1 && !option.fixedId" class="dynamic-delete-button" type="minus-circle-o"
              :disabled="editForm.options.length === 1" @click="removeOption(option)" />
          </a-form-model-item>
        </template>
        <a-form-model-item v-if="[1, 3, 7, 8].includes(editForm.type)">
          <a-button type="dashed" style="width: 60%" @click="addOption()">
            <a-icon type="plus" /> Add option
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      :visible="shareVisible"
      width="360px"
      ok-text="下载"
      cancel-text="取消"
      @ok="downloadPoster('poster2')"
      @cancel="shareVisible=false"
    >
      <template slot="title">
        {{ paperName }} 分享海报
      </template>
      <div id="poster2" class="image-container center">
        <img class="logo-title" src="@/assets/share.png" alt="logo-title">
        <img class="qr-code" :src="qrCodeUrl" alt="QR Code">
      </div>
      <a-textarea class="url-container" :auto-size="{ minRows: 3 }" :value="shareUrl"></a-textarea>
    </a-modal>
  </div>
</template>

<script>
import { colorMap, stripeMap,shuffleColor,shuffleStripe } from '@/assets/data.js'
import * as stripes from '@/assets/stripes'
import { swapObjects, convertToLetter } from '@/utils/common'
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
const columns = [
  {
    title: '问题序号',
    dataIndex: 'index',
    width: 100,
    scopedSlots: { customRender: 'index' },
  },
  {
    title: '问题名',
    dataIndex: 'name',
    width: 200,
    scopedSlots: { customRender: 'name' },
  },
  // {
  //   title: '问题编号',
  //   dataIndex: 'id',
  //   scopedSlots: { customRender: 'params' },
  // },
  {
    title: '类型',
    dataIndex: 'type',
    width: 120,
    scopedSlots: { customRender: 'type' },
  },
  // {
  //   title: '图表格式',
  //   dataIndex: 'chart',
  //   scopedSlots: { customRender: 'params' },
  // },
  {
    title: '多选个数',
    align: 'center',
    width: 100,
    dataIndex: 'number',
  },
  {
    title: '是否必填',
    align: 'center',
    dataIndex: 'necessary',
    width: 100,
    scopedSlots: { customRender: 'necessary' },
  },
  // {
  //   title: '是否启用',
  //   dataIndex: 'deleted',
  //   scopedSlots: { customRender: 'params' },
  // },
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
    title: '管理',
    align: 'center',
    dataIndex: '',
    width: 200,
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
      paperName: this.$route.params.paper_name,
      columns,
      data: [],
      createVisible: false,
      createForm: {
        title: '', // 标题
        titleImg: false, // 标题是否配图
        titleImgUrl: undefined, // 标题配图
        type: '', // 问题类型
        options: [], // 下拉项
        number: 1, // 多选个数
        sort: 'normal', // 排序方式
        necessary: 1, // 必填
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
        necessary: 1, // 必填
        delete: 0, // 是否启用
      },
      loading: false,
      typeList: [{ key: 0, value: '填空' }, { key: 1, value: '单选' }, { key: 3, value: '多选' }, { key: 4, value: '130色正偏好' }, { key: 5, value: '130色负偏好' }, { key: 6, value: '色条正偏好' }, { key: 7, value: '排序' }, { key: 8, value: '选填' }],
      colorMap,
      nowQuestionId: undefined,
      type: 'create',
      stripeMap,
      stripes,
      shuffleColor,
      shuffleStripe,
      convertToLetter,
      // 预览数据
      view_data: this.$route.query.view_data ? JSON.parse(this.$route.query.view_data) : [],
      delete_data: this.$route.query.delete_data ? JSON.parse(this.$route.query.delete_data) : [],
      new_data: this.$route.query.new_data ? JSON.parse(this.$route.query.new_data) : {},
      edit_data: this.$route.query.edit_data ? JSON.parse(this.$route.query.edit_data) : {},
      // 类型对应值
      typeName: ['填空', '单选', '', '多选', '130色正偏好', '130色负偏好', '色条正偏好', '排序', '选填' ],
      // 预览单个题
      model: {},
      options: {},
      indexBegin: 0,
      // 发布弹窗
      shareVisible: false,
      shareUrl: '',
      qrCodeUrl: '',
    }
  },
  created() {
    this.getData();
  },
  methods: {
    backAdmin() {
      this.$router.push({
        name: 'admin',
      })
    },
    back() {
      this.$router.push({
        name: 'admin',
      })
    },
    preview() {
      this.$router.push({
        name: 'preview',
        query: {
          view_data: JSON.stringify(this.data),
          delete_data: JSON.stringify(this.delete_data),
          new_data: JSON.stringify(this.new_data),
          edit_data: JSON.stringify(this.edit_data),
        },
        params: {
          paper_id: this.paperId,
          paper_name: this.paperName,
        },
      })
    },
    getData() {
      if (this.view_data && this.view_data.length) {
        this.data = this.view_data;
        const questionIds = this.data.map(item=>item.id).filter(Boolean);
        const all_questionIds = this.data.map(item=>item.id || item.pre_id);
        this.getOptions(questionIds, all_questionIds);
      } else {
        this.$axios.getPaperAllQuestions({ paperId: this.$route.params.paper_id }).then((data) => {
          this.data = data;
          const ids = data.map(item=>item.id);
          this.getInitialOptions(ids);
        }).catch(error => {
          console.log(error);
        });
      }
    },
    // 预览回来时要根据增删改来赋值
    getOptions(ids, all_questionIds) {
      if (ids&&ids.length) {
        this.$axios.getAllOneQuesOptions({questionIds:ids}).then((data) => {
          const queOptions = {};
          let index = 0;
          all_questionIds.forEach((key) => {
            if (this.edit_data[key]) {
              queOptions[key] = this.edit_data[key]?.options.map(item=>({id: item.fixedId, code: item.optionIndex, answer: item.optionName, imageUrl: item.optionImgUrl, qid: key}));
              index++;
            } else if (this.new_data[key]) {
              queOptions[key] = this.new_data[key]?.options.map(item=>({id: item.fixedId, code: item.optionIndex, answer: item.optionName, imageUrl: item.optionImgUrl, qid: key}));
            } else {
              queOptions[key] = data[index];
              index++;
            }
          })
          this.options = queOptions;
        }).catch(error => {
          console.log(error);
        });
      }
    },
    // 全为真实数据时直接拉接口数据
    getInitialOptions(ids) {
      if (ids&&ids.length) {
        this.$axios.getAllOneQuesOptions({questionIds:ids}).then((data) => {
          const queOptions = {};
          ids.forEach((key, index) => {
            queOptions[key] = data[index];
          })
          this.options = queOptions;
        }).catch(error => {
          console.log(error);
        });
      }
    },
    getPreData(type, id, index) {
      // 删除操作 从原数据删除目标id
      if (type==='remove') {
        this.data = this.data.filter(item => item.id != id && item.pre_id != id);
      } 
      // 移动操作 改变原数据涉及对象的顺序
      else if (type==='move') {
        swapObjects(this.data, index, index - 1, this);
      }
    },
    move(index) {
      if (index) {
        this.getPreData('move', this.data[index].id || this.data[index].pre_id, index);
      }
    },
    create() {
      this.type = 'create';
      this.createForm = {
        title: '', // 标题
        titleImg: false, // 标题是否配图
        titleImgUrl: '', // 标题配图
        type: 0, // 问题类型
        options: [], // 下拉项
        number: 1, // 多选个数
        sort: 'normal', // 排序方式
        necessary: 1, // 必填
        delete: 0, // 是否启用
      };
      this.createVisible = true;
      // console.log('create');
    },
    handleCreateOk() {
      // console.log('handleCreateOk', this.createForm);
      let realFormModel = JSON.parse(JSON.stringify(this.createForm));
      realFormModel.titleImgUrl = realFormModel.titleImg ? realFormModel.titleImgUrl : undefined;
      realFormModel.options = realFormModel.options.map((item, index) => ({ ...item, optionIndex: convertToLetter(index) }));
      realFormModel.pid = this.paperId;
      realFormModel.pre_id = Date.now();
      this.new_data[realFormModel.pre_id] = realFormModel;
      this.options[realFormModel.pre_id] = realFormModel.options.map(item=>({id: item.fixedId, code: item.optionIndex, answer: item.optionName, imageUrl: item.optionImgUrl, qid: this.nowQuestionId}));
      this.data.push({
        pre_id: realFormModel.pre_id, 
        deleted: realFormModel.delete, 
        img: realFormModel.titleImgUrl, 
        name: realFormModel.title, 
        necessary: realFormModel.necessary, 
        number: realFormModel.number, 
        sort: realFormModel.sort, 
        type: realFormModel.type, 
      });
      this.createVisible = false;
    },
    handleChangeTitleImg(info) {
      // console.log(info)
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        const form = this.type === 'create' ? 'createForm' : 'editForm';
        this[form].titleImgUrl = info.file.response.data.viewPath;
        this.loading = false;
      }
    },
    handleChangeOptions(index, event) {
      if (event.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (event.file.status === 'done') {
        const form = this.type === 'create' ? 'createForm' : 'editForm';
        this[form].options[index].optionImgUrl = event.file.response.data.viewPath;
        this.loading = false;
      }
    },
    addOption() {
      const form = this.type === 'create' ? 'createForm' : 'editForm';
      this[form].options.push({});
    },
    removeOption(item) {
      const form = this.type === 'create' ? 'createForm' : 'editForm';
      let index = this[form].options.indexOf(item);
      if (index !== -1) {
        this[form].options.splice(index, 1);
      }
    },
    edit(row) {
      this.type = 'edit';
      const { id, pre_id, name, img, type, number, necessary, sort } = row;
      this.nowQuestionId = id || pre_id;
      if (this.edit_data[this.nowQuestionId]) {
        this.editForm = this.edit_data[this.nowQuestionId];
        this.editVisible = true;
      } else if (this.new_data[this.nowQuestionId]) {
        this.editForm = this.new_data[this.nowQuestionId];
        this.editVisible = true;
      } else {
        this.editForm = {
          title: name, // 标题
          titleImg: img ? true : false, // 标题是否配图
          titleImgUrl: img, // 标题配图
          type, // 问题类型
          options: [], // 下拉项
          number, // 多选个数
          sort, // 排序方式
          necessary, // 必填
          delete: 0, // 是否启用
        };
        this.$axios.getAllOneQuesOptions({ questionIds: [this.nowQuestionId] }).then((data) => {
          this.editForm.options = data[0].map(item => ({ optionName: item.answer, optionImgUrl: item.imageUrl, fixedId: item.id }));
          this.editVisible = true;
        }).catch(error => {
          console.log(error);
        });
      }
    },
    handleEditOk() {
      // console.log('handleEditOk', this.editForm);
      let realFormModel = JSON.parse(JSON.stringify(this.editForm));
      realFormModel.titleImgUrl = realFormModel.titleImg ? realFormModel.titleImgUrl : undefined;
      realFormModel.options = realFormModel.options.map((item, index) => ({ ...item, optionIndex: convertToLetter(index) }));
      this.options[this.nowQuestionId] = realFormModel.options.map(item=>({id: item.fixedId, code: item.optionIndex, answer: item.optionName, imageUrl: item.optionImgUrl, qid: this.nowQuestionId}));
      this.data = this.data.map(item=>{
        if (item.id===this.nowQuestionId){
          this.edit_data[this.nowQuestionId] = realFormModel;
          return {...item, name: realFormModel.title, img: realFormModel.titleImgUrl, necessary: realFormModel.necessary, type: realFormModel.type, number: realFormModel.number, sort: realFormModel.sort};
        } else if (item.pre_id===this.nowQuestionId){
          this.new_data[this.nowQuestionId] = realFormModel;
          return {...item, name: realFormModel.title, img: realFormModel.titleImgUrl, necessary: realFormModel.necessary, type: realFormModel.type, number: realFormModel.number, sort: realFormModel.sort};
        } else {
          return item;
        }
      });
      this.editVisible = false;
    },
    remove(row) {
      // console.log('remove', row);
      if (row.id) {
        this.delete_data.push(row.id);
      } else {
        this.new_data[row.pre_id] = null;
      }
      this.getPreData('remove', row.id || row.pre_id);
    },
    result(row) {
      // console.log('result', row, this.$router);
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
    async commit() {
      // 未点过预览时view_data要手动赋值
      if (!this.view_data.length) {
        this.view_data = this.data;
      }
      try {
        // 保存修改
        // 删除操作保存
        if (this.delete_data && this.delete_data.length) {
          await this.$axios.deleteQuestions({ qids: this.delete_data });
          this.$message.success('删除成功！');
          this.delete_data = [];
        }
        // 编辑操作保存
        if (this.edit_data && Object.keys(this.edit_data).length) {
          const editParams = {};
          for (const key in this.edit_data) {
            editParams[key] = {id:key,...this.edit_data[key]};
          }
          await this.$axios.updateQuestions(editParams);
          this.$message.success('编辑成功！');
          this.edit_data = {};
        }
        // 新增操作保存
        if (this.new_data && Object.keys(this.new_data).length) {
          const addParams = {};
          for (const key in this.new_data) {
            addParams[key] = { pid: this.new_data[key].pid, question: this.new_data[key] };
          }
          
          const data = await this.$axios.addQuestions(addParams);
          // 顺序修改保存
          let questionIds = this.view_data.map(item => {
            if (item.id) {
              return item.id;
            } else if (item.pre_id && data[item.pre_id]) {
              return data[item.pre_id];
            }
          });
          const sortParams = {
            paper: { id: this.paperId },
            qids: questionIds.join(','),
          };
          await this.$axios.updatePaper(sortParams);
          this.$message.success('新增、顺序修改成功！');
          this.new_data = {};
          this.view_data = this.view_data.map(item => ({ ...item, id: item.id || data[item.pre_id] }));
          this.data = this.view_data;
        } else {
          // 顺序修改保存
          let questionIds = this.view_data.map(item => item.id);
          const sortParams = {
            paper: { id: this.paperId },
            qids: questionIds.join(','),
          };
          await this.$axios.updatePaper(sortParams);
          this.$message.success('顺序修改成功！');
        }
        // 发布成功弹窗
        this.shareVisible = true;
        this.shareUrl = `${window.location.origin}/color_web/view/${this.paperId}`;
        this.generateQRCode(this.shareUrl);
      } catch (error) {
        console.log(error);
      }

      // console.log('保存成功');
    },
    pageChange({current=1, pageSize=10}){
      this.indexBegin = (current-1)*pageSize;
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
        link.download = `${this.paperName}分享海报.png`;
        link.click();
        window.devicePixelRatio = originalDevicePixelRatio;
      });
    },
  },
}
</script>

<style scoped>
/* .container {
  margin: 36px;
} */
.hide {
  opacity: 0;
  padding: 0 3px;
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
.back-btn >>> .ant-page-header-heading-title {
  color: #868686;
  font-weight: bold;
  font-size: 12px;
}
/* .back-btn >>> .ant-page-header-back {
  color: #868686;
  font-size: 12px;
  margin: 10px;
} */

.fit-content {
  max-width: 100%;
  max-height: 100%;
}
/* 新增等操作区 */
.operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 48px;
  height: 154px;
  background-color: #FAFAFA;
}
/* -正常状态 */
.add-btn {
  background-color: #0F8EFF;
  color: #fff;
  height: 44px;
  width: 160px;
  margin-right: 12px;
}
.operation >>> .ant-btn {
  border-radius: 0;
}
.publish-btn {
  padding: 0;
  border: none;
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

/* 预览 */

.title_img {
  display: block;
  max-height: 200px;
}

.option_img {
  display: inline-block;
  max-height: 100px;
}

.color_back {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 24px 24px 12px;
  background-color: rgb(128, 128, 128);
}
.display_check>>> .ant-checkbox-inner {
  display: none;
}
.display_check {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hue_class {
  height: 70px;
}
.hue_class p {
  display: inline-block;
  width:50px;
  height:50px;
}
.hue_class:hover p {
  border: red solid 2px;
}
.hue_class>>>.ant-checkbox-wrapper-checked p {
  border: red solid 3px;
}

.stripe_class {
  height: 80px;
  vertical-align: middle;
}
.stripe_class img {
  width:110px;
  height:60px;
}
.stripe_class:hover img {
  border: red solid 2px;
}
.stripe_class>>>.ant-checkbox-wrapper-checked img {
  border: red solid 3px;
}
.single-line-input {
  border: none;
  border-bottom: 1px solid black;
  outline: none;
  width: 50%;
}
.vertical {
  display: flex;
  flex-direction: column;
}
.sort_no {
  display: inline-block;
  width: 20px;
  color: #0c56b7;
}
/* 分享海报 */
.image-container {
  width: 200px;
  height: 300px;
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
.center {
  margin: 0 auto 12px;
}
</style>
