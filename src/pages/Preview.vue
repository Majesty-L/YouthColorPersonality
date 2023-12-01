<template>
  <div>
    <div class="banner">
      <div class="banner-img">
        <img class="logo point" src="@/assets/banner.png" alt="" @click="backAdmin">
      </div>
    </div>
    <a-page-header
      title="返回问题列表" 
      class="back-btn"
      @back="back"
    />
    <h1 style="color: red;">此为预览效果，需保存后生效！</h1>
    <div class="bg container">
      <a-form-model ref="ruleForm" layout="vertical" @submit="commit" :model="model" @submit.native.prevent>
        <!-- 标题 -->
        <a-form-model-item>
          <a-tag>{{ $route.params.paper_id }}</a-tag>
        </a-form-model-item>
        <div v-for="(record,index) in questions" :xxl="24" :xl="24" :lg="24" :key="index">
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
          <!-- 简答题 -->
          <!-- <a-form-model-item v-if="record.type===5" :label="`${index+1}.${record.name}`" :prop="String(record.id)" :required="Boolean(record.necessary)">
            <a-textarea v-model="model[record.id]"></a-textarea>
          </a-form-model-item> -->
          <!-- 所有单选题 -->
          <a-form-model-item v-if="[1,2].includes(record.type)" :prop="String(record.id)"
            :rules="[{ required: Boolean(record.necessary), message: '该项为必填项！' }]"
          >
            <template #label>
              {{index+1}}.{{record.name}}
              <img class="title_img" v-if="record.img" :src="record.img" />
            </template>
            <a-radio-group v-model="model[record.id]">
              <a-radio v-for="item in options[record.id || record.pre_id]" :value="item.code" :key="item.id">
                {{ item.code }}：{{ item.answer }}<img class="option_img" v-if="item.imageUrl" :src="item.imageUrl" />
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <!-- 所有多选题 -->
          <a-form-model-item v-if="[3].includes(record.type)" :prop="String(record.id)"
            :rules="[{ required: Boolean(record.necessary), type: 'array', message: '该项为必填项！' }]"
          >
            <template #label>
              {{index+1}}.{{record.name}}（{{record.number}}个）
              <img class="title_img" v-if="record.img" :src="record.img" />
            </template>
            <a-checkbox-group v-model="model[record.id]">
              <a-row>
                <a-col v-for="item in options[record.id || record.pre_id]" :key="item.id">
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
                <a-col v-for="item in options[record.id || record.pre_id]" :key="item.id">
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
              <a-radio v-for="item in options[record.id || record.pre_id]" :value="item.code" :key="item.id" class="height_normal">
                {{ item.code }}：{{ item.answer }}<img class="option_img" v-if="item.imageUrl" :src="item.imageUrl" />
              </a-radio>
              <a-radio value="etcValue" class="height_normal">
                {{ convertToLetter(Object.keys(options[record.id || record.pre_id] || {})?.length || 0) }}：其他 <a-input class="single-line-input" @change="selectInputChange($event, record.id)" size="small"/>
              </a-radio>
            </a-radio-group>
            <!-- <p>{{ model }}:{{ record.id }} ：{{ etcValue[record.id] }}</p> -->
          </a-form-model-item>
        </div>
        <a-form-model-item class="submit-btn">
          <!-- <a-button type="primary" html-type="submit">
            提交
          </a-button> -->
          <a-button type="primary" html-type="submit" size="large">
            保存
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { colorMap,stripeMap,shuffleColor,shuffleStripe } from '@/assets/data.js' 
import * as stripes from '@/assets/stripes'
import { convertToLetter } from '@/utils/common';
export default {
  name: 'PreviewPage',
  props: {
    msg: String
  },
  data() {
    return {
      paperId: this.$route.params.paper_id,
      questions: [],
      model: {
      },
      options: {},
      admin: !!localStorage.getItem('color_name'),
      colorMap,
      stripeMap,
      shuffleColor,
      shuffleStripe,
      stripes,
      convertToLetter,
      etcValue: {},
      sortQids: [],
      // 预览数据
      view_data: this.$route.query.view_data ? JSON.parse(this.$route.query.view_data) : [],
      delete_data: this.$route.query.delete_data ? JSON.parse(this.$route.query.delete_data) : [],
      new_data: this.$route.query.new_data ? JSON.parse(this.$route.query.new_data) : {},
      edit_data: this.$route.query.edit_data ? JSON.parse(this.$route.query.edit_data) : {},
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
        name:'edit',
        query: {
          view_data: JSON.stringify(this.view_data),
          delete_data: JSON.stringify(this.delete_data),
          new_data: JSON.stringify(this.new_data),
          edit_data: JSON.stringify(this.edit_data),
        },
        params: {
          paper_id: this.paperId,
        },
      });
    },
    getData() {
      // console.log(this.view_data, this.edit_data);
      this.questions = this.view_data;
      let questionIds = this.questions.map(item=>item.id).filter(Boolean);
      let all_questionIds = this.questions.map(item=>item.id || item.pre_id);
      this.getOptions(questionIds, all_questionIds);
    },
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
    commit() {
      // 保存修改
      // 删除操作保存
      if (this.delete_data && this.delete_data.length) {
        this.$axios.deleteQuestions({ qids: this.delete_data }).then(() => {
          this.$message.success('删除成功！');
          this.delete_data = [];
        }).catch(error => {
          console.log(error);
        });
      }
      // 编辑操作保存
      if (this.edit_data && Object.keys(this.edit_data).length) {
        const editParams = {};
        for (const key in this.edit_data) {
          editParams[key] = {id:key,...this.edit_data[key]};
        }
        this.$axios.updateQuestions(editParams).then(() => {
          this.$message.success('编辑成功！');
          this.edit_data = {};
        }).catch(error => {
          console.log(error);
        });
      }
      // 新增操作保存
      if (this.new_data && Object.keys(this.new_data).length) {
        const addParams = {};
        for (const key in this.new_data) {
          addParams[key] = { pid: this.new_data[key].pid, question: this.new_data[key] };
        }
        this.$axios.addQuestions(addParams).then((data) => {
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
          this.$axios.updatePaper(sortParams).then(() => {
            this.$message.success('新增、顺序修改成功！');
            this.new_data = {};
            this.view_data = this.view_data.map(item=>({...item, id: item.id || data[item.pre_id]}));
          }).catch(error => {
            console.log(error);
          });
        }).catch(error => {
          console.log(error);
        });
      } else {
        // 顺序修改保存
        let questionIds = this.view_data.map(item => item.id);
        const sortParams = {
          paper: { id: this.paperId },
          qids: questionIds.join(','),
        };
        this.$axios.updatePaper(sortParams).then(() => {
          this.$message.success('顺序修改成功！');
        }).catch(error => {
          console.log(error);
        });
      }

      // console.log('保存成功');
    },
    selectInputChange(val, id) {
      this.etcValue[id] = val.target.value;
    }
  },
}
</script>

<style scoped>
.bg {
  background-color: rgb(128, 128, 128);
}
.container {
  padding: 36px;
}
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
/* .color_back::after {
  content: "";
  flex: auto;
} */
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
/* 返回箭头 */
.back-btn >>> .ant-page-header-heading-title {
  color: #868686;
  font-weight: bold;
  font-size: 12px;
}
.container >>> .ant-form label,
.container >>> .ant-btn {
  font-size: large;
}
.container .submit-btn {
  font-size: large;
  text-align: center;
  padding-top: 16px;
}
</style>
