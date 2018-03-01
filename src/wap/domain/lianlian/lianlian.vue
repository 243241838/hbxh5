<template>
    <div class="container">
        <div id="body">
            <ul class="list">
                <li class="flexbox align-items item">
                    <span>持卡人</span>
                    <input v-model="realName" class="flex" type="text" placeholder="请输入持卡人姓名">
                </li>
                <li class="flexbox align-items item bordertop">
                    <span>身份证</span>
                    <input v-model="idenNo" class="flex" type="text" placeholder="请输入身份证">
                </li>
            </ul>
            <div class="btn-box">
                <button @click="getPaySign">确定</button>
            </div>
            <form id="form" style="display:none;" action="https://wap.lianlianpay.com/authpay.htm">
                <input id="requestData" type="text" name="req_data" value='' />
                <input type="submit" vlaue="submit"/>
            </form>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import request from 'js/interface/request'
import { Common, valid, storage } from 'js/common.js';
import toast from 'components/toast';
import loading from 'components/loading';
export default {
    components: {
        toast,
        loading
    },
    data () {
        return {
            isWeiXin: false,
            loading: false,
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            },
            realName: '',
            idenNo: ''
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        Common.setFullScreen();
    },
    methods: {
        getPaySign () {
            if (!this.realName) {
                this.showtoast('请输入持卡人姓名', true)
                return;
            }
            if (!this.idenNo) {
                this.showtoast('请输入持卡人身份证', true)
                return;
            }
            if (!valid.ID(this.idenNo)) {
                this.showtoast('身份证号错误', true);
                return;
            }
            let obj = {
                realName: this.realName,
                idenNo: this.idenNo,
                tradeId: Common.getQueryString('tradeId'),
                paymentId: Common.getQueryString('paymentId'),
                domainPay: '1',
                domainUrl: storage.get('notifyUrl')
            }
            console.log(JSON.stringify(obj))
            this.loading = true;
            request.getPaySign(obj, (response) => {
                console.log(response);
                if (response.data.respCode === '000000') {
                    document.getElementById('requestData').value = JSON.stringify(response.data.output);
                    document.querySelector('#form').submit();
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.loading = false;
            }, () => {
                this.loading = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        showtoast (msg, isshow) {
            this.toast.isshow = isshow;
            this.toast.message = msg;
        },
        // 关闭提示框
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>
