<template>
    <div class="container" :class="{'isWeiXin': isWeiXin}">
        <div id="body">
            <div class="nitem" v-html="productPrompt">
                <!-- <div class="notice-item-content">
                    1.过去2年内投保人身保险或健康保险时，没有被保险公司拒保、延期、加费或者附加条件承保。<br>
                    2.目前没有从事高危职业。<br>
                    3.过去1年内有健康检查结果没有异常（如血液、超声、影像、内镜、病理检查）；过去2年曾住院（不包括剖腹产/顺产/鼻炎/急性胃肠炎/肺炎/上呼吸道感染住院）。<br>
                    4.目前或过往没有患有下列疾病或症状：良/恶性肿瘤、白血病、3级以上高血压（收缩压大于180mmHg，舒张压大于110mmHg）、糖尿病、冠心病/冠状动脉狭窄、心肌梗死、风湿性心脏病、心功能不全二级以上、脑梗死/脑出血、肾炎、肾功能不全、肾/输尿管结石、肝炎、肝硬化、再生障碍性贫血、系统性红斑狼疮、类风湿性关节炎、帕金森氏病、癫痫、精神病、肺结核、慢性阻塞性肺病、瘫痪、慢性胆囊炎、胆石症、胆囊息肉、下肢静脉曲张、甲亢、甲状腺结节、传导性耳聋、胃/十二指肠溃疡、椎间盘突出症、乳腺囊肿/结节、克罗恩病（节段性肠炎）、先天性疾病。<br>
                    5.过去1年内没有存在下列症状：反复头痛、晕厥、胸痛、气急、紫绀、持续反复发热、抽搐、不明原因皮下出血点、咯血、反复呕吐、进食梗噎感或吞咽困难、呕血、浮肿、腹痛、黄疸（新生儿黄疸且已治愈的除外）、便血、血尿、蛋白尿、肿块、消瘦（体重减轻5公斤以上）、职业病、酒精中毒、其他药品中毒、智能障碍、五官/脊柱/胸廓/四肢/手指
                </div> -->
            </div>
        </div>
        <!--toasts提示组件-->
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import {Common, valid} from 'js/common'
import request from 'js/interface/request'
import toast from '../../components/toast' // toast引用：
export default {
    components: {
        toast
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            productPrompt: '',
            isWeiXin: false
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        // app嵌入
        if (Common.getQueryString('isApp')) {
            this.isWeiXin = true;
        }
        this.getproductClause();
    },
    mounted () {
        Common.setFullScreen();
    },
    computed: {
    },
    methods: {
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        getproductClause () {
            var that = this;
            var obj = {
                productId: Common.getQueryString('productId')
            }
            request.getProductPrompt(obj, (response) => {
                if (response.data.respCode === '000000') {
                    that.productPrompt = response.data.output.productPrompt;
                    Common.setFullScreen();
                } else {
                    that.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                that.showtoast(error, true);
            })
        }
    }
}
</script>