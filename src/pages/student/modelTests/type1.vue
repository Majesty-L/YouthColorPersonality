<template>
    <div class="type-container">
        <div v-if="current===0" class="step0">
            <div class="text">
                <div class="title">
                    <span v-html="addPinyin('游戏介绍')"></span>
                    <a-button @click="speech">朗读</a-button>
                </div>
                <div class="intro">
                    <span v-html="addPinyin('让我们一起玩一个选颜色的游戏，游戏很简单，只需要三步。你要按照提示选择你喜欢的，准备好了吗？让我们开始游戏吧！')"></span>
                </div>
            </div>
            <div class="content">
                <div class="col col1">
                    <div class="icon icon1">1</div>
                    <div v-html="addPinyin('选10个你喜欢的颜色')"></div>
                    <img src="" alt="">
                </div>
                <div class="arrow">
                    <img src="" alt="">1
                </div>
                <div class="col col1">
                    <div class="icon icon1">1</div>
                    <div v-html="addPinyin('选10个你喜欢的组合')"></div>
                    <img src="" alt="">
                </div>
                <div class="arrow">
                    <img src="" alt="">1
                </div>
                <div class="col col1">
                    <div class="icon icon1">1</div>
                    <div v-html="addPinyin('选10个你喜欢的图片')"></div>
                    <img src="" alt="">
                </div>
            </div>
            <div class="action">
                <a-button v-html="addPinyin('开始游戏')" @click="startTest(1)"></a-button>
            </div>
        </div>
        <div v-else-if="current===1" class="step1">
            <div class="title">
                <a-button>朗读</a-button>
                <span v-html="addPinyin('选10个你喜欢的颜色')"></span>
            </div>
            <div class="content"></div>
            <div class="action">
                <a-button v-html="addPinyin('完成')" @click="startTest(2)"></a-button>

            </div>
        </div>
        <div v-else-if="current===2" class="step2">
            <div class="title">
                <a-button>朗读</a-button>
                <span v-html="addPinyin('选10个你喜欢的组合')"></span>
            </div>
            <div class="conten-action">
                <div class="content"></div>
                <div class="action">
                <a-button v-html="addPinyin('完成')" @click="startTest(3)"></a-button>

                </div>
            </div>
        </div>
        <div v-else-if="current===3" class="step3">
            <div class="title">
                <a-button>朗读</a-button>
                <span v-html="addPinyin('选10个你喜欢的图片')"></span>
            </div>
            <div class="content"></div>
            <div class="action">
                <a-button v-html="addPinyin('完成')" @click="startTest(99)"></a-button>

            </div>
        </div>
        <div v-else-if="current===99" class="step4">
            <div class="showoff">
                <img src="" alt="">
                <div class="" v-html="addPinyin('完成啦！')"></div>
            </div>
            <div class="action">
                <a-button v-html="addPinyin('返回首页')" @click="backHome"></a-button>
                <a-button v-html="addPinyin('查看结果')" @click="viewReport"></a-button>
            </div>
        </div>
    </div>
</template>

<script>
import { html } from 'pinyin-pro';
export default {
    name: 'TestStepPage',
    components: {
    },
    data() {
        return {
            current: 0,
            type: this.$route.params.type || 1,
            addPinyin: html,
        };
    },
    methods: {
        speech() {
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = '让我们一起玩一个选颜色的游戏，游戏很简单，只需要三步。你要按照提示选择你喜欢的，准备好了吗？让我们开始游戏吧！';
            speechSynthesis.speak(utterance);
        },
        startTest(num) {
            this.current = num;
            this.$emit('changeCur', num);
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
.type-container {
    .step0 {
        .text {
            margin-top: 64px;
            display: flex;
            justify-content: space-evenly;
        }
        .content {
            margin-top: 64px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 48px;
        }
        .action {
            display: flex;
            justify-content: center;
        }
    }
    .step1 {

    }
}
</style>