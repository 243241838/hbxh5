<template>  
    <div id="body">
        <headerCommon v-if="!isWeiXin" :title="title" :rem="true"></headerCommon>
        <div class="add_list">
            <div class="item flexbox align-items">
                <div class="left">收货人</div>
                <div class="right flex">
                    <input type="text" value="" placeholder="请输入" v-model="cneeName">
                </div>
            </div>
            <div class="item flexbox align-items">
                <div class="left">联系方式</div>
                <div class="right flex">
                    <input type="text" value="" placeholder="请输入" v-model="mobile">
                </div>
            </div>
            <div class="item flexbox align-items">
                <div class="left">邮政编码</div>
                <div class="right flex">
                    <input type="text" value="" placeholder="请输入" v-model="areaCode">
                </div>
            </div>
            <div class="item flexbox align-items">
                <div class="left">所在地区</div>
                <div class="right flex flexbox" @click="showAddress">
                    <span class="flex text" v-text="areaName"></span>
                    <span class="flexbox flex-right align-items">
                        <i class="iconfont">&#xe61d;</i>
                    </span>
                </div>
            </div>
            <div class="item flexbox align-items noborder">
                <div class="left">详细地址</div>
                <div class="right flex">
                    <input type="text" edmit="false" value="" placeholder="街道/楼盘号等" v-model="address">
                </div>
            </div>
            <!--list-->
        </div>
        <div class="add_oli flexbox align-items">
            <div class="left">设为默认地址</div>
            <div class="right flex flexbox flex-right">
                <i v-show="!defaultFlag" @click="defaultFlag=!defaultFlag" class="iconfont">&#xe639;</i>
                <i v-show="defaultFlag" @click="defaultFlag=!defaultFlag" class="iconfont icon">&#xe63a;</i>
            </div>
        </div>
        <footer class="add_footer">
            <div class="btn" @click="commit">保存</div>
        </footer>
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
        <toast :isshow="toast.isshow" @ontoastback="closetoast">{{ toast.message}}</toast>
    </div>
</template>
<script>
import request from 'js/interface/request'
import toast from '../../../components/toast' // toast引用
import loading from '../../../components/loading.vue';
import { Common, valid } from 'js/common.js';
import headerCommon from '../../../components/headerCommon.vue';
export default {
    components: {
        toast,
        loading,
        headerCommon
    },
    data () {
        return {
            toast: {
                isshow: false,
                message: ''
            },
            loading: false,
            areaName: '省、市、区',
            newAreaName: '',
            defaultFlag: false, // 是否为默认地址, 1是默认地址，0不是默认
            cneeName: '', // 收货人
            mobile: '', // 联系方式
            areaCode: '', // 邮政编码
            areaId: '', // 所在地区区号
            address: '', // 详细地址
            output: '',
            isshowAddress: false,
            selectedProviceId: '', // 选择的省id
            selectedProviceName: '', // 选择的省名称
            selectedCityArr: '', // 选择的省下的市
            selected: 0,
            province: '请选择', // 省
            city: '', // 市
            area: '', // 区
            isEdit: false, // 是新增还是编辑,默认编辑
            cneeId: '', // 收货人ID
            title: '新增地址',
            isWeiXin: false
        }
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
        document.getElementsByTagName('title')[0].innerText = '新建收获人';
        this.init();
    },
    mounted () {
        this.$nextTick(() => {
            this.resetBody();
        })
    },
    computed: {
    },
    methods: {
        init () {
            let obj = JSON.parse(this.$router.currentRoute.params.address);
            // 编辑
            if (obj) {
                this.isEdit = true;
                this.address = obj.address;
                this.areaId = obj.areaId;
                this.areaCode = obj.areaCode;
                this.cneeId = obj.cneeId;
                this.cneeName = obj.cneeName;
                if (obj.defaultFlag === '1') {
                    this.defaultFlag = true;
                }
                this.areaName = obj.fullName;
                this.mobile = obj.mobile;
            }
        },
        commit () {
            if (this.verify()) {
                // 编辑
                if (this.isEdit) {
                    let obj = {
                        userId: Common.getUserId(),
                        cneeId: this.cneeId,
                        cneeName: this.cneeName, // 收获人
                        mobile: this.mobile, // 联系方式
                        areaCode: this.areaCode, // 邮政编码
                        areaId: this.areaId, // 所在地区区号
                        address: this.address, // 详细地址
                        syncUser: '1', // 1：需要同步 0：不需要同步
                        defaultFlag: this.defaultFlag ? '1' : '0' // 1是默认地址，0不是默认
                    }
                    request.updateConsignee(obj, (response) => {
                        if (response.data.respCode === '000000') {
                            this.$router.go(-1);
                        } else {
                            this.showtoast(response.data.respMsg, true);
                        }
                    }, (error) => {
                        this.showtoast(error, true);
                    })
                    // 新增
                } else {
                    let obj = {
                        userId: Common.getUserId(),
                        cneeName: this.cneeName, // 收获人
                        mobile: this.mobile, // 联系方式
                        areaCode: this.areaCode, // 邮政编码
                        areaId: this.areaId, // 所在地区
                        address: this.address, // 详细地址
                        syncUser: '1', // 1：需要同步 0：不需要同步
                        defaultFlag: this.defaultFlag ? '1' : '0' // 1是默认地址，0不是默认
                    }
                    request.addConsignee(obj, (response) => {
                        if (response.data.respCode === '000000') {
                            this.$router.go(-1);
                        } else {
                            this.showtoast(response.data.respMsg, true);
                        }
                    }, (error) => {
                        this.showtoast(error, true);
                    })
                }
            }
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
        resetBody () {
            this.$nextTick(() => {
                Common.setFullScreen();
            })
        },
        showAddress () {
            this.isshowAddress = true;
            this.selectProvince();
        },
        verify () {
            if (this.cneeName.length < 1) {
                this.showtoast('请输入收货人姓名', true);
                return false;
            }
            if (!valid.cneeName(this.cneeName)) {
                this.showtoast('收货人名字为中文，长度1-10', true);
                return false;
            };
            if (this.mobile.length < 1) {
                this.showtoast('请输入联系方式', true);
                return false;
            };
            if (!valid.phone(this.mobile)) {
                this.showtoast('联系方式格式不正确', true);
                return false;
            };
            if (this.areaCode.length < 1) {
                this.showtoast('请输入邮政编码', true);
                return false;
            };
            if (!valid.areaCode(this.areaCode)) {
                this.showtoast('邮政编码格式错误', true);
                return false;
            }
            if (this.areaId.length < 1) {
                this.showtoast('所在地区不能为空', true);
                return false;
            };
            if (this.address.length < 1) {
                this.showtoast('详细地址不能为空', true);
                return false;
            };
            return true;
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
                if (response.data.respCode === '000000') {
                    this.output = response.data.output.areasList;
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (error) => {
                this.showtoast(error, true);
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
        }
    }
}
</script>
