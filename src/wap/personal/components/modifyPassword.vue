<template>  
    <div class="g-modify_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div class="g_modify_head flexbox align-items">
            <i class="iconfont">&#xe61c;</i>
            <span>验证码将发送已绑定手机<span v-text="mobile"></span></span>
        </div>
        <div class="g_modify_list">
            <div class="item flexbox align-items">
                <div class="flex">
                    <input type="text" v-model="verify" placeholder="请输入验证码">
                </div>
                <span class="green" v-show="isGeting" @click="gets">获取验证码</span>
                <span class="green" v-show="!isGeting"><span v-text="time"></span>秒</span>
            </div>
            <div class="item flexbox align-items noborder">
                <div class="flex">
                    <input v-show="seepassword" type="password" v-model="password" placeholder="新密码（6-20位数字、字母组合）">
                    <input v-show="!seepassword" type="text" v-model="password" placeholder="新密码（6-20位数字、字母组合）">
                </div>
                <span class="fr" @click="seepassword=!seepassword">
                    <i class="iconfont" v-show="!seepassword">&#xe636;</i>
                    <i class="iconfont"  v-show="seepassword">&#xe635;</i>
                </span>
            </div>
        </div>
        <footer class="g_modify_footer">
            <div class="btn" @click="subm">确定</div>
        </footer>
           <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
// 修改密码
import request from 'js/interface/request';
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import headerCommon from '../../../components/headerCommon.vue';
import { Common, valid, storage } from 'js/common.js';
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
            isGeting: true, // 获取验证码
            time: 60, // 倒计时
            isTimeout: false, // 是否超时
            seepassword: 'true',
            password: '', // 密码
            verify: '', // 验证码
            mobile: '', // 用户手机
            output: '',
            title: '重置密码',
            isWeiXin: false
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '修改密码';
    },
    mounted () {
        this.getData(); // 获取数据
    },
    computed: {
    },
    methods: {
        getData () {
            this.output = JSON.parse(storage.get('userInfo'))
            this.mobile = this.output.mobile;
        },
        gets () { // 获取验证码
            var obj = {
                bizType: 12, // 发送验证码
                codeType: 1,
                mobile: this.mobile
            }
            request.getVerifyCode(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.showtoast('验证码已发送至手机，请注意查收', true);
                    console.log(response.data.output.smsCode);
                    this.isGeting = !this.isGeting;
                    this.time60();
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
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
        subm () {
            if (this.isTimeout) {
                this.showtoast('请重新获取验证码', true);
                return;
            }
            if (this.verify.length < 1) {
                this.showtoast('请输入验证码', true);
                return;
            }
            if (this.password.length < 1) {
                this.showtoast('请输入密码', true);
                return;
            }
            if (!valid.password(this.password)) {
                this.showtoast('密码格式错误,不能是纯数字或纯英文', true);
                return;
            }
            this.sumPassword();
        },
        sumPassword () {
            var obj = {
                userId: Common.getUserId(), // 用户ID
                newPwd: this.password, // 现在登录密码
                resetType: 2, // 1：未设置过登录密码不要求传验证码2：已设置登录密码必须要求传验证码
                smsCode: this.verify
            }
            request.resetLoginPwd(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true);
                    setTimeout(() => {
                        this.$router.replace('accountSecurity');
                    }, 1800)
                } else {
                    console.log(response.data)
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                console.log(error)
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
