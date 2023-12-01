<template>
  <div>
    <div class="banner">
      <div class="banner-img">
        <img class="logo point" src="@/assets/banner.png" alt="" @click="backAdmin">
      </div>
    </div>
    <a-page-header
      title="返回问卷列表"
      class="back-btn"
      @back="back"
    />
    <div class="operation">
      <!-- <h1>结果页</h1> -->
      <div class="search-container">
        <img class="search-title" src="@/assets/result.png" alt="">
        <a-form-model :mode="searchForm" class="form" @submit="getData" @submit.native.prevent>
          <div v-for="question,index of questionData" :key="question.id" class="form_item">
            <a-form-model-item :label="question.name" v-if="(showAll||index<3)&&question.type===0">
              <a-input v-model="searchForm[question.id]"></a-input>
            </a-form-model-item>
            <a-form-model-item :label="question.name" v-if="(showAll||index<3)&&[1,3,8].includes(question.type)">
              <a-select v-model="searchForm[question.id]" allowClear>
                <a-select-option v-for="option in selectOptions[question.id]" :key="option.id" :value="option.code">{{ option.code }}、{{ option.answer }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item :label="question.name" v-if="(showAll||index<3)&&[7].includes(question.type)">
              <a-select v-model="searchForm[question.id]" allowClear>
                <a-select-option v-for="(option,index) in sort(selectOptions[question.id]||[],question.number)" :key="index" :value="option.join('')">{{ option.join('') }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item :label="question.name" v-if="(showAll||index<3)&&[4,5].includes(question.type)">
              <a-select v-model="searchForm[question.id]" allowClear>
                <a-select-option v-for="(option,index) in colorMap" :key="index" :value="String(option.id)">{{ option.id }}、{{ option.color }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item :label="question.name" v-if="(showAll||index<3)&&[6].includes(question.type)">
              <a-select v-model="searchForm[question.id]" allowClear>
                <a-select-option v-for="(option,index) in stripeMap" :key="index" :value="String(option.id)">{{ option.id }}、{{ option.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <a-form-model-item class="form_btn">
            <div
              class="text-btn"
              @click="showAll=!showAll"
            >
              {{ showAll == true ? '收起筛选' : '更多筛选'}}
            </div>
            <a-button
              class="theme-btn"
              type="primary"
              html-type="submit"
            >
              筛选
            </a-button>
            <a-button 
              class="theme-btn"
              @click="download" 
              :loading="downloadLoading"
            >导出报告</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div class="container">
      <a-spin :spinning="!loadingFinish || !optionFinish">
        <div v-if="loadingFinish && optionFinish">
          <div v-for="question,index of questionData" :key="question.id">
            <h3>{{ index+1 }}、{{ question.name }}</h3>
            <inputChart :row="question" :index="index" :selectedData="selectedData[question.id]||[]" @downloadPart="downloadPart" v-if="question.type===0"></inputChart>
            <selectChart :row="question" :index="index" :selectedData="selectedData[question.id]||[]" :option="selectOptions[question.id]" @downloadPart="downloadPart" v-if="[1,3].includes(question.type)"></selectChart>
            <hueLikeChart :row="question" :index="index" :selectedData="selectedData[question.id]||[]" @downloadPart="downloadPart" v-if="[4,5].includes(question.type)"></hueLikeChart>
            <stripeChart :row="question" :index="index" :selectedData="selectedData[question.id]||[]" @downloadPart="downloadPart" v-if="question.type===6"></stripeChart>
            <sortChart :row="question" :index="index" :selectedData="selectedData[question.id]||[]" :option="selectOptions[question.id]" @downloadPart="downloadPart" v-if="question.type===7"></sortChart>
            <inputSelectChart :row="question" :index="index" :selectedData="selectedData[question.id]||[]" :option="selectOptions[question.id]" @downloadPart="downloadPart" v-if="question.type===8"></inputSelectChart>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import inputChart from '@/components/inputChart.vue';
import selectChart from '@/components/selectChart.vue';
import hueLikeChart from '@/components/hueLikeChart.vue';
import stripeChart from '@/components/stripeChart.vue';
import sortChart from '@/components/sortChart.vue';
import inputSelectChart from '@/components/inputSelectChart.vue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {convertTo26Base, getCombinations} from '@/utils/common';
import { colorMap,stripeMap } from '@/assets/data.js';

export default {
  name: 'ResultAnalyse',
  components: {
    inputChart,
    selectChart,
    hueLikeChart,
    stripeChart,
    sortChart,
    inputSelectChart,
  },
  props: {
    msg: String
  },
  data() {
    return {
      paperId: this.$route.params.paper_id,
      questionData: [],
      searchForm: {},
      selectedData: [],
      downloadData: {},
      downloadLoading: false,
      loadingFinish: false,
      selectOptions: {},
      optionFinish: false,
      colorMap,
      stripeMap,
      showAll: false,
    }
  },
  mounted() {
    this.getQueData();
    this.getData();
  },
  methods: {
    backAdmin() {
      this.$router.push({
        name: 'admin',
      })
    },
    back() {
      this.$router.go(-1);
    },
    getQueData() {
      this.$axios.getPaperAllQuestions({paperId:this.paperId}).then((data) => {
        this.questionData = data;
        this.getOptions();
      }).catch(error => {
        this.questionData = [];
        this.$message.error('获取问题失败！');
        console.log(error);
      });
    },
    getOptions() {
      this.optionFinish = false;
      const questionIds = this.questionData.filter(item=>[1,3,7,8].includes(item.type)).map(item=>item.id);
      this.$axios.getAllOneQuesOptions({questionIds}).then((data) => {
        const options = {};
        questionIds.forEach((item,index) => {
          options[item] = data[index];
        })
        this.selectOptions = options;
        this.optionFinish = true;
        // console.log(this.selectOptions)
      }).catch(error => {
        this.selectOptions = [];
        this.optionFinish = true;
        this.$message.error('获取下拉项失败！');
        console.log(error);
      });
    },
    getData() {
      this.loadingFinish = false;
      const params = {
        ...this.searchForm,
        pid: this.paperId,
      };
      this.$axios.selectedChartData(params).then((data) => {
        this.selectedData = data;
        this.loadingFinish  = true;
      }).catch(error => {
        this.selectedData = [];
        this.loadingFinish  = true;
        this.$message.error('获取数据失败！');
        console.log(error);
      });
    },
    downloadPart([id,...arg]) {
      this.downloadData[id] = arg;
      // console.log(arg,this.downloadData);
    },
    download() {
      this.downloadLoading = true;
      const worksheet = XLSX.utils.json_to_sheet([]);
      // 根据downloadData有序导出全部数据
      let y = 1;
      Object.values(this.downloadData).forEach((tableDataList,index) => {
        // console.log(tableDataList);
        if (tableDataList.length === 1) {
          XLSX.utils.sheet_add_json(worksheet, [[`${index+1}、${this.questionData[index].name}`]], { origin: `${convertTo26Base(y)}1`, skipHeader: true });
          XLSX.utils.sheet_add_json(worksheet, tableDataList[0], { origin: `${convertTo26Base(y)}2` });
          y = y + ((tableDataList.length > 0 && tableDataList[0].length > 0)?Object.keys(tableDataList[0][0]).length:1) + 1;
        } else {
          XLSX.utils.sheet_add_json(worksheet, [[`${index+1}、${this.questionData[index].name}`]], { origin: `${convertTo26Base(y)}1`, skipHeader: true });
          XLSX.utils.sheet_add_json(worksheet, tableDataList[0], { origin: `${convertTo26Base(y)}2` });
          XLSX.utils.sheet_add_json(worksheet, tableDataList[1], { origin: `${convertTo26Base(y)}${2 + tableDataList[0].length + 2}` });
          y = y + Math.max(((tableDataList.length > 0 && tableDataList[0].length > 0)?Object.keys(tableDataList[0][0]).length:1),((tableDataList.length > 0 && tableDataList[1].length > 0)?Object.keys(tableDataList[1][0]).length:1)) + 1;
        }
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(excelBlob, `total.xlsx`);
      this.downloadLoading = false;
    },
    sort(option, number) {
      // 根据option的code，获取number个为一组的所有组合
      const optionCode = option.map(item=>item.code);
      const allSort = getCombinations(optionCode,number);
      return allSort;
    },
  },
}
</script>

<style scoped>
.container {
  margin: 36px;
}
.search-container {
  padding: 16px 36px 10px;
  background-color: #FAFAFA;
}
.search-title {
  height: 30px;
  margin-bottom: 10px;
}
/* .form {
  display: flex;
  flex-wrap: wrap;
} */
/* .form_item {
  flex: 1;
} */
.form_item >>>.ant-form-item {
  margin-bottom: 6px;
}
.form_item >>>.ant-form-item-control-wrapper {
  display: inline-block;
  margin-right: 64px;
  width: 200px;
}
.form_btn {
  width: 100%;
}
.text-btn {
  display:inline;
  text-decoration: underline;
  cursor: pointer;
}
.text-btn, .theme-btn {
  margin-right: 8px;
}
.back-btn >>> .ant-page-header-heading-title {
  color: #868686;
  font-weight: bold;
  font-size: 12px;
}
</style>
