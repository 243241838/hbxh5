<template>
    <div id="body" :class="{isweixin:!isWeiXin}">
        <div class="head">
            <div class="white flexbox align-items justify-content">
                <div class="logo" :style="{'backgroundImage': 'url(' + logo + ')'}"></div>
            </div>
        </div>
        <div class="data">
            <div class="name flexbox justify-content">
                  <span v-if="output1.userNickname" v-text="output1.userNickname"></span>
                  <span v-else v-text="'hbx' + output1.userName"></span>
                  <i v-show="output1.userGender == '男'" class="iconfont icon-nanxing boy"></i>
                  <i v-show="output1.userGender == '女'" class="iconfont icon-nvxing girl"></i>
            </div>
            <div class="phone flexbox justify-content">
                <span>电话号码：</span>
                <span v-text="output1.userName"></span>
            </div>
        </div>
        <div class="list">
            <div class="item first flexbox">
                 <div class="left flexbox  align-items">
                     备注名
                 </div>
                 <div class="right flex flexbox  align-items">
                     <input type="text" placeholder="请输入" v-model="remarkNickame" maxlength="10">
                 </div>
                 <div class="icon flexbox align-items">
                     <i class="iconfont"></i>
                 </div>
            </div>
             <div class="item flexbox" @click="showAddress">
                <div class="left flexbox  align-items">所在地区</div>
                <div class="right flex flexbox align-items">
                    <span class="location1" v-text="areaName"></span>
                </div>
                 <div class="icon flexbox align-items">
                     <i class="iconfont icon-xiayibuchexianfenqi"></i>
                 </div>
            </div>
            <div class="item flexbox three">
                <div class="left flexbox align-items">详细地址</div>
                <div class="right flex">
                    <textarea rows="2" maxlength="27" placeholder="街道/楼盘号等" v-model="address"></textarea>
                </div>
                 <div class="icon flexbox align-items">
                     <i class="iconfont"></i>
                 </div>
            </div>
            <div class="item flexbox last">
                <div class="left flexbox align-items">其他</div>
                <div class="right flex">
                    <textarea rows="2" maxlength="40" placeholder="请输入其他备注信息" v-model="remarkComment"></textarea>
                </div>
                 <div class="icon flexbox align-items">
                     <i class="iconfont"></i>
                 </div>
            </div>
        </div>
        <div class="btn">
            <div @click="updateUserInfo()">保存</div>
        </div>
        <div v-if="isshowAddress" class="address" @click="isshowAddress=false;">
            <div class="bottom" @click.stop>
                <div class="select">
                    <div class="title">请选择所在地区<i class="iconfont icon-close" @click="isshowAddress=false;">&#xe629;</i></div>
                    <div class="select-list flexbox">
                        <div class="select-item">
                            <span @click="selectProvince" :class="{'item-green':selected==0}" class="item" v-text="province"></span>
                        </div>
                        <div class="select-item">
                            <span @click="selectCity" :class="{'item-green':selected==1}" class="item" v-text="city"></span>
                        </div>
                        <div class="select-item">
                            <span :class="{'item-green':selected==2}" class="item" v-text="area"></span>
                        </div>
                    </div>
                </div>
                <div class="scroll">
                    <div class="cell" v-for="item in output" v-text="item.areaName" @click="selectCell(item.areaId)"></div>
                </div>
            </div>
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
            logo: require('./images/img.png'),
            output: '', // 地址
            output1: '', // 数据
            newAreaName: '',
            remarkNickame: '', // 备注昵称
            areaName: '省、市、区', //备注所在地区
            areaName1: '', //备份地区
            address: '', // 备注详细地址
            remarkComment: '', // 备注其他内容
            isshowAddress: false,
            selectedProviceId: '', // 选择的省id
            selectedProviceName: '', // 选择的省名称
            selectedCityArr: '', // 选择的省下的市
            selected: 0,
            province: '请选择', // 省
            city: '', // 市
            area: '', // 区
            arr: [],
            areaId: '' // 所在地区区号
        }
    },
    created () {
    },
    mounted () {
        this.isWeiXin = valid.isWeiXin();
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.getData();
    },
    computed: {
    },
    methods: {
        //获取客户资料
        getData () {
            let output = storage.get('userRemarksPoRecord');
            if (output) {
                output = JSON.parse(output);
                console.log(output)
                this.output1 = output;
                this.remarkNickame = this.output1.remarkNickame; // 备注昵称
                if (this.output1.userLogo) {
                    this.logo = this.output1.userLogo;
                }
                if (this.output1.remarkFullName) {
                    this.areaName = this.output1.remarkFullName; // 备注所在地区
                }
                this.areaName1 = this.output1.remarkFullName; // 备注所在地区 （备份地区）
                this.address = this.output1.remarkAreaAddress; // 备注详细地址
                this.remarkComment = this.output1.remarkComment; // 备注其他内容
            }
        },
        // 初始化地址
        showAddress () {
            this.isshowAddress = true;
            this.selectProvince();
        },
         // 省
        selectProvince () {
            this.city = '';
            this.area = '';
            this.province = '请选择'
            this.selected = 0;
            this.newAreaName = '';
            let obj = {
                parentId: '0'
            }
            request.getAreaList(obj, (response) => {
                // 账户已经在其他设备上登录
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    this.output = response.data.output.areasList;
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        selectCity () {
            this.city = '请选择';
            this.area = '';
            this.selected = 1;
            this.newAreaName = this.selectedProviceName;
            this.output = this.selectedCityArr;
            this.selectCell(this.selectedProviceId);
        },
        // 选择市，区
        selectCell (areaId) {
            this.output.map((item) => {
                if (item.areaId === areaId) {
                    this.arr.push(item.areaId)
                    if (item.children.length === 0) {
                        this.isshowAddress = false;
                        this.newAreaName += item.areaName;
                        this.areaName = this.newAreaName;
                        this.areaId = areaId;// 区号
                    } else {
                        this.output = item.children;
                        this.newAreaName += item.areaName;
                    }
                    if (this.selected === 0) {
                        this.province = item.areaName;
                        this.city = '请选择'
                        this.selectedProviceId = areaId;// 选择的省的id
                        this.selectedProviceName = item.areaName;// 选择的省的名称
                        this.selectedCityArr = item.children;// 保存选择的省下的市
                    } else if (this.selected === 1) {
                        this.city = item.areaName;
                        this.area = '请选择';
                    }
                    this.selected++;
                }
            })
            console.log(this.arr)
            console.log(this.areaId)
        },
        // 修改信息
        updateUserInfo () {
            if (this.remarkNickame.length > 0 && !valid.cneeName(this.remarkNickame)) {
                this.showtoast('备注昵称为中文，长度1-10', true);
                return false;
            };
            if (this.remarkComment.length > 1 && !valid.else(this.remarkComment)) {
                this.showtoast('不允许输入特殊字符', true);
            }
            let areaId = '';
            //判断地址是否改变
            if (this.areaName !=='' && this.areaName !== this.areaName1) {
                areaId = this.areaId;
            }
            let obj = {
                userId: storage.get('userId'),
                remarkUserId: this.output1.userId, // 客户id
                nickName: this.remarkNickame,
                areaId: areaId,
                areaAddress: this.address,
                remarkComment: this.remarkComment
            }
            this.loading = true;
            console.log(obj)
            if (this.loading) {
                request.updateCustomerManage(obj, (response) => {
                    this.multiLogin(response);
                    console.log(response.data)
                    if (response.data.respCode === '000000') {
                        this.showtoast(response.data.respMsg, true);
                        setTimeout(() => {
                            window.location.replace('FQmanageCustomer.html?userId=' + this.output1.userId)
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
                    storage.set('prevPage', './FQclienteleData.html');
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
