<template>
  <div class="report-container">
    <div class="filter">
      <div class="left">
        <a-select class="mr" v-model="select.grade" :options="options.gradeOptions"></a-select>
        <a-select class="mr" v-model="select.classNum" :options="options.classOptions"></a-select>
        <a-select class="mr" v-model="select.sex" :options="options.sexOptions"></a-select>
        <a-select class="mr" v-model="select.province" :options="options.areaOptions"></a-select>
        <a-select class="mr" v-model="select.nation" :options="options.nationOptions"></a-select>
        <a-button class="btn-school -btn" @click="search">生成报告</a-button>
      </div>
      <div class="cursor" @click="html2report"><img src="@/assets/school/pdfIcon.png" alt="">下载PDF报告</div>
    </div>
    <a-spin :spinning="loading" tip="生成报告中，请勿退出当前页面..." size="large">
      <div class="per-report" id="per-report">
        <div class="level mb">
          <div class="level-left">
            <h3>测试人群</h3>
          </div>
          <div class="level-right">
            <span>本报告测试人数：</span><span class="report-num">{{ answerLen }}</span>
          </div>
        </div>
        <div class="rec-container">
          <div class="sex-part">
            <div class="rectangle">
              <div class="blue" :style="{width:percent(sexData['男'], answerLen)+'%'}"></div>
              <div class="pink" :style="{width:percent(sexData['女'], answerLen)+'%'}"></div>
            </div>
            <div class="level">
              <div class="text-left">
                男<br /><span class="bold">{{ percent(sexData['男'], answerLen) }}%</span>
              </div>
              <div class="text-right">
                女<br /><span class="bold">{{ percent(sexData['女'], answerLen) }}%</span>
              </div>
            </div>
          </div>
          <div class="grade-part">
            <div class="rectangle">
              <div v-for="item, index in gradeNoList" :key="index" :class="`rec color${item.no}`"></div>
            </div>
            <div class="grade-percent">
              <div class="per-grade" v-for="item, index in gradeNoList" :key="index">
                {{ item.name }}<br /><span class="bold">{{ percent(item.percent, answerLen) }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="six-container">
          <h3>色彩心理特征指数</h3>
          <div class="exponent">
            <div class="chart">
              <div class="per" v-for="exponent, index in exponents" :key="index" :id="exponent.dataIndex"></div>
            </div>
            <a-divider class="divider" type="vertical" :dashed="false"></a-divider>
            <div class="num-container">
              <div class="title">平均分</div>
              <div class="num">
                <div class="average" v-for="item, index in average" :key="index">{{ item }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="character-container">
          <h3>形象分布</h3>
          <div class="chart" id="animal"></div>
        </div>
      </div>
      <div class="all-animals" id="animal-intro" v-show="showIntro">
        <h3>形象介绍检索</h3>
        <div class="col" v-for="animal in Object.keys(animalIntro)" :key="animal">
          <img :src="characterIcon[animal]" width="70" height="70" alt="">{{ animalIntro[animal] }}
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { sixGradeMap } from '../data.js';
import * as echarts from 'echarts';
import * as characterIcon from '@/assets/characterIcon/index.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const percent = (zi, mu, len = 0) => {
  if (!mu) return '-';
  return zi ? (zi * 100 / mu).toFixed(len) : 0;
}

const allTypeX = [-10, -9, -8, -7, -6, -5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10];

const bgColorMap = {
  老虎: '#E78148',
  豹子: '#FFBC6E',
  鹦鹉: '#D0DF67',
  河马: '#8F7890',
  猴子: '#7C463A',
  大象: '#EADADB',
  牛: '#DDBBBC',
  鹰: '#C24B54',
  松鼠: '#ED5D2B',
  熊猫: '#E8E8EC',
  骆驼: '#E4B88F',
  狐狸: '#FFB661',
  羊: '#F9EAD9',
  鹿: '#B78461',
  驴: '#9994A0',
  犀牛: '#7A7A7B',
  考拉: '#D3D2BA',
  狮子: '#BA6448',
  孔雀: '#19AB96',
  天鹅: '#EEE3F0',
  兔子: '#F2E7EF',
  猫: '#C8C2D8',
  猫头鹰: '#CABFB3',
};

const animalIntro = {
  老虎: '1.老虎是是魅力四射的领导者与合作者，具领导力与自信，但需避免过度自信导致的问题。\n2.互动时，老虎要开放心态，倾听他言，促和谐关系。\n3.追求目标时，增耐心，减冲动，以理性应对。\n4.交友合作时，需投入时间，深化理解，包容差异，深化倾听，增信任。',
  豹子: '1.豹子是积极而全面的领导者与合作者，展现出积极主动的态度和出众的领导力，能够激励并引领团队向前发展。\n2.为进一步提升，豹子需增强耐心，谦逊地接受他人意见，并重视倾听与沟通的重要性。\n3.在领导力中需平衡控制欲，避免孤立；在沟通与交友中则需找到情感与控制的平衡点。\n4.豹子致力于深化与各方的关系，追求高质量的互动与深刻的理解。\n5.提高对新事物的接纳度和适应能力，保持耐心以应对各种挑战，是实现个人成长的关键。',
  鹦鹉: '1.鹦鹉是阳光热情、多才多艺的领袖与伙伴，在多方面表现积极热情，善于表达和创新，充满感染力和创造力。\n2.为持续发展，鹦鹉需加强情绪管理，保持心态平稳，避免冲动。\n3.追求目标时，鹦鹉应平衡理想与现实，调整期望，务实应对挑战。\n4.鹦鹉在学习、沟通、交友中需深化思考，耐心经营以稳固关系。',
  河马: '1.河马是发展均衡的现实主义者，在思考、学习和处理问题时，能够迅速理清头绪并做出有条理的安排。\n2.无论是在学习、工作还是人际交往中，河马都表现出耐心细致的品质，能够深入探究并专注于当前的任务或目标。\n3.河马能够在处理事务时能有效管理情绪，也擅长在感性与理性之间找到平衡。\n4.在沟通中能够清晰、准确地传达自己的想法，并善于倾听他人的意见。\n5.在交友方面，河马珍视友谊的质量而非数量，愿意耐心经营每一段关系。',
  猴子: '1.猴子是团队中的脑力担当，性格积极，情绪稳定，适应力强，追求高效独立同时保持开放心态，接纳不同意见。\n2.注重情感交流，关心他人需求，以深化人际关系。\n3.在领导、学习与交友中，均展现谦逊态度，持续自我完善。\n4.猴子不仅致力于深化既有关系，还积极拓展新领域，以行动证明价值。',
  大象: '1.大象是全面均衡的领导者与沟通者，情绪稳定，重视自我成长，勇敢追梦。\n2.他们沟通积极开放，注重情感共鸣，直面问题，保持务实。\n3.交友广泛真诚，精选深交，以行动深化友谊。\n4.学习上，探索与实践并重，鼓励创新，专注批判性思维。',
  牛: '1.牛是全能的领导者与行动者，兼具卓越领导力和行动力，目标明确且自信积极。\n2.他们注重灵活性提升，追求各方面平衡，尤其重视情感与人际和谐。\n3.在沟通中开放包容，擅长倾听与情感共鸣，构建良好人际关系。\n4.珍视友情，以情感共鸣深化友谊。\n5.勇于尝试新事物，接纳不同意见，展现出开放心态与进取心。',
  鹰: '1.鹰是独立自信的探索者兼领导者，展现出强烈的自信与领导力，目标明确且行动力十足。\n2.在追求个人成就的同时，他们也懂得平衡团队合作与自主决策，展现出灵活性和包容性。\n3.独立创新的特质使他们在各个领域都能脱颖而出，而开放接纳的心态则让他们不断吸收新知，持续成长。\n4.在人际交往中，他们既是积极的目标导向者，也是深谙情感共鸣的友人，能够用心经营并深化每一段关系。',
  松鼠: '1.松鼠是梦想实践者兼情感共鸣家，他们受梦想驱动，积极进取，同时保持务实态度。\n2.在管理、学习及探索上，展现高效与好奇心。\n3.人际交往中，他们重视情感共鸣，交友审慎而真挚，愿意投入时间深化友谊。\n4.开放心态使他们善于接纳不同意见，灵活应对变化。\n5.他们是勇敢追梦者，也是温暖人心的朋友，用实际行动平衡梦想与现实，展现独特魅力。',
  熊猫: '1.熊猫是梦想热情的平衡者，他们怀揣梦想，热情洋溢，同时在理想与现实间寻找平衡。\n2.人际交往中，他们情感充沛，善于沟通，珍视友谊。\n3.在学习上，他们积极探索，适应变化，注重细节。\n4.他们既热情又理智，既追求梦想又脚踏实地，是不断成长与完善的个体。',
  骆驼: '1.骆驼是全面均衡的领导者与情感智者，他们自信、目标明确，擅长逻辑分析，同时注重情感交流，平衡理性与感性。\n2.在学习和工作中，他们既能独立探索，也擅长团队合作，灵活应对变化。\n3.人际交往中，他们交友稳健，珍视友谊，用关怀和共情深化关系。\n4.他们是值得信赖的领导者，也是温暖人心的朋友，展现了高度的智慧和情感成熟度。',
  狐狸: '1.狐狸是全面发展的领导者与情感探索者，展现出积极主动的领导特质，善于表达和交际，同时具备强大的情绪管理能力和情感智慧。\n2.在追求卓越的道路上，他们懂得平衡自负与控制欲，信任团队，注重合作与沟通。\n3.他们不仅是出色的学习者，追求知识的深度和广度，还勇于创新，敢于挑战未知。\n4.在人际交往中，他们交友广泛，珍视深厚的友谊，并致力于通过共鸣和共识来深化这些关系。',
  羊: '1.羊是热情追梦的情感智者，他们友好热情，富有感染力，勇敢追求梦想，同时情感丰富，擅长人际交往。\n2.作为追梦者，他们坚守自我，脚踏实地；作为情感智者，他们真诚交流，深化友谊。\n3.他们既能独立自信，又能开放包容，在合作与自我发展中找到平衡。\n4.在追求梦想和人际交往的旅途中，他们展现出独特的魅力和智慧。',
  鹿: '1.鹿是“全面发展的社交探索者”，友好热情，善于交际，情感丰富且同理心强。\n2.他们细腻敏感，追求新知，逻辑清晰，同时注重内心平衡与情绪管理。\n3.独立自主，减少对外部认可的依赖，珍视友谊并致力于深化关系。\n4.在适应变化中不断成长，是充满活力与智慧的社交典范。',
  驴: '1.驴是理性独立的目标追求者，擅长逻辑决策，坚定自信，追求目标时展现出强大执行力。\n2.面对挑战，他们灵活适应，保持开放心态，接纳新思维。\n3.交友谨慎而深刻，珍视共鸣，用行动支持友谊。\n4.他们既独立又懂得倾听，是那些以理智为舵，以坚韧为帆，在人生航程中不断探索与成长的个体。',
  犀牛: '1.犀牛是逻辑严谨且执行力强的平衡者，以清晰的思维和果断的行动著称。\n2.在工作与生活中，他们善于平衡理性与情感，创新与实用，确保各方面和谐共进。\n3.目标明确，计划有序，擅长在沟通中既保持效率又倾听他人。\n4.交友谨慎而深刻，重视友谊的质量。\n5.他们是那些能够在复杂环境中找到平衡，以全面视角追求个人成长的杰出个体。',
  考拉: '1.考拉是理性乐观的探索者，他们既拥有理性的思考方式和乐观的生活态度，又充满了好奇心和想象力，对未知世界保持不懈的探索欲。\n2.他们重视情感需求，懂得在理想与现实之间找到平衡，以成熟的心态接受生活的不完美。\n3.在学习和工作中，他们展现出强大的学习能力和创新能力，不断追求个人成长和进步。\n4.在人际交往中，他们谨慎而深刻，珍视长久的友谊，并以开放和真诚的态度与他人建立联系。',
  狮子: '1.狮子是全面均衡的智者，他们自我管理能力强，目标明确且学习深入，沟通逻辑清晰且灵活。\n2.交友谨慎，珍视深刻友谊，并愿意投入实际支持。\n3.他们接受不完美，拥抱变化，展现出强大的适应力和开放心态。\n4.无论是个人成长还是人际交往，他们都能找到最佳平衡点，以智慧和勇气面对生活的挑战。',
  孔雀: '1.孔雀是艺术敏感且均衡的探索者，他们艺术气质浓郁，细腻敏感，富有创新力。\n2.在追求梦想的同时，擅长情绪管理，平衡感性与理性。\n3.交友时，他们珍视深刻友谊，以开放心态和包容态度深化关系。\n4.无论学习、工作还是生活，他们都深思熟虑，追求真实与平衡，展现出全面发展的独特魅力。',
  天鹅: '1.天鹅是情感丰富且理性的艺术探索者，他们拥有浓郁的艺术气质，情感深邃且善于表达。\n2.在感性与理性间游刃有余，能控制情绪，做出明智决策。\n3.同理心强，善于理解他人，交友真诚且持久。\n4.他们不断追求个人成长，通过学习与反思提升自我，展现出均衡发展的独特魅力。',
  兔子: '1.兔子是艺术感性与理性思维并存的探索者，兼具艺术气质与逻辑思维，情感丰富且理性明智。\n2.在人际交往中，展现强同理心，深化情感联系。\n3.勇于探索未知，不畏挑战，持续追求成长。\n4.以开放包容心态面对生活，展现均衡发展的独特魅力。',
  猫: '1.猫是艺术感性与理性并蓄的成长者，他们艺术气质浓厚，情感丰富，同时拥有理性思维，善于平衡感性与理性。\n2.在成长路上，他们注重情绪管理，追求真诚友谊，深化人际关系。\n3.谦逊开放，接纳不同意见，持续学习，勇于挑战自我，不断追求进步与发展。',
  猫头鹰: '1.猫头鹰是哲学家类型，擅长自我思考，思考终极问题。\n2.关注自我，不关注他人，更擅长独立工作。\n3.对外激励不敏感，在乎内心的自我感受。\n4.对客观事物创新态度不积极，对新鲜的哲学领悟充满兴趣。',
};

export default {
  components: {
  },
  props: {
    paperId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      percent,
      loading: false,
      options: {
        gradeOptions: [],
        classOptions: [],
        sexOptions: [],
        areaOptions: [],
        nationOptions: [],
      },
      select: {
        grade: '全部年级',
        classNum: '全部班级',
        sex: '全部性别',
        province: '全部地区',
        nation: '全部民族',
      },
      gradeList: [],
      gradeNoList: [
        { name: '一年级', id: '一', percent: 0, no: 0 },
        { name: '二年级', id: '二', percent: 0, no: 1 },
        { name: '三年级', id: '三', percent: 0, no: 2 },
        { name: '四年级', id: '四', percent: 0, no: 3 },
        { name: '五年级', id: '五', percent: 0, no: 4 },
        { name: '六年级', id: '六', percent: 0, no: 5 },
      ],
      allAnswers: [],
      detailData: [],
      answerLen: 0,
      sexData: {
        '男': 0,
        '女': 0,
      },
      animalsData: {},
      exponents: [
        { text: ['内认同', '外认同'], dataIndex: 'rentong' },
        { text: ['理性', '感性'], dataIndex: 'lixing' },
        { text: ['个性', '群体'], dataIndex: 'geti' },
        { text: ['执行', '幻想'], dataIndex: 'zhixing' },
        { text: ['果断', '清晰'], dataIndex: 'guoduan' },
        { text: ['现实', '理想'], dataIndex: 'xianshi' },
      ],
      characterIcon,
      animalIntro,
      showIntro: false,
    };
  },
  computed: {
    average() {
      if (!this.answerLen) {
        return ['-', '-', '-', '-', '-', '-'];
      }
      const res = [];
      this.exponents.forEach(item => {
        const data = item.data;
        let number = 0;
        allTypeX.forEach((i, index) => {
          number += ((data[index] || 0) * i);
        })
        const per = (number / this.answerLen).toFixed(2);
        res.push(per);
      });
      return res;
    },
  },
  created() {
    this.init(true);
  },
  methods: {
    search() {
      let copy = {};
      Object.keys(this.select).map(key => {
        copy[key] = this.select[key].includes('全部') ? undefined : this.select[key];
      });
      const params = {
        paperId: this.paperId,
        ...copy,
      };
      this.init(false,params);
    },
    init(flash=false, params={paperId: this.paperId}) {
      this.loading = true;
      this.$axios.getPaperReport(params).then((res) => {
        if (!res.length) {
          this.$message.info('暂无数据');
        }
          this.allAnswers = res;
          // this.allAnswers = [
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '骆驼' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '狐狸' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '羊' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹿' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '犀牛' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '犀牛' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '犀牛' },
          //   { character_id: 1, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹰' },
          //   { character_id: 3, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 13, student_id: '1800893297600909313', grade: '3', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '牛' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猴子' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '6', class_num: '3', sex: '女', province: '湖南', nation: '汉族', animal: '大象' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猫头鹰' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹦鹉' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '羊' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '熊猫' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '兔子' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '天鹅' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '松鼠' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '狮子' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猫' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '6', class_num: '3', sex: '女', province: '湖南', nation: '汉族', animal: '骆驼' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '驴' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹿' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '鹿' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '孔雀' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '考拉' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '狐狸' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '猴子' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '1', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '河马' },
          //   { character_id: 41, student_id: '1800893297600909313', grade: '2', class_num: '3', sex: '男', province: '湖南', nation: '汉族', animal: '豹子' },
          // ];
          this.answerLen = this.allAnswers.length;
          this.transferData(flash);
          this.getGradeChart();
          this.getAnimalChart();
      }).finally(() => {
        this.loading = false;
      });
    },
    transferData(flash) {
      const sex = {
        '男': 0,
        '女': 0,
      };
      const grade = {
        '一': 0,
        '二': 0,
        '三': 0,
        '四': 0,
        '五': 0,
        '六': 0,
      };
      const animals = {};
      const detailData = [];
      let options = {
        gradeOptions: new Set(['全部年级']),
        classOptions: new Set(['全部班级']),
        sexOptions: ['全部性别', '男', '女'],
        areaOptions: new Set(['全部地区']),
        nationOptions: new Set(['全部民族']),
      }
      this.allAnswers.forEach(item => {
        detailData.push({ ...item, sixGrade: sixGradeMap[item.character_id] });
        sex[item.sex]++;
        grade[item.grade]++;
        animals[item.animal] = animals[item.animal] ? animals[item.animal] + 1 : 1;
        options.gradeOptions.add(item.grade);
        options.classOptions.add(item.class_num);
        options.areaOptions.add(item.province);
        options.nationOptions.add(item.nation);
      })
      this.detailData = detailData;
      this.sexData = sex;
      this.animalsData = animals;
      const gradeNo = Object.entries(grade).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
      this.gradeNoList = this.gradeNoList.map(i => {
        i.percent = grade[i.id];
        i.no = gradeNo.indexOf(i.id);
        return i;
      });
      if (flash) {
        // 筛选下拉
        this.options = {
          gradeOptions: [...options.gradeOptions].map(i => ({value: i, label: i})),
          classOptions: [...options.classOptions].map(i => ({value: i, label: i})),
          sexOptions: options.sexOptions.map(i => ({value: i, label: i})),
          areaOptions: [...options.areaOptions].map(i => ({value: i, label: i})),
          nationOptions: [...options.nationOptions].map(i => ({value: i, label: i})),
        };
      }
    },
    getGradeChart() {
      const re = {
        rentong: [],
        lixing: [],
        geti: [],
        zhixing: [],
        guoduan: [],
        xianshi: [],
      };
      this.detailData.forEach(item => {
        item.sixGrade.forEach((i, index) => {
          const xi = allTypeX.indexOf(i);
          const di = ['rentong', 'lixing', 'geti', 'zhixing', 'guoduan', 'xianshi'][index];
          re[di][xi] = re[di][xi] ? re[di][xi] + 1 : 1;
        });
      });
      this.exponents = this.exponents.map(i => ({ ...i, data: re[i.dataIndex] }));
      // 画图
      const that = this;
      this.$nextTick(() => {
        that.exponents.forEach(item => {
          const chart = echarts.init(document.getElementById(item.dataIndex));
          const option = {
            grid: {
              left: '6%', // 调整图表左边距
              right: '6%', // 调整图表右边距
              top: '10%',
              bottom: '20%',
            },
            graphic: [
              {
                type: 'text',
                left: '0%', // 第一个标签的位置
                top: '40%', // 第一个标签的位置
                style: {
                  text: item.text[0], // 第一个标签的文本
                  textAlign: 'center',
                  fill: '#414158', // 第一个标签的颜色
                  fontSize: '16px',
                },
              },
              {
                type: 'text',
                right: '0%', // 第二个标签的位置
                top: '40%', // 第二个标签的位置
                style: {
                  text: item.text[1], // 第二个标签的文本
                  textAlign: 'center',
                  fill: '#414158', // 第二个标签的颜色
                  fontSize: '16px',
                },
              },
            ],
            xAxis: {
              type: 'category',
              axisLabel: {
                color: 'rgba(0, 0, 0, 0.5)', // 设置横坐标标签颜色和透明度
              },
              axisTick: {
                show: false, // 隐藏横坐标刻度线
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(226, 227, 244, 1)', // 设置横坐标轴线颜色和透明度
                },
              },
              splitLine: {
                show: false, // 隐藏横坐标分割线
              },
              boundaryGap: true, // 横坐标两边留白
              data: allTypeX,
            },
            yAxis: {
              type: 'value',
              show: false,
            },
            series: [
              {
                data: item.data,
                itemStyle: {
                  borderRadius: [20, 20, 0, 0],
                  color: '#6C72C9',
                },
                barWidth: '30%',
                type: 'bar',
                stack: 'a',
                name: '+'
              },
              {
                data: item.data.map(i => -i),
                itemStyle: {
                  borderRadius: [0, 0, 20, 20],
                  color: '#6C72C9',
                },
                barWidth: '30%',
                type: 'bar',
                stack: 'a',
                name: '-'
              },
            ]
          };
          chart.setOption(option);
        })
      })
    },
    getAnimalChart() {
      const data = [];
      Object.keys(this.animalsData).forEach((i) => {
        const name = i;
        const value = percent(this.animalsData[i], this.answerLen);
        data.push({
          name,
          value,
          itemStyle: {
            color: bgColorMap[name],
          },
          label: {
            formatter: params => {
              return `{blank|}\n{a|}\n{bold| ${params.name}}\n{percentage| ${params.value}%}`;
            },
            rich: {
              blank: {
                height: 20, // 调整这个值来改变空白的大小
              },
              a: {
                backgroundColor: {
                  image: characterIcon[name]
                },
                height: 100,
                align: 'center', // 图片水平居中
              },
              bold: {
                fontSize: 20,
                fontWeight: 'bold',
                align: 'center', // 图片水平居中
              },
              percentage: {
                fontSize: 20,
                align: 'center', // 图片水平居中
              },
            }
          }
        });
      });
      // 画图
      this.$nextTick(() => {
        const chart = echarts.init(document.getElementById('animal'));
        const option = {
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              if (!params.data?.name) return '';
              return `<div style="font-size:20px;padding:12px;background-color:#fff;width:400px">
                <div style="display:flex;justify-content:space-between;">
                  <div>色彩形象<br><span style="font-size:32px;font-weight:bold;line-height:110%">${params.data?.name || ''}<br>${params.data?.value || ''}%</span></div>
                  <div><img width=140 height=140 class=mb src=${(characterIcon[params.data?.name] || '').replace(params.data?.name,encodeURIComponent(params.data?.name))} /></div>
                </div>
                <div style="white-space:pre-wrap;font-size:16px;">${(animalIntro[params.data?.name] || '')}</div>
              </div>`;
            },
          },
          grid: {
            left: '0%', // 调整图表左边距
            right: '0%', // 调整图表右边距
            top: '0%',
            bottom: '0%',
          },
          series: [
            {
              left: 0,
              right: 0,
              top: 10,
              bottom: 20,
              type: 'treemap',
              roam: false, 
              nodeClick: false, 
              breadcrumb: {
                show: false, // 隐藏树状结构
              },
              levels: [
                {
                  itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 4,
                    gapWidth: 4
                  }
                },
              ],
              data,
            },
          ],
        };
        chart.setOption(option);
      })
    },
    html2report() {
      this.loading = true;
      const element = document.getElementById('per-report');

      // 保存原始的样式
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;

      // 移除高度限制和滚动条
      element.style.height = 'auto';
      element.style.overflow = 'visible';

      this.showIntro = true;
      const element2 = document.getElementById('animal-intro');

      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const width = (canvas.width/canvas.height) * 297;
        const height = 297;

        pdf.addImage(imgData, 'PNG', (210-width)/2, 2, width, height);

        // 恢复原始的样式
        element.style.height = originalHeight;
        element.style.overflow = originalOverflow;

        html2canvas(element2).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const width = (canvas.width/canvas.height) * 297;
          const height = 297;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, 0, width, height);
          pdf.save('年度报告.pdf');
          this.showIntro = false;
          this.loading = false;
        });
      });
    },
  }
}
</script>

<style lang="less" scoped>
.report-container {
  color: #414158;

  .filter {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .-btn {
      width: 120px;
      height: 30px;
      font-size: 14px;
    }

    /deep/.ant-select {
      width: 120px;
    }

    /deep/.ant-select-selection {
      border-radius: 24px;
    }

    /deep/.ant-select-selection-selected-value {
      margin-left: 12px;
    }
  }

  .loading {
    height: 85vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .per-report {
    margin-top: 12px;
    background-color: #fff;
    border-radius: 12px;
    padding: 12px 36px;
    height: 85vh;
    overflow: auto;

    .level {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .report-num {
        color: #6C72C9;
        font-size: 48px;
        font-weight: bold;
      }

      .level-right {
        display: flex;
        align-items: center;
      }
    }

    .rec-container {
      display: flex;
      justify-content: space-between;
    }

    .sex-part {
      width: 500px;

      .bold {
        font-weight: bold;
        font-size: 24px;
      }

      .text-left {
        color: #8ACCE4;
      }

      .text-right {
        color: #F4A6A6;
        text-align: end;
      }

      .rectangle {
        height: 48px;
        position: relative;
      }

      .blue {
        width: 50%;
        height: 100%;
        background-color: #8ACCE4;
        position: absolute;
        left: 0;
      }

      .pink {
        width: 50%;
        height: 100%;
        background-color: #F4A6A6;
        position: absolute;
        right: 0;
      }
    }

    .grade-part {
      width: 800px;

      .rectangle {
        display: flex;
      }

      .rec {
        flex: 1;
        height: 48px;
        position: relative;
      }

      .color {
        background-color: #fff;
      }

      .color0 {
        background-color: #6C72C9;
      }

      ;

      .color1 {
        background-color: #8489D2;
      }

      ;

      .color2 {
        background-color: #9DA1DB;
      }

      ;

      .color3 {
        background-color: #B5B8E4;
      }

      ;

      .color4 {
        background-color: #CED0ED;
      }

      ;

      .color5 {
        background-color: #E2E3F4;
      }

      ;

      .grade-percent {
        display: flex;
        justify-content: space-around;
        text-align: center;

        .bold {
          font-weight: bold;
          font-size: 24px;
        }
      }
    }

    .six-container {
      margin-top: 48px;

      .exponent {
        display: flex;

        .per {
          width: 1000px;
          height: 150px;
        }

        .divider {
          margin-left: 100px;
          position: relative;
          height: 900px;
        }

        .num-container {
          width: 300px;

          .title {
            text-align: center;
            font-size: 20px;
          }

          .num {
            margin-top: 24px;
            height: 780px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .average {
              color: #6C72C9;
              font-weight: bold;
              font-size: 24px;
            }
          }
        }
      }
    }

    .character-container {
      margin-top: 48px;

      .chart {
        width: 1300px;
        height: 1000px;
      }
    }
  }
}
.all-animals {
  display: flex;
  flex-direction: column;
  margin: 24px;
  padding: 24px 0;
  .col {
    display: flex;
    align-items: center;
    gap: 45px;
    height: 100px;
    white-space: pre-wrap;
  }
}
</style>