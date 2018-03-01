<template>
    <div id="body" :class="{isweixin:!isWeiXin}">
       <div class="list">
           <div class="item flexbox first">
               <div class="left flexbox align-items">
                    头像
               </div>
               <div class="right flex flexbox align-items">
                    <label for="file1">
                        <div id="imgSrc" class="logo" :style="{'backgroundImage': 'url(' + logo + ')'}"></div>
                    </label>    
                    <input class="file" id="file1" type="file" accept="image/*" capture="camera" @change="addListenerUP($event)">
               </div>
           </div>
           <div class="item flexbox">
               <div class="left flexbox align-items">
                    昵称
               </div>
               <div class="right flex flexbox align-items">
                   <input type="text" placeholder="请输入" v-model="name" maxlength="10">
               </div>
           </div>
           <div class="item flexbox last">
               <div class="left flexbox align-items">
                    性别
               </div>
               <div class="right flex flexbox align-items">
                    <div class="girl" :class="{orange:gender==2}" @click="gender=2">
                        <i class="iconfont icon-woman"></i>
                        <span>女</span>
                    </div>
                    <div class="boy" :class="{orange:gender==1}" @click="gender=1">
                        <i class="iconfont icon-man"></i>
                        <span>男</span>
                    </div>
               </div>
           </div>
       </div>
       <div class="list list2">
           <div class="item flexbox last">
               <div class="left flexbox align-items">
                    电话
               </div>
               <div class="right flex flexbox align-items">
                    {{userInfo.mobile | ellipsisMobile}}
               </div>
           </div>
       </div>
       <div class="btn">
           <div @click="updateUserInfo()">保存</div>
       </div>  
       <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import myPromise from 'js/tools.js';
import {Common, valid, storage} from 'js/common'
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
import request from 'js/interface/request';
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
Common.setFullScreen();
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
            isWeiXin: '',
            userInfo: '', // 数据
            logo: require('./images/img.png'),
            img_change: false, // 判断img路径是否变化
            gender: '', //性别
            name: ''
        }
    },
    created () {
    },
    mounted () {
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.isWeiXin = valid.isWeiXin();
        this.ins();
    },
    computed: {
    },
    methods: {
        //初始化
        ins () {
            let userInfo = storage.get('userInfo');
            if (userInfo) {
                this.userInfo = JSON.parse(userInfo);
                console.log(this.userInfo)
                if (this.userInfo.gender) {
                    this.gender = this.userInfo.gender;
                } else {
                    this.gender = 2;
                }
                if (this.userInfo.nickName) {
                    this.name = this.userInfo.nickName; // 啊昵称
                }
                if (this.userInfo.logo) {
                    this.logo = this.userInfo.logo;
                }
            }
        },
        // 图片选择
        addListenerUP (e) {
            this.isTakeShow = false;
            this.isExamle = false;
            let file = e.target.files[0];
            let maxSize = 500 * 1024;// 1MB
            let isCompress = true;// 默认压缩
            if (file.size <= maxSize) {
                isCompress = false;
            }
            let reader = new window.FileReader();
            let that = this;
            reader.onload = function (e) {
                that.compress(this.result, isCompress);
            }
            reader.readAsDataURL(file);
        },
        // 压缩
        compress (res, isCompress) {
            if (!isCompress) {
                // 不压缩
                this.logo = res;
                this.img_change = true; // img路径以变化
                return;
            } else {
                // 压缩
                let img = new window.Image();
                let maxW = 300;
                img.src = res;
                img.onload = () => {
                    let cvs = document.createElement('canvas');
                    let ctx = cvs.getContext('2d');
                    if (img.width > maxW) {
                        img.height *= maxW / img.width;
                        img.width = maxW;
                    }
                    cvs.width = img.width;
                    cvs.height = img.height;
                    ctx.clearRect(0, 0, cvs.width, cvs.height);
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    var dataUrl = cvs.toDataURL('image/jpg', 1);
                    this.logo = dataUrl;
                    this.img_change = true; // img路径以变化
                };
            }
        },
        // 修改信息
        updateUserInfo () {
            let logo = '';
            if (this.img_change) {
                logo = this.logo;
            }
            if (this.name.length === 0) {
                this.showtoast('昵称不能为空', true);
                return false;
            }
            if (!valid.userName(this.name)) {
                this.showtoast('昵称为中文！', true);
                return false;
            }
            this.loading = true;
            let obj = {
                userId: Common.getUserId(),
                gender: this.gender,
                nickName: this.name,
                userLogoImgBase64: logo // imgurl
            }
            console.log(obj)
            if (this.loading) {
                request.updateUserInfo(obj, (response) => {
                    this.multiLogin(response);
                    console.log(response.data)
                    if (response.data.respCode === '000000') {
                        this.showtoast(response.data.respMsg, true);
                        setTimeout(() => {
                            window.location.href = 'FQpersonal.html';
                            return false;
                        }, 500)
                    }
                    this.loading = false;
                }, () => {
                    this.loading = false;
                    this.showtoast('网络错误，请查看网络是否连接', true);
                })
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
        //弹窗调登录页面
        alertShow (value) {
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    storage.set('prevPage', './FQuserData.html');
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        //多点登陆
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
    },
    filters: {
        ellipsisMobile (value) {
            if (value) {
                return value.substr(0, 3) + '****' + value.substr(7, 4);
            } else {
                return value;
            }
        }
    }
}
</script>
