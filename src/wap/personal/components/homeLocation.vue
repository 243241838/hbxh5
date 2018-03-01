<template>
    <div id="body" class="location_body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div v-show="!loading">
            <div class="location_list">
                <div class="item" v-for="(item,index) in output" @click="selectAddress(item)">
                    <div class="flexbox name">
                        <div v-text="item.cneeName"></div>
                        <div class="flex flexbox flex-right" v-text="item.mobile"></div>
                    </div>
                    <div class="location" v-text="item.address"></div>
                    <div class="edit">
                        <div class="fl left" @click.stop="bloc(item)">
                            <img v-if="item.defaultFlag==1" src="../../../assets/images/gouxuan.png" alt="">
                            <img v-else src="../../../assets/images/weigouxuan.png" alt="">
                            <span :class="{'location_check':item.defaultFlag==1}">默认地址</span>
                        </div>
                        <div class="fr right">
                            <div class="fl" @click.stop="edit(item)">
                                <i class="iconfont">&#xe640;</i>
                                <span>编辑</span>
                            </div>
                            <div class="fr" @click.stop="delete_location(item,index)">
                                <i class="iconfont">&#xe625;</i>
                                <span>删除</span>
                            </div>                           
                        </div>   
                    </div>
                </div>
                <!--list-->
            </div>
            <router-link :to="{name:'homeAddLocation', params:{address:false}}">
                <footer class="location_footer">
                    <span class="btn">
                        <i class="iconfont">&#xe836;</i>
                        <span>新建地址</span>
                    </span>
                </footer>
            </router-link>
        </div>
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
        <loading :isshow="loading"></loading>
    </div>
</template>
<script>
import request from 'js/interface/request'
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import { Common, storage, valid } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        toast,
        loading,
        headerCommon
    },
    data () {
        return {
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            loading: false,
            output: '',
            pageIndex: 1,
            pageSize: 10,
            areasList: [], // 地址列表
            isWeiXin: false,
            title: '地址管理'
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '地址管理';
        this.getAreaList(); // 获取省市地址
    },
    mounted () {
        this.$nextTick(() => {
            this.resetBody();
        })
    },
    computed: {
    },
    methods: {
        // 获取数据
        getData () {
            let obj = {
                userId: Common.getUserId(),
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            }
            this.loading = true;
            request.getConsignees(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.output = response.data.output.cneeList;
                    this.output.map((item) => {
                        if (item.defaultFlag === '1') {
                            this.selectAddress(item, true);
                            return;
                        }
                    })
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.loading = false;
            }, (error) => {
                this.showtoast(error, true);
            });
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
        // 默认地址
        bloc (item) {
            let obj = {
                userId: Common.getUserId(),
                cneeId: item.cneeId
            }
            request.defualtConsignee(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true)
                    // 成功后才能改变状态
                    this.output.map((value) => {
                        value.defaultFlag = 0;
                    })
                    item.defaultFlag = 1;
                    this.selectAddress(item, true);
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        // 编辑
        edit (item) {
            this.$router.push({name: 'homeAddLocation', params: {address: JSON.stringify(item)}})
        },
        // 删除
        delete_location (item, index) {
            let obj = {
                userId: Common.getUserId(),
                cneeId: item.cneeId
            }
            request.delConsignee(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.showtoast(response.data.respMsg, true);
                    this.output.splice(index, 1);
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
                this.resetBody();
            }, (error) => {
                this.showtoast(error, true);
            });
        },
        // 选择一个地址
        selectAddress (item, isSet) {
            // 不是车险页面跳过来的
            if (!this.$route.query.carPage && !isSet) {
                return;
            }
            let obj = {};
            let isFind = false;
            if (this.areasList) {
                this.areasList.map((provice) => {
                    if (isFind) { return; }
                    provice.children.map((city) => {
                        if (isFind) { return; }
                        city.children.map((area) => {
                            if (area.areaId.toString() === item.areaId.toString()) {
                                obj = {
                                    expressName: item.cneeName, // 收件人姓名
                                    expressMobile: item.mobile, // 收件人手机
                                    expressAddress: item.address, // 收件人地址
                                    expressProvince: provice.areaId, // 快递省份代码
                                    expressCity: city.areaId, // 快递城市代码
                                    expressDistrict: area.areaId, // 快递区县代码
                                    detail: item.fullName + item.city + item.address
                                }
                                isFind = true;
                                return;
                            }
                        })
                    })
                });
                storage.set('address', JSON.stringify(obj));
                if (!isSet) {
                    window.history.back();
                }
                return false;
            } else {
                return false;
            }
        },
        // 获取所有省市区地址
        getAreaList () {
            let obj = {
                parentId: '0'
            }
            request.getAreaList(obj, (response) => {
                if (response.data.respCode === '000000') {
                    this.areasList = response.data.output.areasList;
                    this.getData(); // 获取数据
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
            })
        },
        resetBody () {
            setTimeout(() => {
                Common.setFullScreen();
            }, 0)
        }
    }
}
</script>
