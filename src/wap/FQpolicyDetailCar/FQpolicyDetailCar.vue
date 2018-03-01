<template>  
    <div id="body" :class="{isWeiXin:!isWeiXin}">
         <div class="head">
             <div class="top flexbox">
                 <div class="left flex">
                     <img :src="output.insurerLogo" alt="">
                     <P>
                        保单号：
                        <span v-text="output.policyId"></span>
                     </P>
                 </div>
                 <div class="right">
                     <img src="./images/img2.png" alt="" v-show="output.policySts==20">
                     <img src="./images/img3.png" alt="" v-show="output.policySts==30">
                     <img src="./images/img4.png" alt="" v-show="output.policySts==40">
                 </div>
             </div>
             <div class="bottom flexbox">
                  <div class="flex">支付保费</div>
                  <div v-text="(output.tradePremium/100).toFixed(2) + '元'"></div>
             </div>
         </div>
         <div class="list">
              <!--车辆信息-->
              <div v-for="item in output.insuredList">
                   <div class="head">车辆信息</div>
                   <div class="item flexbox">
                       <div class="left">车牌号码</div>
                       <div class="right flex flexbox flex-right" v-text="item.carInfo.licenseNo==0?'新车未上牌':item.carInfo.licenseNo"></div>
                   </div>
                    <div class="item flexbox">
                       <div class="left">车辆型号</div>
                       <div class="right flex flexbox flex-right" v-text="item.carInfo.vehicleModel"></div>
                   </div>
                    <div class="item flexbox">
                       <div class="left">车架号</div>
                       <div class="right flex flexbox flex-right" v-text="item.carInfo.vehicleFrameNo"></div>
                   </div>
                    <div class="item flexbox">
                       <div class="left">发动机号</div>
                       <div class="right flex flexbox flex-right" v-text="item.carInfo.engineNo"></div>
                   </div>
                    <div class="item flexbox no_border">
                       <div class="left">登记日期</div>
                       <div class="right flex flexbox flex-right" v-text="item.carInfo.registerDate"></div>
                   </div>
              </div>
              <!--保险起期-->
              <div>
                   <div class="head">保险起期</div>
                   <div class="item flexbox" v-show="output.jqxStartTime">
                       <div class="left">交强险/车船税</div>
                   </div>
                    <div class="item flexbox no_border" v-show="output.jqxStartTime">
                       <div class="left">生效时间</div>
                       <div class="right flex flexbox flex-right" v-text="output.jqxStartTime"></div>
                   </div>
                   <!--隔断-->
                   <div class="cut_off" v-show="output.jqxStartTime"></div>
                    <div class="item flexbox">
                       <div class="left">商业险</div>
                   </div>
                    <div class="item flexbox no_border">
                       <div class="left">生效时间</div>
                       <div class="right flex flexbox flex-right" v-text="output.startTime"></div>
                   </div>
              </div>
              <!--商业保险-->
              <div>
                   <div class="head">商业保险</div>
                   <div class="item" v-for="item in output.typeList" v-show="item.typeName == '商业险'">
                       <div class="flexbox" v-for="itm in item.insureList">
                            <div class="left" v-text="itm.insureName"></div>
                            <div class="right flex flexbox flex-right" >{{itm.insureAmount |overWan}}</div>
                       </div>
                   </div>
                   <div class="item flexbox no_border">
                       <div class="left flex">附加不计免赔</div>
                       <div class="right flexbox flex-right justify-content icon" @click="icon=!icon">
                           <i v-show="!icon" class="iconfont icon-baodan-jiantou-xia"></i>
                           <i v-show="icon" class="iconfont icon-baodan-jiantou-shang"></i>
                       </div>
                   </div>
                   <!--附加-->
                   <div class="fjdata" v-show="icon">
                       <div class="fjdata_list">
                           <div class="item" v-for="item in output.typeList" v-show="item.typeName == '附加险'">
                                <div class="flexbox" v-for="itm in item.insureList">
                                    <div class="left flex" v-text="itm.insureName + '不计免赔'"></div>
                                    <div class="right">{{itm.insureAmount | overWan}}</div>
                                </div>
                           </div>
                       </div>
                   </div>
              </div>
              <!--车主信息-->
              <div>
                   <div class="head">车主信息</div>
                   <div class="item flexbox">
                       <div class="left">姓名</div>
                       <div class="right flex flexbox flex-right" v-text="output.applicant"></div>
                   </div>
                    <div class="item flexbox">
                       <div class="left">证件类型</div>
                       <div class="right flex flexbox flex-right">{{output.applicantType | applicantType}}</div>
                   </div>
                    <div class="item flexbox">
                       <div class="left">证件号码</div>
                       <div class="right flex flexbox flex-right" v-text="output.applicantIdNo"></div>
                   </div>
                    <div class="item flexbox no_border">
                       <div class="left">手机号</div>
                       <div class="right flex flexbox flex-right" v-text="output.applicantMobile"></div>
                   </div>
              </div>
         </div>
        <!--最外两个div-->
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import request from 'js/interface/request';
import toast from '../../components/toast'; // toast引用
import layer from '../../components/layer';
import loading from '../../components/loading.vue';
import {Common, valid, storage} from 'js/common'
import weixinSDK from 'js/weixinSDK';
// console.log(Cookies)
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
            icon: false, //点击附加
            render: false,
            loading: false,
            isWeiXin: '',
            output: '' // 数据
        }
    },
    created () {
    },
    mounted () {
        this.isWeiXin = valid.isWeiXin();
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.getData(); // 获取数据
    },
    computed: {
    },
    methods: {
        getData () {
            var data = {
                userId: Common.getUserId(),
                detailId: Common.getQueryString('detailId'), // 明细记录编号
                classType: 3 //1:车险；2：个险；3:车险分期
            }
            request.getCarTradeDetail(data, (response) => {
                this.multiLogin(response);
                let output = response.data.output;
                if (output) {
                    this.output = output;
                }
                // console.log(JSON.stringify(response.data))
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
                    storage.set('prevPage', './FQpolicyDetailCar.html?detailId=' + Common.getQueryString('detailId'));
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
        }
    },
    filters: {
        overWan (value) {
            let number = parseInt(value);
            if (number === 0) {
                return '不投保';
            } else if (number === 1) {
                return '投保';
            } else if (number >= 10000) {
                return number/10000 + '万';
            } else {
                return value;
            }
        },
        applicantType (text) {
            let number = parseInt(text);
            if (number === 0) {
                return '其他';
            } else if (number === 1) {
                return '身份证';
            } else if (number === 2) {
                return '军官证';
            } else if (number === 3) {
                return '护照';
            } else if (number === 4) {
                return '驾驶证'
            } else if (number === 5) {
                return '港澳台通行证/回乡证';
            }
        }
    }
}
</script>
