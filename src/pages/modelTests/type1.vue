<template>
    <div class="type-container">
        <div v-if="current===0" class="step0">
            <div class="text">
                <div class="title">
                    <span :class="{'color-person': true}" v-html="addPinyin('游戏介绍')"></span>
                    <div :class="{speech, 'bc-person': true}" @click="play(1)">
                        <video class="video" id="play1" width="7rem" height="7rem" v-if="showBtn" src="@/assets/speech/1.mp4">
                        </video>
                    </div>
                </div>
                <div class="intro">
                    <span v-html="addPinyin('让我们一起玩一个选颜色的游戏，游戏很简单，只需要三步。你要按照提示选择你喜欢的，准备好了吗？让我们开始游戏吧！')"></span>
                </div>
            </div>
            <div class="content">
                <div class="col col1">
                    <div class="icon icon1">1</div>
                    <div class="intro-step" v-html="addPinyin('选10个你喜欢的颜色')"></div>
                    <img src="@/assets/student/gameIntro1.png" alt="">
                </div>
                <div class="arrow">
                    <img src="@/assets/student/arrow.png" alt="">
                </div>
                <div class="col col2">
                    <div class="icon icon2">2</div>
                    <div class="intro-step" v-html="addPinyin('选5个你喜欢的组合')"></div>
                    <img src="@/assets/student/gameIntro2.png" alt="">
                </div>
                <div class="arrow">
                    <img src="@/assets/student/arrow.png" alt="">
                </div>
                <div class="col col3">
                    <div class="icon icon3">3</div>
                    <div class="intro-step" v-html="addPinyin('选5个你喜欢的图片')"></div>
                    <img src="@/assets/student/gameIntro3.png" alt="">
                </div>
            </div>
            <div class="action">
                <a-button class="btn-student self-btn" v-html="addPinyin('开始游戏')" @click="startTest(1)"></a-button>
            </div>
        </div>
        <div v-else-if="current===1" class="step1">
            <div class="title">
                <div :class="{speech, 'bc-person': true}" @click="play(2)">
                    <video class="video" id="play2" width="7rem" height="7rem" v-if="showBtn" src="@/assets/speech/2.mp4">
                    </video>
                </div>
                <span v-html="addPinyin('选10个你喜欢的颜色')"></span>
            </div>
            <div class="content">
                <a-checkbox-group v-model="selectedColors" class="color_back">
                    <div v-for="item in shuffleColor" :key="item.id" class="display_check hue_class">
                        <a-checkbox :value="item">
                            <p :style="{backgroundColor:item.color, borderRadius:'4px'}" />
                        </a-checkbox>
                    </div>
                </a-checkbox-group>
            </div>
            <div class="action">
                <div v-for="item in selectedColors" :key="item.id" class="selected_class">
                    <p :style="{backgroundColor:item.color}" />
                </div>
                <a-button :class="{'btn-person':true, 'end-btn': true}" v-html="addPinyin('完成')" :disabled="selectedColors.length!=10" @click="startTest(2)"></a-button>
            </div>
            <a-button :class="{'btn-person':true, 'phone-end-btn': true}" v-html="addPinyin('完成')" :disabled="selectedColors.length!=10" @click="startTest(2)"></a-button>
        </div>
        <div v-else-if="current===2" class="step2">
            <div class="title">
                <div :class="{speech, 'bc-person': true}" @click="play(3)">
                    <video class="video" id="play3" width="7rem" height="7rem" v-if="showBtn" src="@/assets/speech/3.mp4">
                    </video>
                </div>
                <span v-html="addPinyin('选5个你喜欢的组合')"></span>
            </div>
            <div class="content-action">
                <div class="content">
                    <a-checkbox-group v-model="selectedStripes" class="color_back">
                        <div v-for="item in shuffleStripe" :key="item.id" class="display_check stripe_class">
                            <a-checkbox :value="item">
                                <img :src="stripes[`stripe${item.id}`]"/>
                            </a-checkbox>
                        </div>
                    </a-checkbox-group>
                </div>
                <div class="action">
                    <div v-for="item in selectedStripes" :key="item.id" class="selected_class">
                        <img :src="stripes[`stripe${item.id}`]"/>
                    </div>
                    <a-button :class="{'btn-person':true, 'end-btn': true}" v-html="addPinyin('完成')" :disabled="selectedStripes.length!=5" @click="startTest(3)"></a-button>
                </div>
            </div>
            <div class="phone-action">
                <div v-for="item in selectedStripes" :key="item.id" class="selected_class">
                    <img :src="stripes[`stripe${item.id}`]"/>
                </div>
            </div>
            <a-button :class="{'btn-person':true, 'phone-end-btn': true}" v-html="addPinyin('完成')" :disabled="selectedStripes.length!=5" @click="startTest(3)"></a-button>
        
        </div>
        <div v-else-if="current===3" class="step3">
            <div class="title">
                <div :class="{speech, 'bc-person': true}" @click="play(4)">
                    <video class="video" id="play4" width="7rem" height="7rem" v-if="showBtn" src="@/assets/speech/4.mp4">
                    </video>
                </div>
                <span v-html="addPinyin('选5个你喜欢的图片')"></span>
            </div>
            <div class="content">
                <a-checkbox-group v-model="selectedImages" class="color_back">
                    <div v-for="item in shuffleImage" :key="item.id" class="display_check image_class">
                        <a-checkbox :value="item">
                            <img :src="images[`image${item.id}`]"/>
                        </a-checkbox>
                    </div>
                </a-checkbox-group>
            </div>
            <div class="action">
                <div v-for="item in selectedImages" :key="item.id" class="selected_class">
                    <img :src="images[`image${item.id}`]"/>
                </div>
                <a-button :class="{'btn-person':true, 'end-btn': true}" v-html="addPinyin('完成')" :disabled="selectedImages.length!=5" @click="startTest(99)"></a-button>
            </div>
            <a-button :class="{'btn-person':true, 'phone-end-btn': true}" v-html="addPinyin('完成')" :disabled="selectedImages.length!=5" @click="startTest(99)"></a-button>
        </div>
        <div v-else-if="current===99" class="step4">
            <div class="showoff">
                <img class="success-img" src="@/assets/student/success.png" alt="">
                <h1 class="finish-text" v-html="addPinyin('完成啦！')"></h1>
                <h3 class="mt" v-html="addPinyin('体验打分')"></h3>
                <a-rate v-model="grade" style="font-size: 36px" @change="onChangeRate"></a-rate>
            </div>
            <div class="action">
                <a-button :class="{'btn-person':true, btn1: true, mr: true}" v-html="addPinyin('返回首页')" @click="backHome"></a-button>
                <a-button class="btn-student btn2 ml mt" v-html="addPinyin('查看结果')" @click="viewReport"></a-button>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import { html } from 'pinyin-pro';
import * as stripes from '@/assets/stripes'
import * as images from '@/assets/images'
import { shuffleColor, shuffleStripe, shuffleImage } from '@/assets/data.js' 
export default {
    name: 'TestStepPage',
    components: {
    },
    props: {
        step: {
            type: Number,
            default: 3,
        },
        showBtn: {
            type: Boolean,
            default: false,
        },
        commitRes: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            current: 0,
            addPinyin: html,
            shuffleColor,
            shuffleStripe,
            shuffleImage,
            selectedColors: [],
            selectedStripes: [],
            selectedImages: [],
            stripes,
            images,
            speechBtn: true,
            grade: 0,
        };
    },
    watch: {
        step: {
            handler(val) {
                this.current = val;
            },
            immediate: true,
        },
        showBtn: {
            handler(val) {
                this.addPinyin = val ? html : (t) => t;
                this.speechBtn = false;
            },
            immediate: true,
        },
        selectedColors(val) {
            if (val && val.length>=10) {
                if (val.length>10) {
                    this.selectedColors.pop();
                } else {
                    this.$info({content:'已选中10个色块！'});
                }
            }
        },
        selectedStripes(val) {
            if (val && val.length>=5) {
                if (val.length>5) {
                    this.selectedStripes.pop();
                } else {
                    this.$info({content:'已选中5个组合！'});
                }
            }
        },
        selectedImages(val) {
            if (val && val.length>=5) {
                if (val.length>5) {
                    this.selectedImages.pop();
                } else {
                    this.$info({content:'已选中5个图片！'});
                }
            }
        },
    },
    methods: {
        play(type) {
            var video = document.getElementById(`play${type}`);
            video.play();
        },
        speech(text) {
            const utterance = new SpeechSynthesisUtterance();
            utterance.rate = 1.6; 
            utterance.pitch = 1.5; 
            utterance.text = text;
            speechSynthesis.speak(utterance);
        },
        startTest(num) {
            this.current = num;
            let params = {};
            if (num === 99) {
                const {selectedColors, selectedStripes, selectedImages} = this;
                // 色调 取选中最多的色调
                const groupedHues = _.orderBy(Object.entries(_.groupBy(selectedColors, 'hue')), ([, value]) => value.length, 'desc');
                const hue = groupedHues[0][0];
                // 色相 取选中最多的分组色相
                const groupedPhases = _.orderBy(Object.entries(_.groupBy(selectedColors, 'groupPhase')), ([, value]) => value.length, 'desc');
                const phase = groupedPhases[0][0];
                // 开放度 选中最多的色调的颜色个数决定 4/7/7+
                const open = groupedHues[0][1].length <= 4 ? '低' : groupedHues[0][1].length <= 7 ? '中' : '高';
                // 理性/感性 hue尾号 0-4：感性 5-9：理性
                let isGan = 0;
                selectedColors.forEach(item => {
                    if (item.id%10 < 5) {
                        isGan += 1;
                    } else {
                        isGan -= 1;
                    }
                })
                params = {
                    hue,
                    phase,
                    open,
                    sense: isGan ? '感性' : '理性',
                    origin: JSON.stringify({
                        selectedColors: selectedColors.map(i=>i.id),
                        selectedStripes: selectedStripes.map(i=>i.id),
                        selectedImages: selectedImages.map(i=>i.id),
                    }),
                };
            }
            this.$emit('changeCur', [num, params]);
        },
        backHome() {
            this.$router.push({name: `${this.from}Index`});
        },
        viewReport() {
            this.$router.push({name: `${this.from}Report`});
        },
        // 评价
        onChangeRate(rate) {
            if (!this.commitRes || !this.commitRes.paperId) {
                this.$message.error('提交失败，请重试！');
                return;
            }
            const params = {
                grade: rate,
                ...this.commitRes,
            };
            this.$axios.callbackRate(params).then(() => {
                this.$message.success('提交成功！');
            }).catch((err) => {
                this.$message.error(err);
            })
        },
    }
}
</script>

<style lang="less" scoped>
.title {
    display: flex;
    align-items: center;
    span {
        font-size: 2rem;
        color: #fff;
        margin-right: 0.8rem;
    }
    .speech {
        width: 7rem;
        height: 7rem;
        cursor: pointer;
        .video {
            opacity: 0;
        }
    }
    .bc-person {
        background: no-repeat url('@/assets/person/laba.png') 0 0 / cover;
    }
}
.type-container {
    .step0 {
        padding: 5rem;
        .text {
            margin-top: 4rem;
            display: flex;
            justify-content: space-evenly;
            .title {
                font-size: 4rem;
                width: 38rem;
                .speech {
                    margin-left: 1rem;
                }
            }
            .intro {
                font-size: 2rem;
            }
        }
        .content {
            margin-top: 4rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            // gap: 3rem;
            .icon {
                margin-top: -4rem;
                margin-left: calc(50% - 2.5rem);
                width: 5rem;
                text-align: center;
                border-radius: 50%;
                font-size: 3rem;
                color: #fff;
            }
            .icon1 {
                background-color: #FA7800;
            }
            .icon2 {
                background-color: #F6CE6C;
            }
            .icon3 {
                background-color: #5C9FA8;
            }
            .col {
                flex: 1 1 20%;
                box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
                background-color: #fff;
                border-radius: 24px;
                height: 22rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .intro-step {
                    max-width: 20rem;
                    text-align: center;
                    border-radius: 24px;
                    font-size: 2.2rem;
                    padding: 1.5rem 1.5rem 0;
                    margin: 0 auto;
                }
                img {
                    margin: 2rem auto;
                    max-width: 80%;
                }
            }
            .arrow {
                flex: 0 1 5%;
                margin: 0 1rem;
            }
        }
        .action {
            display: flex;
            justify-content: center;
            .self-btn {
                background-color: #FA7800;
                margin-top: 60px;
            }
            .self-btn:hover {
                border-color: #FA7800;
                color: #FA7800;
                background: none;
            }
        }
    }
    .display_check /deep/ .ant-checkbox-inner {
        display: none;
    }
    .step1 {
        min-height: calc(100vh - 64px);
        padding: 2rem 5rem;
        background-color: rgb(128, 128, 128);
        .color_back {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            padding: 1.5rem 0 0.8rem;
        }
        .hue_class {
            height: 5rem;
        }
        .hue_class p {
            display: inline-block;
            width:4rem;
            height:4rem;
        }
        @media (any-hover: hover){
            .hue_class p:hover {
                border: red solid 3px;
            }
        }
        .hue_class /deep/.ant-checkbox-wrapper-checked p {
            border: red solid 4px;
        }
        .action {
            border: 2px solid #fff;
            border-radius: 1.5rem;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            flex-wrap: wrap;
            padding: 1.5rem 1.5rem 0.6rem;
            min-height: 9rem;
            gap: 1.5rem;
            .selected_class p {
                width: 5rem;
                height: 5rem;
                border-radius: 6px;
            }
            .end-btn {
                margin-left: auto;
                width: 12rem;
            }
        }
        .phone-end-btn {
            display: none;
        }
    }
    .step2 {
        min-height: calc(100vh - 64px);
        padding: 2rem 5rem;
        background-color: rgb(128, 128, 128);
        .content-action {
            display: flex;
        }
        .content {
            .color_back {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                padding: 1.5rem 0 0.8rem;
                gap: 1.5rem;
            }
            .stripe_class {
                height: 5rem;
                vertical-align: middle;
            }
            .stripe_class img {
                width:9rem;
                height:5rem;
                border-radius: 9px;
            }
            .stripe_class:hover img {
                border: red solid 3px;
            }
            .stripe_class /deep/ .ant-checkbox-wrapper-checked img {
                border: red solid 4px;
            }
        }
        .action {
            flex: 0 0 16rem;
            border: 2px solid #fff;
            border-radius: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            margin-top: 1.5rem;
            padding: 1.5rem 1.5rem;
            gap: 1.5rem;
            .selected_class img {
                width: 10rem;
                height: 5rem;
                border-radius: 9px;
            }
            .end-btn {
                margin-top: auto;
                width: 11rem;
            }
        }
        .phone-action, .phone-end-btn {
            display: none;
        }
    }
    .step3 {
        min-height: calc(100vh - 64px);
        padding: 5rem;
        background-color: rgb(128, 128, 128);
        .color_back {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            padding: 1.5rem 0 0.8rem;
            gap: 1.5rem;
        }
        .image_class {
            height: 5rem;
            vertical-align: middle;
        }
        .image_class img {
            width:5.5rem;
            height:5.5rem;
        }
        .image_class:hover img {
            border: red solid 3px;
        }
        .image_class /deep/ .ant-checkbox-wrapper-checked img {
            border: red solid 4px;
        }
        .action {
            border: 2px solid #fff;
            border-radius: 24px;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            flex-wrap: wrap;
            margin-top: 4rem;
            padding: 0.8rem 1.5rem 0.8rem;
            min-height: 9rem;
            gap: 1.5rem;
            .selected_class img {
                width: 6rem;
                height: 6rem;
            }
            .end-btn {
                margin-left: auto;
                width: 11rem;
            }
        }
        .phone-end-btn {
            display: none;
        }
    }
    .step4 {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background-color: #fff;
        .finish-text {
            margin-left: 3rem;
            font-size: xxx-large;
            color: #FA7800;
        }
        .btn1 {
            max-width: 40%;
            width: 25rem;
        }
        .btn2 {
            max-width: 40%;
            width: 25rem;
            background-color: #FA7800;
        }
        .btn2:hover {
            border-color: #FA7800;
            color: #FA7800;
            background: none;
        }
        .success-img {
            max-width: 80%;
        }
    }
}
.color-person {
    color: #00D9C0 !important;
}
</style>
<style lang="less" scoped>
@media (max-width: 1024px) {
.title {
    span {
        font-size: 1.6rem;
        margin-right: 0;
    }
    .speech {
        width: 6rem;
        height: 6rem;
    }
}
.type-container {
    .step0 {
        padding: 3rem;
        .text {
            margin-top: 3rem;
            .title {
                font-size: 3rem;
                width: 38rem;
                .speech {
                    margin-left: 0;
                }
            }
            .intro {
                font-size: 1.6rem;
            }
        }
        .content {
            .icon {
            }
            .col {
                height: 20rem;
                .intro-step {
                    font-size: 1.8rem;
                }
                img {
                }
            }
        }
    }
    .step1 {
        .color_back {
        }
        .hue_class {
        }
        .hue_class p {
        }
        .action {
            .selected_class p {
            }
            .end-btn {
            }
        }
    }
    .step2 {
        .content-action {
        }
        .content {
            .color_back {
            }
            .stripe_class {
            }
            .stripe_class img {
            }
        }
        .phone-action {
            .selected_class img {
            }
        }
        .phone-end-btn {
        }
    }
    .step3 {
        .color_back {
        }
        .image_class {
        }
        .image_class img {
        }
        .action {
            .selected_class img {
            }
            .end-btn {
            }
        }
    }
    .step4 {
        .finish-text {
        }
        .btn1 {
        }
        .btn2 {
        }
    }
}
}
</style>
<style lang="less" scoped>
@media (max-width: 800px) {
.title {
    span {
        font-size: 1.2rem;
        margin-right: 0;
    }
    .speech {
        width: 6rem;
        height: 6rem;
    }
}
.type-container {
    .step0 {
        padding: 3rem;
        .text {
            margin-top: 3rem;
            .title {
                font-size: 3rem;
                width: 38rem;
                .speech {
                    margin-left: 0;
                }
            }
            .intro {
                font-size: 1.2rem;
            }
        }
        .content {
            .icon {
                margin-top: -1rem;
                width: 3rem;
                font-size: 2rem;
                margin-left: calc(50% - 1.5rem);
            }
            .col {
                height: 14rem;
                .intro-step {
                    font-size: 1.2rem;
                }
                img {
                }
            }
        }
    }
    .step1 {
        .color_back {
        }
        .hue_class {
        }
        .hue_class p {
        }
        .action {
            .selected_class p {
            }
            .end-btn {
            }
        }
    }
    .step2 {
        padding: 2rem 2rem;
        .content-action {
        }
        .content {
            .color_back {
                padding: 1.5rem 0 0.8rem;
                gap: 0.5rem;
            }
            .stripe_class {
                height: 3rem;
            }
            .stripe_class img {
                width:6rem;
                height:2.5rem;
                border-radius: 0.4rem;
            }
        }
        .action {
            display: none;
        }
        .phone-action, .phone-end-btn {
            display: block;
        }
        .phone-action {
            border: 2px solid #fff;
            border-radius: 1.5rem;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            flex-wrap: wrap;
            padding: 1.5rem 1.5rem 0.6rem;
            min-height: 9rem;
            gap: 0.5rem;
            .selected_class img {
                width: 6rem;
                height: 2.5rem;
                border-radius: 0.4rem;
            }
        }
        .phone-end-btn {
            display: block;
            margin: 1rem auto 2rem;
            width: 9rem;
            font-size: x-large;
            height: 3rem;
        }
    }
    .step3 {
        .color_back {
        }
        .image_class {
        }
        .image_class img {
        }
        .action {
            .selected_class img {
            }
            .end-btn {
            }
        }
    }
    .step4 {
        .finish-text {
        }
        .btn1 {
        }
        .btn2 {
        }
        .btn2:hover {
        }
    }
}
}
</style>
<style lang="less" scoped>
@media (max-width: 550px) {
.title {
    span {
        font-size: 1.4rem;
    }
    .speech {
        width: 3rem;
        height: 3rem;
    }
}
.type-container {
    .step0 {
        .text {
            flex-direction: column;
            .title {
                width: 14rem;
                .speech {
                }
            }
            .intro {
                margin-top: 0.8rem;
            }
        }
        .content {
            flex-direction: column;
            gap: 2rem;
            .icon {
            }
            .col {
                width: 80%;
                .intro-step {
                    padding: 2rem 3rem 0;
                }
                img {
                }
            }
            .arrow {
                rotate: 90deg;
            }
        }
        .action {
            .self-btn {
                font-size: x-large;
                width: 220px;
                height: 60px;
            }
        }
    }
    .step1 {
        padding: 2rem 2rem;
        .color_back {
            /deep/ .ant-checkbox-wrapper span {
                padding: 0 0.2rem;
            }
        }
        .hue_class {
            height: 3rem;
        }
        .hue_class p {
            width:2rem;
            height:2rem;
        }
        .action {
            gap: 0.5rem;
            .selected_class p {
                width: 3rem;
                height: 3rem;
            }
            .end-btn {
                display: none;
            }
        }
        .phone-end-btn {
            display: block;
            margin: 1rem auto 2rem;
            width: 9rem;
            font-size: x-large;
            height: 3rem;
        }
    }
    .step2 {
        .content-action {
        }
        .content {
            .color_back {
            }
            .stripe_class {
            }
            .stripe_class img {
            }
        }
        .phone-action {
            .selected_class img {
            }
        }
        .phone-end-btn {
        }
    }
    .step3 {
        padding: 2rem 2rem;
        .color_back {
            gap: 0;
        }
        .image_class {
            height: 4rem;
        }
        .image_class img {
            width:3.5rem;
            height:3.5rem;
        }
        .action {
            margin-top: 2rem;
            gap: 0.5rem;
            padding: 0.8rem;
            .selected_class img {
                width: 3.5rem;
                height: 3.5rem;
            }
            .end-btn {
                display: none;
            }
        }
        .phone-end-btn {
            display: block;
            margin: 1rem auto 2rem;
            width: 9rem;
            font-size: x-large;
            height: 3rem;
        }
    }
    .step4 {
        .finish-text {
        }
        .action {
            margin-top: 1rem;
        }
        .btn1, .btn2 {
            height: 4rem;
            font-size: 1.6rem;
            max-width: 140px;
        }
    }
}
}
</style>