<template>
    <div id='body' :class="{isWeiXin:isWeiXin}">
    <a href="javascript:void(0)" @click="init">显示pdf文档首页</a>
    <a href="javascript:;" @click="prev">上一页</a>
    <a href="javascript:;" @click="next">下一页</a>
    <a href="http://hbx-img-dev.oss-cn-shanghai.aliyuncs.com/resource/data/user/claims/video/progit.pdf" download>xai9z</a>
    <canvas id="the-canvas"></canvas>
        <!--toasts提示组件-->
        <img id="imgSrc" src="" alt="">
        <div class="ui-btn-group" style="padding: 20px 0;">
            <a class="ui-btn">拍摄</a>
            <input class="file" id="file1" type="file" accept="image/*" capture="camera" @change="addListenerUP($event)">
            <input type="file" id="file_input1" accept="video/*" capture="camcorder"  @change="addListenerUP($event, 1)">
        </div>
        <!--controls-->
        <div>大小{{size}}</div>
        <div>状态{{aa}}</div>
        <video width="320" :src="url" style="display:none;" controls height="240" id="video" ref ="aa">
        </video>
        <canvas id="mycanvas" width=320 height=240></canvas>
        <a href="javascript:;" @click="openVideo">open</a>
        <div @click="open()">开始</div>
        <div @click="abc()" style="margin-bottom:10rem">转换源</div>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import {Common, valid, storage} from 'js/common'
import request from 'js/interface/request';
import toast from '../../components/toast' // totast引用：
import loading from '../../components/loading';
let base64 = require('base64-js')
export default {
    components: {
        toast,
        loading
    },
    data () {
        return {
            toast: { // totast引用
                isshow: false,
                message: ''
            },
            loading: false, //加载
            isWeiXin: '',
            url: '',
            size: '',
            aa: [],
            index: 0,
            total: 1
        }
    },
    watch: {
        index () {
            this.showPdf()
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    },
    mounted () {
        if (window.FileReader) {
            this.aa = '能用'
        } else {
            this.aa = '不能用'
        }
        // let vm = this
        // PDFJS.getDocument('http://hbx-img-dev.oss-cn-shanghai.aliyuncs.com/resource/data/user/claims/video/progit.pdf').then(function(pdfDoc_) {  //初始化pdf
        //     vm.pdfDoc = pdfDoc_;
        //     vm.page_count = vm.pdfDoc.numPages
        //     vm.renderPage(vm.pageNum);
        // });
    },
    computed: {
    },
    methods: {
        init() {
            this.index=1
        },
        prev() {
            if (this.index>1) {
                this.index--
            }
        },
        next() {
            if (this.index<this.total) {
                this.index++
            }
            this.index++
        },
        showPdf () {
            const that=this;
            console.log(window.PDFJS);
            window.PDFJS.workerSrc = '../../wapStatic/pdf.worker.js';//加载核心库
            window.PDFJS.getDocument('../../wapStatic/demo.pdf').then(function getPdfHelloWorld (pdf) {
                that.total=pdf.pdfInfo.numPages;
                //
                // 获取第一页数据
                //
                pdf.getPage(that.index).then(function getPageHelloWorld (page) {
                    var scale = 1.5;
                    console.log(page)
                    var viewport = page.getViewport(scale);
                    //
                    // Prepare canvas using PDF page dimensions
                    //
                    var canvas = document.getElementById('the-canvas');
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    // console.log(document.documentElement.clientWidth, 'aa:' + document.documentElement.clientHeight)
                    // canvas.width = document.documentElement.clientWidth;
                    // canvas.height = document.documentElement.clientHeight;
                    //
                    // Render PDF page into canvas context
                    //
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                });
            });
        },
        openVideo () {
            document.getElementById('video').play();
        },
        closepdf () {
            this.isshowpdf = false
        },
        pdferr(errurl) {
            console.log(errurl);
        },
        abc () {
            this.url = '../../wapStatic/img/b74e6354-65ec-4301-b613-2b431a418978.mp4'
            var video = document.getElementById('video');
            video.load();
        },
         // 图片选择
        addListenerUP (e, number) {
            // this.loading = true;
            let file = e.target.files[0];
            // var windowURL = window.URL || window.webkitURL;
            // var ideoURL = windowURL.createObjectURL(file);
            // console.log(ideoURL)
            // this.url = ideoURL;
            // var video = document.getElementById('video');
            // video.load();
            let maxSize = 1000 * 1024;// 1MB
            let isCompress = true;// 默认压缩
            if (file.size <= maxSize) {
                isCompress = false;
            }
            // this.size = file.size;
            //视频不压缩
            if (number === 1) {
                isCompress = false;
            }
            let reader = new window.FileReader();
            let that = this;
            reader.onload = function (e) {
                that.aa = '成功'
                that.compress(this.result, isCompress, number);
            }
            reader.onerror = function (e) {
                this.aa = e;
            }
            reader.readAsDataURL(file);
        },
         // 压缩
        compress (res, isCompress, number) {
            if (!isCompress) {
                // 不压缩
                // document.getElementById('imgSrc').src = res;
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
                    // var dataUrl = cvs.toDataURL('video/mp4', 1);
                    var dataUrl = cvs.toDataURL('image/jpg', 1)
                    // document.getElementById('imgSrc').src = dataUrl;
                    this.scanCredentialImgInfo(dataUrl, number); // 上传图片
                };
            }
        },
        // 上传图片
        scanCredentialImgInfo (base64Code, number) {
            // if (!Common.isLogin()) {
            //     window.location.href = 'FQLogin.html';
            //     return false;
            // }
            let obj = {
                credentialType: '1',
                credentialImgBase64: base64Code,
                userId: Common.getUserId()
            }
            this.loading = false;
            if (number === 1) {
                this.url = obj.credentialImgBase64;
                var video = document.getElementById('video');
                video.load();
                video.addEventListener('loadeddata', this.video_first);
                let canvas=document.getElementById('mycanvas');
                canvas.width=video.width;
                canvas.height=video.height;
                let ctx=canvas.getContext('2d');
                setTimeout(() => {
                    var i;
                    ctx.drawImage(video, 0, 0, video.width, video.height);
                    video.addEventListener('play', function() {
                        i = window.setInterval(function() {
                            ctx.drawImage(video, 0, 0, video.width, video.height);
                        }, 20);
                    }, false);
                    video.addEventListener('pause', function() { window.clearInterval(i) }, false);
                    video.addEventListener('ended', function() { clearInterval(i); }, false);
                }, 500)
                // this.video_first();
            } else {
                document.getElementById('imgSrc').src = base64Code;
            }
            // console.log(base64Code.replace(/\+/g, '%2B'))
            // console.log(base64Code.replace('+', '%2B'))
        },
        open () {
            let audio = this.$refs.aa;
            console.log('缓冲对象' + audio.buffered.length)
            this.aa.push('缓冲对象' + audio.buffered.length)
            console.log('音频时长' + audio.duration)
            this.aa.push('音频时长' + audio.duration)
            switch (audio.networkState) {
            case 0:
                console.log('网络状态：音频/视频尚未初始化' + audio.networkState)
                this.aa.push('网络状态：音频/视频尚未初始化' + audio.networkState + '<br>')
                break;
            case 1:
                console.log('网络状态：音频/视频是活动的且已选取资源，但并未使用网络' + audio.networkState)
                this.aa.push('网络状态：音频/视频是活动的且已选取资源，但并未使用网络' + audio.networkState + '<br>')
                break;
            case 2:
                console.log('网络状态：浏览器正在下载数据' + audio.networkState)
                this.aa.push('网络状态：浏览器正在下载数据' + audio.networkState + '<br>')
                break;
            case 3:
                console.log('网络状态：未找到音频/视频来源' + audio.networkState)
                this.aa.push('网络状态：未找到音频/视频来源' + audio.networkState + '<br>')
                break;
            }
            switch (audio.readyState) {
            case 0:
                console.log('就绪状态:没有关于音频是否就绪的信息' + audio.readyState)
                this.aa.push('就绪状态:没有关于音频是否就绪的信息' + audio.readyState + '<br>')
                break;
            case 1:
                console.log('就绪状态:关于音频就绪的元数据' + audio.readyState)
                this.aa.push('就绪状态:关于音频就绪的元数据' + audio.readyState + '<br>')
                break;
            case 2:
                console.log('就绪状态: 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒' + audio.readyState)
                this.aa.push('就绪状态: 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒' + audio.readyState + '<br>')
                break;
            case 3:
                console.log('就绪状态: 当前及至少下一帧的数据是可用的' + audio.readyState)
                this.aa.push('就绪状态: 当前及至少下一帧的数据是可用的' + audio.readyState + '<br>')
                break;
            case 4:
                console.log('就绪状态: 可用数据足以开始播放' + audio.readyState)
                this.aa.push('就绪状态: 可用数据足以开始播放' + audio.readyState + '<br>')
                break;
            }
            console.log('音频查找' + audio.seeking)
            this.aa.push('音频查找' + audio.seeking + '<br>')
            if (audio.canPlayType('video/mp4') !== '') {
                console.log('支持video')
                this.aa.push('支持video')
            }
        },
        video_first () {
            var scale = 0.8;
            let video = document.getElementById('video');
            let cvs = document.createElement('canvas');
            let ctx = cvs.getContext('2d');
            cvs.width = video.videoWidth * scale;
            cvs.height = video.videoHeight * scale;
            ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
            var url = cvs.toDataURL('image/jpg');
            document.getElementById('imgSrc').src = url;
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    },
    filters: {
    }
}
</script>