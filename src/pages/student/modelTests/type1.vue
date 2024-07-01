<template>
    <div class="type-container">
        <div v-if="current===0" class="step0">
            <div class="text">
                <div class="title">
                    <span v-html="addPinyin('游戏介绍')"></span>
                    <span class="speech" v-if="showBtn" @click="speech">
                        <img src="@/assets/student/laba.png" alt="">
                    </span>
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
                <span class="speech" v-if="showBtn" @click="speech('选10个你喜欢的颜色')">
                    <img src="@/assets/student/laba.png" alt="">
                </span>
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
                <a-button class="btn-student end-btn" v-html="addPinyin('完成')" :disabled="selectedColors.length!=10" @click="startTest(2)"></a-button>
            </div>
        </div>
        <div v-else-if="current===2" class="step2">
            <div class="title">
                <span class="speech" v-if="showBtn" @click="speech('选5个你喜欢的组合')">
                    <img src="@/assets/student/laba.png" alt="">
                </span>
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
                    <a-button class="btn-student end-btn" v-html="addPinyin('完成')" :disabled="selectedStripes.length!=5" @click="startTest(3)"></a-button>
                </div>
            </div>
        </div>
        <div v-else-if="current===3" class="step3">
            <div class="title">
                <span class="speech" v-if="showBtn" @click="speech('选5个你喜欢的图片')">
                    <img src="@/assets/student/laba.png" alt="">
                </span>
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
                <a-button class="btn-student end-btn" v-html="addPinyin('完成')" :disabled="selectedImages.length!=5" @click="startTest(99)"></a-button>
            </div>
        </div>
        <div v-else-if="current===99" class="step4">
            <div class="showoff">
                <img src="@/assets/student/success.png" alt="">
                <div class="finish-text" v-html="addPinyin('完成啦！')"></div>
            </div>
            <div class="action">
                <a-button class="btn-student btn1 mr" v-html="addPinyin('返回首页')" @click="backHome"></a-button>
                <a-button class="btn-student btn2 ml" v-html="addPinyin('查看结果')" @click="viewReport"></a-button>
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
        characterId: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            current: 0,
            type: this.$route.params.type || 1,
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
    },
    methods: {
        speech(text='让我们一起玩一个选颜色的游戏，游戏很简单，只需要三步。你要按照提示选择你喜欢的，准备好了吗？让我们开始游戏吧！') {
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = text;
            speechSynthesis.speak(utterance);
        },
        startTest(num) {
            this.current = num;
            let params = {};
            if (num === 99) {
                const {selectedColors, selectedStripes, selectedImages} = this;
                const groupedColors = _.groupBy(selectedColors, 'hue');
                const sortedGroups = _.orderBy(Object.entries(groupedColors), ([, value]) => value.length, 'desc');
                const longestGroup = sortedGroups[0][1];
                params = {
                    hue: longestGroup[0].hue,
                    phase: 'R',
                    open: '中',
                    sense: '理性',
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
            this.$router.push({name: 'studentIndex'});
        },
        viewReport() {
            this.$router.push({name: 'studentReport'});
        },
    }
}
</script>

<style lang="less" scoped>
.title {
    span {
        font-size: 36px;
        color: #fff;
    }
    .speech {
        cursor: pointer;
        margin-right: 12px;
    }
}
.type-container {
    .step0 {
        padding: 84px;
        .text {
            margin-top: 64px;
            display: flex;
            justify-content: space-evenly;
            .title {
                font-size: 60px;
                color: #63C5E9;
                width: 600px;
                .speech {
                    margin-left: 12px;
                }
            }
            .intro {
                font-size: 32px;
            }
        }
        .content {
            margin-top: 64px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 48px;
            .icon {
                position: relative;
                top: -37px;
                left: 120px;
                width: 72px;
                padding: -6px;
                text-align: center;
                border-radius: 50%;
                font-size: 48px;
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
                box-shadow: 0 8px 18px rgba(0, 0, 0, 0.09);
                background-color: #fff;
                border-radius: 24px;
                height: 370px;
                .intro-step {
                    width: 320px;
                    text-align: center;
                    border-radius: 24px;
                    font-size: 36px;
                    padding: 0 24px;
                }
                img {
                    margin: 30px 60px;
                    width: 210px;
                }
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
        height: calc(100vh - 64px);
        padding: 32px 84px;
        background-color: rgb(128, 128, 128);
        .color_back {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            padding: 24px 0 12px;
        }
        .hue_class {
            height: 80px;
        }
        .hue_class p {
            display: inline-block;
            width:60px;
            height:60px;
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
            border-radius: 24px;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            flex-wrap: wrap;
            padding: 24px 24px 10px;
            min-height: 146px;
            gap: 24px;
            .selected_class p {
                width: 80px;
                height: 80px;
                border-radius: 6px;
            }
            .end-btn {
                margin-left: auto;
                width: 180px;
            }
        }
    }
    .step2 {
        height: calc(100vh - 64px);
        padding: 32px 84px;
        background-color: rgb(128, 128, 128);
        .content-action {
            display: flex;
        }
        .content {
            .color_back {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                padding: 24px 0 12px;
                gap: 24px;
            }
            .stripe_class {
                height: 80px;
                vertical-align: middle;
            }
            .stripe_class img {
                width:150px;
                height:70px;
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
            flex: 0 0 224px;
            border: 2px solid #fff;
            border-radius: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            margin-top: 24px;
            padding: 24px 24px;
            gap: 24px;
            .selected_class img {
                width: 160px;
                height: 80px;
                border-radius: 9px;
            }
            .end-btn {
                margin-top: auto;
                width: 180px;
            }
        }
    }
    .step3 {
        height: calc(100vh - 64px);
        padding: 84px;
        background-color: rgb(128, 128, 128);
        .color_back {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            padding: 24px 0 12px;
            gap: 24px;
        }
        .image_class {
            height: 80px;
            vertical-align: middle;
        }
        .image_class img {
            width:90px;
            height:90px;
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
            margin-top: 64px;
            padding: 10px 24px 10px;
            min-height: 146px;
            gap: 24px;
            .selected_class img {
                width: 96px;
                height: 96px;
            }
            .end-btn {
                margin-left: auto;
                width: 180px;
            }
        }
    }
    .step4 {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        .finish-text {
            margin-left: 48px;
            font-size: 64px;
            color: #FA7800;
        }
        .btn1 {
            width: 300px;
        }
        .btn2 {
            width: 300px;
            background-color: #FA7800;
            margin-top: 60px;
        }
        .btn2:hover {
            border-color: #FA7800;
            color: #FA7800;
            background: none;
        }
    }
}
</style>