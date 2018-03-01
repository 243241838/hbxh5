<template>  
    <div id="body" :class="{isShow:!isWeiXin}">
        <div class="text" :class="{text1:FQnewRegist.userFlag==2}">
            <div class="data flexbox flex-column justify-content align-items">
                <div>Hi<span v-text="FQnewRegist.realName"></span></div>
                <div v-text="FQnewRegist.userName"></div>
            </div>
            <div class="btn" @click="sub()">确定</div>
        </div>
       <div class="layer-shade alert" v-show="alert" :class="{padding_top:!isWeiXin}">
          <div class="center">
               <div class="close fr" @click="close()"></div>
               <div class="flexbox btn">
                   <div class="flex" @click="href_url()"></div>
                   <div class="flex" @click="close()"></div>
               </div>
          </div>
       </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <totast :isshow='totast.isshow' @ontoastback='closetoast'>{{ totast.message}}</totast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import {Common, valid, storage} from 'js/common'
import totast from '../../components/toast' // totast引用：
import loading from '../../components/loading';
import request from 'js/interface/request';
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        totast,
        loading,
        layer
    },
    data () {
        return {
            totast: { // totast引用
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
            loading: false,
            alert: false, // 弹窗
            isWeiXin: '',
            FQnewRegist: '' // 个人信息

        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        this.ins();
    },
    mounted () {
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    computed: {
    },
    methods: {
        // 初始化
        ins () {
            if (storage.get('mobile') && storage.get('isNewMan')) {
                storage.remove('isNewMan')
                this.FQnewRegist = JSON.parse(storage.get('FQnewRegistdata'));
            } else if (storage.get('mobile')) {
                var realName = '';
                if (storage.get('FQnewRegistdata')) {
                    realName = JSON.parse(storage.get('FQnewRegistdata')).realName;
                }
                let userInfo = {
                    realName: realName,
                    userName: storage.get('mobile')
                }
                this.FQnewRegist = userInfo;
                this.FQnewRegist.userFlag = 2;
            }
        },
        initWeixinSDK () {
            let obj = {
                url: window.location.href
            }
            request.getWXJsAPISignature(obj, (response) => {
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (window.wx) {
                        // 微信配置
                        weixinSDK.config(window.wx, output);
                        weixinSDK.ready(window.wx, () => {
                            // 判断当前客户端版本是否支持指定JS接口
                            weixinSDK.checkJsApi(window.wx);
                            // 分享
                            weixinSDK.initShare(window.wx, 3);
                        });
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        sub () {
            if (parseInt(this.FQnewRegist.userFlag) === 1) {
                this.alert = true;
            } else {
                this.href_url(); // 老用户直接跳转
            }
        },
        // 跳转主页
        href_url () {
            window.location.href = 'FQcarInfo.html';
            return false;
        },
        // 关闭弹窗
        close () {
            this.alert = false;
        },
        showtoast (msg, isshow) { // totast引用：3.显示
            this.totast.message = msg;
            this.totast.isshow = isshow;
        },
        closetoast () {
            this.totast.isshow = false;
        },
        showLayer (msg, options) {
            // layer引用：3.显示弹框
            this.layer.type = options.type;
            this.layer.message = msg;
            this.layer.isshow = true;
            this.layer.shadeClose = options.shadeClose;
            this.layer.btns = options.btns;
            this.layer.yes = options.yes;
            this.layer.no = options.no;
        },
        alertShow (value) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        closeLayer (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        }
    }
}
</script>
