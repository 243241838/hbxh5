<template>
    <div id='body'>
        <!--toasts提示组件-->
        <div class="boy">
            <div class="test">
                <textarea v-model="text" maxlength="300"></textarea>
            </div>
            <div class="btn">
                <div @click="getSub()">提交</div>
            </div>
        </div>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
    </div>
</template>
<script>
import {Common, valid, storage} from 'js/common'
import request from 'js/interface/request'
import loading from '../../components/loading';
import toast from 'components/toast';
export default {
    components: {
        loading,
        toast
    },
    data () {
        return {
            toast: {
                isshow: false,
                message: ''
            },
            loading: false,
            text: ''
        }
    },
    created () {
    },
    mounted () {
    },
    computed: {
    },
    methods: {
        getSub () {
            var data = {
                userId: storage.get('userId'),
                feedbackContent: this.text,
                feedbackType: 10 // 意见类型
            }
            if (this.text.length > 0) {
                if (this.loading) {
                    this.showtoast('意见正在提交中', true);
                    return;
                }
                this.loading = true;
                request.feedBack(data, (response) => {
                    if (response.data.respCode === '000000') {
                        this.showtoast(response.data.respMsg, true);
                        setTimeout(() => {
                            window.history.back();
                        }, 2800);
                    } else {
                        this.showtoast(response.data.respMsg, true);
                    }
                    this.loading = false;
                }, () => {
                    this.loading = false;
                    this.showtoast('网络错误，请查看网络是否连接', true);
                })
            } else {
                this.showtoast('意见不能为空', true);
            }
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        }
    }
}
</script>