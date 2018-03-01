<template>  
    <div id="body">
        <div id="head" class="flexbox align-items justify-content flex-column" :class="{isWeixin:isWeiXin}">
            <div class="img" @click="go_user()" :style="{'backgroundImage': 'url(' + logo + ')'}"></div>
            <div v-if="output.nickName" class="name"  v-text="output.nickName" style="text-align:center;"></div>
            <div v-else class="name"  v-text="'hbx' + output.userName" style="text-align:center;"></div>
            <div class="set" v-show= "isWeiXin" @click="go_user()">
                <i class="iconfont icon-shezhi"></i>
            </div>
        </div>
        <div class="list">
                <div class="item flexbox"  @click="go_url(1)">
                    <div class="flex flexbox">
                        <i class="iconfont icon-dingdan"></i>
                        <span>我的订单</span>
                    </div>
                    <span class="icon">
                        <i class="iconfont">&#xe61d;</i>
                    </span>
                </div>
                <div class="item flexbox" @click="go_url(2)">
                    <div class="flex flexbox">
                        <i class="iconfont">&#xe63e;</i>
                        <span>我的保单</span>
                    </div>
                    <div class="icon">
                        <i class="iconfont">&#xe61d;</i>
                    </div>
                </div>
                <div class="item flexbox" @click="go_url(3)" :class="{last:output.isBClient=='false'}">
                    <div class="flex flexbox">
                        <i class="iconfont icon-yaoqinghaoyou"></i>
                        <span>邀请好友</span>
                    </div>
                    <div class="icon">
                        <i class="iconfont">&#xe61d;</i>
                    </div>
                </div>
                <div class="item flexbox last" @click="go_url(4)" v-show="output.isBClient=='true'">
                    <div class="flex flexbox">
                        <i class="iconfont icon-kehuguanli"></i>
                        <span>客户管理</span>
                    </div>
                    <div class="icon">
                        <i class="iconfont">&#xe61d;</i>
                    </div>
                </div>
        </div>
        <div class="list">
             <a href="tel:4006786078">
                <div class="item flexbox last margin_top">
                    <div class="flex flexbox">
                        <i class="iconfont icon-dianhau1"></i>
                        <span>服务热线：400-678-6078</span>
                    </div>
                    <div class="icon">
                        <i class="iconfont">&#xe61d;</i>
                    </div>
                </div>
            </a>
        </div>
        <footer class="footer" @click="off()" v-show="!isWeiXin">
            退出登录
        </footer>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import {Common, valid, storage} from 'js/common'
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
import request from 'js/interface/request';
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        toast,
        loading,
        layer
    },
    data () {
        return {
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
            output: '',
            logo: require('./images/img.png'),
            isWeiXin: false
        }
    },
    created () {
    },
    mounted () {
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.isWeiXin = valid.isWeiXin();
        this.getData();
    },
    computed: {
    },
    methods: {
        //获取信息
        getData () {
            var data = {
                userId: Common.getUserId()
            }
            request.getUserInfo(data, (response) => {
                this.multiLogin(response)
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (output) {
                        this.output = response.data.output;
                        if (output.logo) {
                            this.logo = output.logo;
                        }
                        storage.set('userInfo', JSON.stringify(this.output));
                    }
                }
            }, (error) => {
                console.log(error)
                this.showtoast(error, true);
            })
        },
        // 注销登录
        off () {
            var data = {
                userId: Common.getUserId()
            }
            request.logout(data, (response) => {
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true)
                    storage.remove('userId');
                    storage.remove('userInfo');
                    storage.remove('sessionId');
                    storage.remove('mobile');
                    window.location.href = 'FQcarInfo.html';
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        //去个人信息
        go_user () {
            window.location.href = 'FQuserData.html';
            return false;
        },
        // 跳转页面
        go_url (number) {
            if (number === 1) {
                window.location.href = 'FQOrerList.html';
                return false;
            } else if (number === 2) {
                window.location.href = 'FQPolicyList.html';
                return false;
            } else if (number === 3) {
                window.location.href = 'FQinvite.html';
                return false;
            } else {
                window.location.href = 'FQcustomer.html';
                return false;
            }
        },
        //微信授权
        initWeixinSDK () {
            let obj = {
                url: window.location.href
            }
            request.getWXJsAPISignature(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (window.wx) {
                        // 微信配置
                        weixinSDK.config(window.wx, output);
                        weixinSDK.ready(window.wx, () => {
                            // 判断当前客户端版本是否支持指定JS接口
                            weixinSDK.checkJsApi(window.wx);
                            // 分享
                            weixinSDK.initShare(window.wx, 1);
                        });
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
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
        closeLayer (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        // 弹窗调登录页面
        alertShow (value) {
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    storage.set('prevPage', './FQpersonal.html');
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        // 多点登陆
        multiLogin (response) {
            if (response.data.respCode === '100106') {
                this.loading = false;
                if (valid.isWeiXin()) {
                    weixinSDK.getAccessNone(window.location.href);
                } else {
                    this.alertShow(response.data.respMsg)
                }
                return false;
            } else if (response.data.respCode !== '000000') {
                this.showtoast(response.data.respMsg, true);
            }
        }
    }
}
</script>
