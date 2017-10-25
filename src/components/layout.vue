<template>
    <div class="layout">
        <!-- 头部 -->
        <div class="header">
            <h2>大学英语四、六级成绩查询</h2>
            <p>仅限查询2017年上半年考试成绩。</p>
        </div>

        <!-- 内容容器 -->
        <div class="container clearfix">
            <div class="form">
                <div class="title"><i class="icon-sousuo"></i>查询入口</div>
                <div class="name">
                    <label for="input_name">输入你的姓名:</label>
                    <input type="text" id="input_name" v-model="input_name">
                </div>
                <div class="number">
                    <label for="input_number">输入你的准考证号:</label>
                    <input type="text" id="input_number" v-model="input_number">
                </div>
                <div class="btn">
                    <button @click="search">查询</button>
                </div>
            </div>
            <div class="api-doc">
                <div class="title"><i class="icon-tishishuoming"></i>API接口</div>
                <div class="content">
                    <p>URL: https://cet.lenshen.com/api/search?user=姓名&number=准考证号</p>
                    <p>请求方式: GET</p>
                    <p>请求成功返回json:</p>
<pre>
{
    "code":200, 
    "message":"查询成功",
    "data":
            { 
                "name":"张三",
                "school":"南昌大学",
                "type":"英语六级",
                "number":"360021162347654",
                "total":"530",
                "listen":"170",
                "read":"200",
                "writing":"160"
            }
}
</pre>
                    <p>请求失败返回json:</p>
<pre>
{
    "code":400, 
    "message":"失败,请检查你的信息是否无误"
}
</pre>
                </div>  
            </div>
        </div>

        <div class="footer">
            <p>copyright @ 2017 by caiyang</p>
        </div>

        <!--模态框  -->
        <transition name="fade">
            <div class="mask" v-if="maskShowing">
                <div class="wrap">
                    <div class="close" @click="close">Ｘ</div>
                    <div class="content">
                        <p>姓名: {{result.data.name}}</p>
                        <p>学校: {{result.data.school}}</p>
                        <p>考试级别: {{result.data.name}}</p>
                        <p>总分: {{result.data.total}}</p>
                        <p>听力: {{result.data.listening}}</p>
                        <p>阅读: {{result.data.read}}</p>
                        <p>写作: {{result.data.writing}}</p>
                    </div>
                </div>
            </div>
        </transition>

        <!--loading动画  -->
        <div class="loading-wrap" v-show="isLoading">
            <loading></loading>
        </div>
    </div>
</template>

<script>
import loading from './loading';
import axios from 'axios';

export default {
    data () {
        return {
            maskShowing: false,
            isLoading: false,
            input_name: '',
            input_number: '',
            result: {}
        };
    },
    methods: {
        close () {
            this.maskShowing = false;
        },
        search () {
            this.isLoading = true;

            if (/\D/g.test(this.input_number)) {
                alert('准考证号只能输入数字');
                return;
            } else if (this.input_number.length !== 15) {
                alert('请输入15位准考证号!');
                return;
            }

            axios.get('http://127.0.0.1:8081/api/cet', {
                params: {
                    xm: encodeURI(this.input_name),
                    zkzh: this.input_number
                }
            }).then(res => {
                this.isLoading = false;

                this.result = res.data;
                if (this.result.code === 200) {
                     this.maskShowing = true;
                } else if (this.result.code === 400) {
                    alert(this.result.msg);
                }
            });
        }
    },
    components: {
        loading
    }
}
</script>

<style lang="stylus">
    m_color = skyblue
    .layout
        .header
            color #fff
            line-height 32px
            text-align center
            background url('../assets/bg.jpg') no-repeat center 0
            padding 50px
            margin-bottom 20px
            h2
                font-size 28px
            p
                font-size 16px
        .container
            width 80%
            margin 0 auto
            padding-bottom 60px
            .form, .api-doc
                display inline-block
                width 49%
                .title
                    font-size 16px
                    padding-bottom 10px
                    margin-bottom 20px
                    border-bottom 2px solid m_color
                    [class^="icon"]
                        margin-right 8px
            .form
                float left
                .name, .number
                    margin-bottom 20px
                    label
                        margin-bottom 10px
                    font-size 16px
                    input 
                        display block
                        width 100%
                        margin-top 10px
                        font-size 14px
                        line-height 28px
                        border-radius 4px
                        border 1px solid m_color
                .btn
                    button
                        width 100%
                        height 40px
                        border-radius 4px
                        border none
                        background m_color
                        font-size 18px
                        font-weight blod
                        cursor pointer
                        color #fff
                        outline none 
                        transition border 0.3s, background 0.3s, color 0.3s
                        &:hover
                            border 1px solid m_color 
                            background #fff
                            color m_color
            .api-doc
                float right
                .content
                    overflow auto
                    background m_color
                    border-radius 8px
                    padding 10px
                    color #fff
                    p
                        font-size 14px
                        line-height 24px
        .footer
            position fixed
            left 0
            bottom 0
            width 100%
            height 50px
            line-height 50px
            text-align center
            color #fff
            background #1a1a1a
        .loading-wrap
            position fixed
            left 50%
            top 50%
            transform translate(-50%, -50%)
        .mask
            position fixed
            left 0
            top 0
            width 100%
            height 100%
            background-color rgba(0, 0, 0, 0.6)
            .wrap
                position absolute
                left 50%
                top 50%
                padding 32px 32px 10px 10px
                background-color #fff
                border-radius 6px
                transform translate(-50%, -50%)
                .close
                    position absolute
                    right 10px
                    top 10px
                    font-size 22px
                    cursor pointer
                    transition color 0.3s
                    &:hover
                        color red
                .content
                    clear both
                    p
                        font-size 16px
                        line-height 32px
    .fade-enter-active, .fade-leave-active
        transition opacity 0.3s
    .fade-enter, .fade-leave-to
        opacity 0
</style>
