<template>
  <div>
    <div class="banner">
      <div class="banner-img">
        <img class="logo point" src="@/assets/banner.png" alt="" @click="backAdmin">
      </div>
    </div>
    <!-- <a-page-header
      v-if="admin"
      title="返回问卷列表"
      class="back-btn"
      @back="back"
    /> -->
    <div class="bg container">
      <!-- <h1>问卷页</h1> -->
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
              <a-radio v-for="item in options[record.id]" :value="item.code" :key="item.id">
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
                <a-col v-for="item in options[record.id]" :key="item.id">
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
                <a-col v-for="item in options[record.id]" :key="item.id">
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
              <a-radio v-for="item in options[record.id]" :value="item.code" :key="item.id" class="height_normal">
                {{ item.code }}：{{ item.answer }}<img class="option_img" v-if="item.imageUrl" :src="item.imageUrl" />
              </a-radio>
              <a-radio value="etcValue" class="height_normal">
                {{ convertToLetter(Object.keys(options[record.id] || {})?.length || 0) }}：其他 <a-input class="single-line-input" @change="selectInputChange($event, record.id)" size="small"/>
              </a-radio>
            </a-radio-group>
            <!-- <p>{{ model }}:{{ record.id }} ：{{ etcValue[record.id] }}</p> -->
          </a-form-model-item>
        </div>
        <a-form-model-item class="submit-btn">
          <a-button type="primary" html-type="submit" size="large" :loading="submitLoading">
            提交
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { colorMap,stripeMap,shuffleNumbers } from '@/assets/data.js' 
import * as stripes from '@/assets/stripes'
import { convertToLetter } from '@/utils/common';
export default {
  name: 'AdminHome',
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
      shuffleColor: shuffleNumbers(colorMap),
      shuffleStripe: shuffleNumbers(stripeMap),
      stripes,
      convertToLetter,
      etcValue: {},
      sortQids: [],
      submitLoading: false,
    }
  },
  created() {
    this.getData();
  },
  mounted() {
  },
  methods: {
    backAdmin() {
      this.$router.push({
        name: 'admin',
      })
    },
    back() {
      this.$router.push({name:'admin'});
    },
    getData() {
      const id = this.paperId;
      if (id) {
        this.$axios.getPaperAllQuestions({paperId:this.$route.params.paper_id}).then((data) => {
          this.questions = data;
          const questionIds = [];
          data.forEach(item=>{
            questionIds.push(item.id);
            if(item.type === 7) { this.sortQids.push(item.id); }
          });
          // console.log(questionIds,data)
          this.getOptions(questionIds);
        }).catch(error => {
          console.log(error);
        });
      } else {
        this.questions = [];
      }
    },
    getOptions(ids) {
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
    commit() {
      const that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          const value = JSON.parse(JSON.stringify(this.model));
          Object.keys(this.etcValue).forEach(key => {
            if(value[key] === 'etcValue') {
              value[key] = this.etcValue[key];
            }
          });
          this.sortQids.forEach((key) => {
            value[key] = value[key].join('');
          });
          const params = {
            message: value,
            pid: this.paperId,
          }
          // console.log('commit', this.model, valid, params);
          this.$axios.userCommit(params).then(() => {
            this.submitLoading = false;
            this.$info({
              content: '填写成功！是否再填一份？',
              onOk() {
                that.$refs.ruleForm.resetFields();
                that.shuffleColor = shuffleNumbers(colorMap);
                that.shuffleStripe = shuffleNumbers(stripeMap);
                that.$destroyAll();
              },
            });
          }).catch(error => {
            this.submitLoading = false;
            this.$message.warn('问卷未发布/已停用！');
            console.log(error);
          });
        } else {
          this.$message.warn('请按规则填写完整!');
          return false;
        }
      });
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
@media (any-hover: hover){
	
  .hue_class p:hover {
    border: red solid 2px;
  }
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
