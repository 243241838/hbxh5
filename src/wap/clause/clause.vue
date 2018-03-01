<template>
    <div id='body' :class="{isWeiXin:isWeiXin}">
    <div style="width:100%;height:2rem;"></div>
    <a href="javascript:void(0)" @click="init">显示pdf文档首页</a>
    <a href="javascript:;" @click="prev">上一页</a>
    <a href="javascript:;" @click="next">下一页</a>
    <a href="http://hbx-img-dev.oss-cn-shanghai.aliyuncs.com/resource/data/user/claims/video/progit.pdf" download>xai9z</a>
    <canvas id="the-canvas"></canvas>
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
        closepdf () {
            this.isshowpdf = false
        },
        pdferr(errurl) {
            console.log(errurl);
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