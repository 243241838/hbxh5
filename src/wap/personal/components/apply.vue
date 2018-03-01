<template>
    <div id="body" class="apply_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true" :isFiexd="true"></headerCommon>
        <div class="top"></div>
        <div class="head">申请人信息</div>
        <div class="list">
            <div class="item flexbox">
                <div class="left">姓名</div>
                <div class="right flex flexbox align-items">
                    <input type="text"  v-model="output.applicant" placeholder="请填写" maxlength="10">
                </div>
            </div>
            <div class="item flexbox">
                <div class="left">手机</div>
                <div class="right flex flexbox align-items">
                    <input type="text" maxlength="11"  v-model="output.applicantMobile"  placeholder="请填写">
                </div>
            </div>
            <div class="item flexbox last">
                <div class="left">邮箱</div>
                <div class="right flex">
                    <input type="text" v-model="output.applicantEmail"  placeholder="请填写">
                </div>
            </div>
        </div>
        <div class="head">理赔申请事项</div>
        <div class="list" v-for="item in output.insuredList">
            <div class="item flexbox">
                <div class="left">被保人</div>
                <div class="right flex" v-text="item.insuredName"></div>
            </div>
        </div>
        <div class="list">
            <div class="item flexbox">
                <div class="left">发生案件时间</div>
                <div class="right flex">
                   <!--
                    <datepicker v-model="caseTime"  class="flex flexbox align-items" placeholder="请选择" language="zh" format="yyyy-MM-dd"></datepicker>
                    -->
                    <input ref="time" type="text"  placeholder="请选择" id="zane-calendar">
                    <i class="iconfont">&#xe61d;</i>
                </div>
            </div>
        </div>
        <div class="list" v-for="item in output.insuredList">
            <div class="item flexbox last">
                <div class="left">保单号</div>
                <div class="right flex" v-text="output.policyId"></div>
            </div>
        </div>
        <div class="head">事件经过</div>
        <div class="textarea">
            <textarea maxlength="1000" v-model="applyAdvice" placeholder="请尽量详细描述事件经过，便于我们了解案件详情并有效协助理赔。(1000字以内)"></textarea>
        </div>
        <div class="head">上传截图或视频</div>
        <div class="img">
            <div class="plus">
                <div class="video" v-show="videoUrl">
                   <video  :src="videoUrl" controls  ref ="video"></video>
                   <i @click="videoUrl = ''" class="iconfont">&#xe698;</i>
                   <img src="../images/loging.gif" alt="" v-show="isImgloading">
                </div>
                <div class="UPimg" v-for="(item, index) in imgList" v-show="imgList.length > 0">
                    <img :src="item.imgUrl" alt="" >
                    <i @click="remove_img(index)" class="iconfont">&#xe698;</i>
                </div>
                <div class="btn" v-show="imgList.length < 10">
                    <i class="iconfont">&#xe67c;</i>
                    <input ref="file"type="file" accept="image/*" capture="camera" @change="addListenerUP($event)">
                </div>
                <div class="btn" v-show="!videoUrl">
                    <i class="iconfont">&#xe67d;</i>
                    <input type="file" accept="video/*" capture="camcorder"  @change="addListenerUP($event, 1)">
                </div>
                
            </div>
        </div>
        <div class="footer flexbox">
            <div class="left flex flexbox">
                <dl class="flex align-items justify-content">
                    <a href="tel:4001101866">
                        <dt>
                            <i class="iconfont">&#xe604;</i>
                        </dt>
                        <dd>
                            客服电话
                        </dd>
                    </a>  
                </dl>
                <dl class="flex align-items justify-content">
                    <router-link :to="{name:'helpCenter',query:{table: 2}}">
                        <dt>
                            <i class="iconfont">&#xe602;</i>
                        </dt>
                        <dd>
                            常见疑问
                        </dd>
                    </router-link>
                </dl>
            </div>
            <div class="right flexbox align-items justify-content" @click="sub()">提交申请</div>
        </div>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import request from 'js/interface/request'
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import Datepicker from 'vuejs-datepicker'
import { Common, storage, valid } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
import layer from '../../../components/layer';
import zaneDate from 'zane-calendar'; //赞恩时间控件
export default {
    components: {
        toast,
        loading,
        headerCommon,
        Datepicker,
        zaneDate,
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
            output: '', //数据
            data: '', //上个页面传过来的数据
            loading: false,
            isWeiXin: false,
            applyAdvice: '', //事件经过
            title: '申请理赔',
            videoUrl: '', //视频地址
            imgVideo: '', //视频第一针
            upUrl: '', //保存64视频
            imgList: [], //上传的图片集合
            isImgloading: false,
            claimId: '' //理赔单号
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '申请理赔';
        this.data = JSON.parse(this.$route.query.output)
    },
    mounted () {
        this.$nextTick(() => {
            this.resetBody();
        })
        this.getData();
        this.insDate();
    },
    computed: {
    },
    methods: {
        insDate () {
            zaneDate({
                elem: '#zane-calendar',
                // begintime:'2018-01-01 12:12',
                format: 'yyyy-MM-dd HH:mm',
                // type: 'time',
                showtime: true
            })
        },
        //获取数据
        getData () {
            let obj = {
                userId: Common.getUserId(),
                detailId: this.data.detailId
                // detailId: 779 //明细记录编号
            }
            console.log(obj)
            request.getTradeDetail(obj, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    let output =response.data.output;
                    if (!output) {
                        return false;
                    }
                    this.output = response.data.output;
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        //提交
        sub () {
            if (this.output.applicant === '') {
                this.showtoast('请填写申请人姓名', true);
                return false;
            }
            if (this.output.applicantMobile === '') {
                this.showtoast('请填写申请人电话', true);
                return false;
            }
            if (!valid.phone(this.output.applicantMobile)) {
                this.showtoast('手机格式不正确', true);
                return false;
            }
            if (this.output.applicantEmail === '') {
                this.showtoast('请填写申请人邮箱', true);
                return false;
            }
            if (!valid.isEmail(this.output.applicantEmail)) {
                this.showtoast('邮箱格式不正确', true);
                return false;
            }
            if (this.$refs.time.value === '') {
                this.showtoast('请填写发生案件时间', true);
                return false;
            }
            if (this.applyAdvice === '') {
                this.showtoast('请填写事件经过', true);
                return false;
            }
            let obj = {
                userId: Common.getUserId(),
                tradeId: this.output.tradeId, //订单号
                policyNo: this.output.policyId, //保单号
                productId: this.output.productId, //产品id
                applyUserName: this.output.applicant, //申请姓名
                applyUserMobile: this.output.applicantMobile, //申请人手机
                applyUserEmail: this.output.applicantEmail, // 申请人邮箱
                recognizee: (this.output.insuredList)[0].insuredName, //被保人
                caseTime: this.$refs.time.value + ':00', //案发时间
                applyAdvice: this.applyAdvice, //事件发生经过
                claimId: this.claimId // 理赔单号。，第一次为空
            }
            console.log(obj)
            this.loading = true;
            request.addClaimsRecords(obj, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    this.claimId = response.data.output.claimId;
                    if (this.imgList.length > 0) {
                        this.addClaimsImageRecords() //上传图片
                    } else {
                        if (this.videoUrl !== '') {
                            this.addClaimsVideoRecords() //上传视频
                        }
                    }
                    if (!this.imgList.length && this.videoUrl === '') {
                        this.loading = false;
                        this.alertShow('已提交申请，我们会有专人在24小时内跟进，请耐心等待！')
                    }
                } else {
                    this.loading = false;
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.loading = false;
                this.showtoast(error, true);
            })
        },
        //上传图片
        addClaimsImageRecords () {
            let obj = {
                userId: Common.getUserId(),
                claimId: this.claimId,
                imgList: this.imgList
            }
            console.log(obj)
            request.addClaimsImageRecords(obj, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    if (this.videoUrl !== '') {
                        this.addClaimsVideoRecords() //上传视频
                    } else {
                        this.loading = false;
                        this.alertShow('已提交申请，我们会有专人在24小时内跟进，请耐心等待！')
                    }
                } else {
                    this.loading = false;
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.loading = false;
                this.showtoast(error, true);
            })
        },
        //上传视频
        addClaimsVideoRecords () {
            let obj = {
                userId: Common.getUserId(),
                claimId: this.claimId,
                videoUrl: this.upUrl
            }
            console.log(obj)
            request.addClaimsVideoRecords(obj, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    this.alertShow('已提交申请，我们会有专人在24小时内跟进，请耐心等待！')
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.loading = false;
            }, (error) => {
                this.loading = false;
                this.showtoast(error, true);
            })
        },
         // 图片选择
        addListenerUP (e, number) {
            let file = e.target.files[0];
            // this.showtoast(file.size, true);
            if (number === 1) {
                //当选择的是视频上传时，选择的不是视频
                if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
                    this.showtoast('请上传视频', true);
                    return false;
                }
                if (file.size > 5000 * 1024) {
                    this.showtoast('视频不能大于5M', true);
                    return false;
                }
                this.isImgloading = true;
            } else {
                this.loading = true;
                //当 选择的是图片上传时， 上传的不是图片格式
                if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
                    this.showtoast('请上传图片', true);
                    return false;
                }
            }
            let maxSize = 1000 * 1024;// 1MB
            let isCompress = true;// 默认压缩
            if (file.size <= maxSize) {
                isCompress = false;
            }
            //视频不压缩
            if (number === 1) {
                isCompress = false;
            }
            let reader = new window.FileReader();
            let that = this;
            reader.onload = function (e) {
                that.compress(this.result, isCompress, number);
            }
            reader.readAsDataURL(file);
        },
         // 压缩
        compress (res, isCompress, number) {
            if (!isCompress) {
                // 不压缩
                this.scanCredentialImgInfo(res, number);
                return;
            } else {
                // 压缩
                let img = new window.Image();
                let maxW = 600;
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
                    var dataUrl = cvs.toDataURL('image/jpg', 1)
                    this.scanCredentialImgInfo(dataUrl, number); // 上传图片
                };
            }
        },
        // 视频和图片url赋值
        scanCredentialImgInfo (base64Code, number) {
            if (number === 1) {
                this.addTempVideo(base64Code)
            } else {
                let obj = {
                    imgUrl: base64Code
                }
                this.imgList.push(obj);
                this.$refs.file.value = ''; //清空照片控件值
                this.loading = false;
            }
        },
        //上传视频预览
        addTempVideo (url) {
            let obj = {
                userId: Common.getUserId(),
                videoUrl: url
            }
            console.log(obj)
            request.addTempVideo(obj, (response) => {
                console.log(response.data)
                if (response.data.respCode === '000000') {
                    this.videoUrl = response.data.output.videoUrl;
                    var video = this.$refs.video;
                    video.load();
                    this.isImgloading = false;
                    this.loading = false;
                    this.upUrl = url;
                    // 截取第一贞
                    // video.addEventListener('loadeddata', this.video_first);
                    // this.video_first(this.videoUrl);
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
         //截取第一贞
        video_first () {
            var scale = 0.8;
            let video = this.$refs.video;
            let cvs = document.createElement('canvas');
            let ctx = cvs.getContext('2d');
            cvs.width = video.videoWidth;
            cvs.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
            var url = cvs.toDataURL('image/jpg');
            this.imgVideo = url;
            this.loading = false;
        },
        //删除图片
        remove_img (index) {
            console.log(index)
            this.imgList.splice(index, 1)
        },
        // 显示提示框
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        // 关闭提示框
        closetoast () {
            this.toast.isshow = false;
        },
        refreshData (me) {
            // me.resetload();
        },
        resetBody () {
            this.$nextTick(() => {
                setTimeout(() => {
                    Common.setFullScreen()
                }, 0)
            })
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
                    // window.location.href = ''
                    this.$router.push({path: '/myClaims'})
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
