<template>  
    <div id="body" :class="{isShow:!isWeiXin}">
        <div class="text" @click="timeNone()">
            <div class="message">
                <div class="item flexbox align-items">
                    <div class="left flexbox align-items">
                        <i class="iconfont icon-xingming"></i>
                    </div>
                    <div class="right flex flexbox align-items">
                        <input @input="keyup(realName, 'realName')" placeholder="请输入姓名 确认礼品主人" v-model="realName" maxlength="8" type="text">
                    </div>
                </div>
                <div class="item flexbox align-items">
                    <div class="left flexbox align-items">
                        <i class="iconfont icon-xingbie"></i>
                    </div>
                    <div class="right flex flexbox">
                        <div class="flexbox align-items" @click="gender=2">
                            <i class="iconfont icon-woman" :class="{orange:gender==2}"></i>
                            <span :class="{orange:gender==2}">女</span>
                        </div>
                        <div class="flexbox align-items" @click="gender=1">
                            <i class="iconfont icon-man" :class="{orange:gender==1}"></i>
                            <span :class="{orange:gender==1}">男</span>
                        </div>
                    </div>
                </div>
                <div class="item flexbox align-items">
                    <div class="left flexbox align-items">
                        <i class="iconfont icon-shouji"></i>
                    </div>
                    <div class="right flex flexbox align-items">
                        <input @input="keyup(phone, 'phone')" placeholder="请输入手机号码 领取大礼" v-model="phone" maxlength="11" type="text">
                    </div>
                </div>
                <div class="item flexbox align-items noborder">
                    <div class="left flexbox align-items">
                        <i class="iconfont icon-yanzhengma"></i>
                    </div>
                    <div class="right flex flexbox align-items">
                        <input @input="keyup(smsCode, 'smsCode')" v-model="smsCode"  placeholder="请输入验证码" type="text">
                    </div>
                    <div class="getcode flexbox align-items">
                        <span @click="verify" v-show="isGeting" :class="{orange:phone.length==11}">获取验证码</span>
                        <span v-show="!isGeting"><span v-text="time.seconds"></span>秒</span>
                    </div>
                </div>
            </div>
            <div class="carEndTime flexbox align-items">
                <div class="left flexbox align-items justify-content">车险到期时间</div>
                <datepicker class="flex flexbox justify-content" placeholder="请选择" language="zh" format="yyyy-MM-dd" v-model="carExpireDate"></datepicker>
                <div class="icon flexbox align-items ">
                    <i class="iconfont icon-baodan-jiantou-xia"></i>
                </div>
            </div>
            <div @click="verifyData()" class="btn flexbox align-items justify-content" :class="{yellow:yellow}">确定</div>
            <div class="bottom">
                <p>活动规则：</p>
                <p>1、赠送礼品仅限于用户在线下特定推广活动中领取。</p>
                <p>2、注册成功用户即获得汇保险赠送的礼品，每位注册用户仅限一次。</p>
                <p>3、活动的最终解释权归汇保险所有。</p>
            </div>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <totast :isshow='totast.isshow' @ontoastback='closetoast'>{{ totast.message}}</totast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import {Common, valid, storage} from 'js/common'
import Datepicker from 'vuejs-datepicker'
import totast from '../../components/toast' // totast引用：
import loading from '../../components/loading';
import request from 'js/interface/request';
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        totast,
        loading,
        layer,
        Datepicker
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
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            time: { // 倒计时
                seconds: ''
            },
            endTime: 0,
            isTimeout: false, // 是否超时
            isGeting: true, // 验证码切换
            loading: false,
            isWeiXin: '',
            yellow: false, //确定
            realName: '', // 姓名
            gender: 2, // 性别
            phone: '', // 电话
            smsCode: '', // 验证码
            carExpireDate: '', //车险到期时间
            time_none: ''

        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        this.initTime(); // 初始化倒计时
    },
    mounted () {
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.$nextTick(() => {
            this.time_none = document.querySelector('.calendar');
        })
        this.ins(); // 判断userInfo
    },
    computed: {
    },
    methods: {
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
        // 初始化倒计时
        initTime () {
            let t = storage.get('FQnewregist');
            let ct = new Date().getTime();
            if (t) {
                if (ct < t) {
                    this.time60();
                }
            }
        },
        verify () {
            // 判断是否为手机号码
            if (this.phone.length >= 11) {
                if (valid.phone(this.phone.trim())) {
                    this.getVerifyCode();
                } else {
                    if (this.phone.length === 0) {
                        this.showtoast('请输入手机号码', true)
                    } else {
                        this.showtoast('手机号码格式有误', true)
                    }
                }
            }
        },
        // 获得验证码
        getVerifyCode () {
            var data = {
                bizType: '11', // 登录
                mobile: this.phone,
                codeType: '1' // 短信验证码
            }
            this.time60();// 倒计时
            request.getVerifyCode(data, (response) => {
                if (response.data.respCode === '000000') {
                    console.log(response.data.output.smsCode)
                    this.showtoast('获得验证码成功，请注意查收', true)
                } else {
                    this.showtoast('获得验证码失败', true)
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
         // 过期时间
        getEndTime () {
            let sTime = storage.get('FQnewregist');
            var endTime = '';
            if (sTime) {
                endTime = new Date().getTime() >= sTime ? new Date().getTime() + 60 * 1000 : sTime;
            } else {
                endTime = new Date().getTime() + 60 * 1000;
            }
            storage.set('FQnewregist', endTime);
            return endTime;
        },
        // 倒计时
        time60 () {
            this.endTime = this.getEndTime();
            this.isGeting = false;// 切换倒计时和获得验证码
            this.isTimeout = false;// 是否超时
            Common.countdown(this.time, this.endTime, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
                if (this.isTimeout) {
                    this.isGeting = true;
                }
            });
        },
        //去除空格
        keyup (val, name) {
            let value = val.trim(); // 去前后空格
            this[name] = value;
            if (this.realName.length > 0 && this.smsCode.length > 0 && this.phone.length > 0) {
                this.yellow = true;
            } else {
                this.yellow = false;
            }
        },
        //点击其他关闭时间控件
        timeNone () {
            if (this.time_none.style.display !== 'none') {
                this.time_none.style.display === 'none'
            }
        },
        // 验证所有信息
        verifyData () {
            if (this.yellow) {
                if (!valid.userName(this.realName)) {
                    this.showtoast('姓名为2-8位中文', true);
                    return false;
                } else if (!valid.phone(this.phone)) {
                    this.showtoast('手机号码格式不正确', true);
                    return false;
                } else if (!this.smsCode) {
                    this.showtoast('验证码不能为空', true)
                    return false;
                }
                if (!this.loading) {
                    this.subGetdata(); // 防止重复提交
                }
            }
        },
        // 获取是否有unionId
        ins () {
            var unionId = storage.get('unionId');
            var mobile = storage.get('mobile');
            if (unionId && !mobile) {
                storage.remove('unionId')
            }
        },
        //提交
        subGetdata () {
            let carExpireDate = '';
            if (this.carExpireDate) {
                //yyyyMMdd 时间格式化
                carExpireDate = Common.formatNewDate(this.carExpireDate);
            }
            var obj = {
                realName: this.realName, // 姓名
                userGender: this.gender, // 性别 1 男 2 女
                userName: this.phone, // 手机号
                smsCode: this.smsCode, // 短信验证码,
                carExpireDate: carExpireDate // 车险到期时间
            }
            this.loading = true;
            request.carRegUser(obj, (response) => {
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    console.log(response.data)
                    if (output) {
                        storage.set('FQnewRegistdata', JSON.stringify(output)); // 下个页面用
                        storage.set('mobile', output.mobile);
                        storage.remove('FQnewregist');
                        storage.set('isNewMan', 'true');
                        console.log(response.data)
                        this.goto();
                    }
                } else {
                    this.loading = false;
                    this.showtoast(response.data.respMsg, true);
                }
            }, () => {
                this.loding = false;
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
        goto () {
            this.loading = false;
            window.location.href = 'FQnewRegist1.html';
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
