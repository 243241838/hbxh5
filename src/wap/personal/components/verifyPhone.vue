<template>  
    <div :class="{'g-verifyP_body': isWeiXin}">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div class="g_verifyP_list">
            <div class="item flexbox align-items">
                <div class="flex flexbox align-items" v-text="mobile"></div>
                <span class="green" v-show="isGeting" @click="getVerifyCode">获取验证码</span>
                <span class="green" v-show="!isGeting"><span v-text="time"></span>秒</span>
            </div>
            <div class="item flexbox align-items noborder">
                <input type="text" v-model="smsCode" placeholder="验证码">
            </div>
        </div>
        <footer class="g_verifyP_footer">
            <div class="btn" @click="commit">下一步</div>
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
            isGeting: true, // 获取验证码
            time: 60, // 倒计时
            isTimeout: false, // 是否超时
            smsCode: '', // 验证码
            mobile: '', // 用户手机啊
            isWeiXin: false,
            title: '身份验证'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '身份验证';
        this.mobile = JSON.parse(storage.get('userInfo')).mobile;
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        commit () {
            if (this.verify) {
                let obj = {
                    codeType: '1', // 短信验证码
                    userId: Common.getUserId(),
                    userName: this.mobile,
                    verifyCode: this.smsCode,
                    bizType: '13' // 发送短信验证码
                }
                console.log(obj)
                // 验证手机号码
                request.verifyCode(obj, (response) => {
                    if (response.data.respCode === '000000') {
                        // 确认支付页面跳过来
                        if (this.$route.query.tradeId) {
                            this.$router.push({name: 'edmitPayPassword', query: {tradeId: this.$route.query.tradeId, type: this.$route.query.type}});
                        } else if (this.$route.query.paymentConfirm) {
                            this.$router.push({name: 'edmitPayPassword', query: {paymentConfirm: this.$route.query.paymentConfirm}});
                        } else {
                            this.$router.push({name: 'edmitPayPassword', query: {prevPage: 'verifyPhone'}});
                        }
                    } else {
                        this.showtoast(response.data.respMsg, true);
                    }
                }, (error) => {
                    this.showtoast(error, true);
                })
            }
        },
        // 获得验证码
        getVerifyCode () {
            let obj = {
                bizType: '13',
                mobile: this.mobile,
                codeType: '1'
            }
            console.log(obj);
            request.getVerifyCode(obj, (response) => {
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    this.showtoast('获得验证码成功', true)
                    this.time60();
                } else {
                    this.showtoast('获得验证码失败', true)
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
        verify () {
            if (this.isTimeout) {
                this.showtoast('请重新获取验证码', true);
                return false;
            }
            if (this.smsCode.length === 0) {
                this.showtoast('请输入验证码', true);
                return false;
            }
            return true;
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
