<template>
  <div class="container">
    <a-page-header
      v-if="admin"
      title="管理页"
      @back="back"
    />
    <h1>预览页</h1>
    <a-form-model ref="ruleForm" layout="vertical" @submit="commit" :model="model" @submit.native.prevent>
      <!-- 标题 -->
      <a-form-model-item>
        <a-tag>{{ $route.params.paper_id }}</a-tag>
      </a-form-model-item>
      <div v-for="(record,index) in questions" :xxl="24" :xl="24" :lg="24" :key="index">
        <!-- 填空题 -->
        <a-form-model-item v-if="record.type===0" :label="`${index+1}.${record.name}`" :prop="String(record.id)" :required= "record.necessary">
          <a-input v-model="model[record.id]"></a-input>
          <!-- <p>{{ model }}:{{ record.id }}</p> -->
        </a-form-model-item>
        <!-- 简答题 -->
        <a-form-model-item v-if="record.type===5" :label="`${index+1}.${record.name}`" :prop="String(record.id)" :required="record.necessary">
          <a-textarea v-model="model[record.id]"></a-textarea>
        </a-form-model-item>
        <!-- 所有单选题 -->
        <a-form-model-item v-if="[1,2].includes(record.type)" :label="`${index+1}.${record.name}`" :prop="String(record.id)" :required="record.necessary">
          <a-radio-group v-model="model[record.id]">
            <a-radio v-for="item in options[record.id]" :value="item.code" :key="item.id">
              {{ item.code }}：{{ item.answer }}<img v-if="item.imageUrl" :src="item.imageUrl" />
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <!-- 所有多选题 -->
        <a-form-model-item v-if="[3].includes(record.type)" :label="`${index+1}.${record.name}`" :prop="String(record.id)" :required="record.necessary">
          <a-checkbox-group v-model="model[record.id]" :disabled="model[record.id]?.length>=record.maxLen">
            <a-row>
              <a-col v-for="item in options[record.id]" :key="item.id">
                <a-checkbox :value="item.code">
                  {{ item.code }}：{{ item.answer }}<img v-if="item.imageUrl" :src="item.imageUrl" />
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
        <!-- 色彩多选题 -->
        <a-form-model-item v-if="record.type===4" :label="`${index+1}.${record.name}`" :prop="String(record.id)" :required="record.necessary">
          <a-checkbox-group v-model="model[record.id]" :disabled="model[record.id]?.length>=record.maxLen">
            <a-row>
              <a-col :span="2" v-for="item in colorMap" :key="item.id">
                <a-checkbox :value="item.id">
                  <img :style="{width:'20px',height:'20px',backgroundColor:item.color}" />
                  <span>{{ item.id }}</span>
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
        <!-- 色条多选题 -->
        <a-form-model-item v-if="record.type===6" :label="`${index+1}.${record.name}`" :prop="String(record.id)" :required="record.necessary">
          <a-checkbox-group v-model="model[record.id]" :disabled="model[record.id]?.length>=record.maxLen">
            <a-row>
              <a-col :span="4" v-for="item in stripeMap" :key="item.id">
                <a-checkbox :value="item.id">
                  <img :src="stripes[`stripe${item.id}`]" style="width:50px;height:30px"/>
                  <span>{{ item.id }}</span>
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-model-item>
      </div>
      <a-form-model-item>
        <a-button type="primary" html-type="submit">
          提交
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { colorMap,stripeMap } from '@/assets/data.js' 
import * as stripes from '@/assets/stripes'
export default {
  name: 'AdminHome',
  props: {
    msg: String
  },
  data() {
    return {
      questions: [],
      model: {
      },
      options: {},
      admin: !!localStorage.getItem('colorAuth'),
      colorMap,
      stripeMap,
      stripes,
    }
  },
  created() {
    this.getData();
  },
  methods: {
    back() {
      this.$router.push({name:'admin'});
    },
    getData() {
      const id = this.$route.params.paper_id;
      if (id) {
        this.$axios.getPaperAllQuestions({paperId:this.$route.params.paper_id}).then((response) => {
          console.log('response',response)
          const {code, data} = response.data;
          if (code === 20041) {
            this.questions = data;
            const questionIds = data.map(item=>item.id);
            console.log(questionIds,data)
            this.getOptions(questionIds);
          }
        })
      } else {
        this.questions = [];
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
    commit(e) {
      console.log('commit', this.model,e);
      const that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$axios.userCommit(this.model).then((response) => {
            this.$info({
              content: '填写成功！是否再填一份？',
              onOk() {
                that.$refs.ruleForm.resetFields();
                that.$destroyAll();
              },
            });
            console.log('response',response)
          })
        } else {
          this.$message.warn('请按规则填写完整!');
          return false;
        }
      });
    },
  },
}
</script>

<style scoped>
.container {
  margin: 36px;
}
</style>
