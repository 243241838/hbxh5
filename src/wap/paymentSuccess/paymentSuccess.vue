<template>
    <div id="body">
        <div class="session">
            <div class="head">
                <div class="logo"></div>
                <span class="title">汇保险</span>
            </div>
            <div class="paymentImg">
                <div class="img"></div>
            </div>
            <div class="successDes"><span>恭喜您成功投保</span></div>
            <div class="linePhone">
                <span>如有疑问，请联系客服</span><span>4001101866</span>
            </div>
            <div class="btnBox">
                <a :href="baodanURL" class="button">查看订单详情</a>
            </div>
        </div>
    </div>
</template>
<script>
import Mydropload from 'js/mydropload.js';
import request from 'js/interface/request';
import Data from '../../data/data.js';
import { Common } from 'js/common.js';
Common.setFullScreen();
export default {
    data () {
        return {
            baodanURL: '#'
        }
    },
    mounted () {
        this.getData();// 获取数据
    },
    methods: {
        getData () {
            let isGe = true;
            if (isGe) {
                // 个险
                this.baodanURL = './orderDetailGe.html?tradeId=' + Common.getQueryString('tradeId');// 保单号
            } else {
                // 车险
                this.baodanURL = './orderDetailChe.html?detailId=' + Common.getQueryString('tradeId');// 保单号
            }
        }
    }
}
</script>
