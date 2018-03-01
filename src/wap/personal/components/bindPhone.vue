<template>  
    <div :class="{'box': isWeixin}">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div class="cell-list">
            <div class="cell">
                <input class="cell-input" type="text" placeholder="请输入手机号" v-model="phone">
                <span v-show="isGeting" class="green-span" @click="verify">获取验证码</span>
                <span v-show="!isGeting" class="green-span"><span v-text="time"></span>秒</span>
            </div>
            <div class="cell bordertop">
                <input class="cell-input" type="text" placeholder="验证码" v-model="smsCodeNew">
            </div>
        </div>
        <div style="height:30px;width:0px;"></div>
        <div class="button" @click="commit">确定</div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
// 修改密码
import request from 'js/interface/request';
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import { Common, valid, storage } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        toast,
        loading,
        headerCommon
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: false,
            phone: '', // 手机号
            smsCodeNew: '', // 验证码
            time: 60, // 倒计时
            isGeting: true, // 验证码切换
            isWeixin: false,
            title: '绑定手机'
        }
    },
    created () {
        this.isWeixin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '绑定手机';
    },
    mounted () {
    },
    methods: {
        verify () {
            // 判断是否为手机号码
            if (valid.phone(this.phone)) {
                this.getVerifyCode();
            } else {
                if (this.phone.length === 0) {
                    this.showtoast('请输入手机号码', true)
                } else {
                    this.showtoast('手机号码格式有误', true)
                }
            }
        },
        // 获得验证码
        getVerifyCode () {
            var data = {
                bizType: '15', // 修改绑定手机
                mobile: this.phone,
                codeType: '1' // 短信验证码
            }
            request.getVerifyCode(data, (response) => {
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    this.showtoast('验证码已发送至手机，请注意查收', true);
                    this.isGeting = !this.isGeting;
                    this.time60();// 倒计时
                } else {
                    this.showtoast('获得验证码失败', true)
                }
            }, (error) => {
                this.showtoast(error, true)
            })
        },
         // 倒计时
        time60 () {
            this.isGeting = false;// 切换倒计时和获得验证码
            this.isTimeout = false;// 是否超时
            let timer = setInterval(() => {
                this.time--;
                if (this.time === 0) {
                    this.time = 60;
                    this.isGeting = true;
                    this.isTimeout = true;// 超时
                    clearInterval(timer);
                }
            }, 1000);
        },
        // 确定
        commit () {
            if (this.isTimeout) {
                this.showtoast('请重新获取验证码', true);
                return;
            }
            if (!valid.phone(this.phone)) {
                this.showtoast('手机号码格式有误', true);
                return;
            }
            if (this.smsCodeNew.length === 0) {
                this.showtoast('请输入验证码', true);
                return;
            }
            let obj = {
                userId: Common.getUserId(), // 用户ID
                // loginPwd: '123', // 登录密码
                mobile: this.phone, // 新手机号码
                smsCodeNew: this.smsCodeNew // 新手机号短信验证码
            }
            request.updateMobile(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true);
                    let userInfo = JSON.parse(storage.get('userInfo'));
                    userInfo.mobile = this.phone;
                    userInfo.userName = this.phone;
                    storage.set('userInfo', JSON.stringify(userInfo));
                    setTimeout(() => {
                        this.$router.replace('accountSecurity');
                    }, 1800)
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 显示提示框
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>
