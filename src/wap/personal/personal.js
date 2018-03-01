import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)
// scss
import './scss/personal.scss';
// 路由
import accountSecurity from './components/accountSecurity.vue';
import bindPhone from './components/bindPhone.vue';
import changePhone from './components/changePhone.vue';
import edmitPayPassword from './components/edmitPayPassword.vue';
import homeAddLocation from './components/homeAddLocation.vue';
import homeLocation from './components/homeLocation.vue';
import homeOrder from './components/homeOrder.vue';
import homepageMycenter from './components/homepageMycenter.vue';
import homepersonaldata from './components/homepersonaldata.vue';
import homePolicy from './components/homePolicy.vue';
import homePolicy2 from './components/homePolicy2.vue';
import loginIdcard from './components/loginIdcard.vue';
import modifyPassword from './components/modifyPassword.vue';
import setFinishPayPassword from './components/setFinishPayPassword.vue';
import setLoginPassword from './components/setLoginPassword.vue';
import setPayPassword from './components/setPayPassword.vue';
import verifyPassword from './components/verifyPassword.vue';
import helpCenter from './components/helpCenter.vue';
import verifyPhone from './components/verifyPhone.vue';
import surrender from './components/surrender.vue';
import surrenderDetail from './components/surrenderDetail.vue';
import progressQuery from './components/progressQuery.vue';
import applyClaims from './components/applyClaims.vue';
import InfoCenter from './components/InfoCenter.vue';
import myClaims from './components/myClaims.vue';
import apply from './components/apply.vue';
// 路由
const router = new VueRouter({
    routes: [
        {name: 'accountSecurity', path: '/accountSecurity', component: accountSecurity}, // 账户安全
        {name: 'changePhone', path: '/changePhone', component: changePhone}, // 换绑手机
        {name: 'homeAddLocation', path: '/homeAddLocation/:address', component: homeAddLocation}, // 添加地址
        {name: 'homeLocation', path: '/homeLocation', component: homeLocation}, // 地址管理
        {name: 'homeOrder', path: '/homeOrder', component: homeOrder}, // 我的订单
        {name: 'homepageMycenter', path: '/', component: homepageMycenter}, // 个人中心主页
        {name: 'homepersonaldata', path: '/homepersonaldata', component: homepersonaldata}, // 个人资料
        {name: 'homePolicy', path: '/homePolicy', component: homePolicy}, // 我的保单
        {name: 'homePolicy2', path: '/homePolicy2', component: homePolicy2}, // 我的保单
        {name: 'modifyPassword', path: '/modifyPassword', component: modifyPassword}, // 修改密码
        {name: 'setLoginPassword', path: '/setLoginPassword', component: setLoginPassword}, // 设置登录密码
        {name: 'setPayPassword', path: '/setPayPassword', component: setPayPassword}, // 设置支付密码
        {name: 'setFinishPayPassword', path: '/setFinishPayPassword', component: setFinishPayPassword}, // 完成支付密码
        {name: 'verifyPhone', path: '/verifyPhone', component: verifyPhone}, // 验证手机
        {name: 'verifyPassword', path: '/verifyPassword', component: verifyPassword}, // 验证密码
        {name: 'edmitPayPassword', path: '/edmitPayPassword', component: edmitPayPassword}, // 修改支付密码
        {name: 'loginIdcard', path: '/loginIdcard', component: loginIdcard}, // 登录身份验证
        {name: 'bindPhone', path: '/bindPhone', component: bindPhone}, // 绑定手机
        {name: 'helpCenter', path: '/helpCenter', component: helpCenter}, //帮助中心
        {name: 'applyClaims', path: '/applyClaims', component: applyClaims}, // 申请理赔
        {name: 'InfoCenter', path: '/InfoCenter', component: InfoCenter}, //客服中心
        {name: 'myClaims', path: '/myClaims', component: myClaims}, // 申请理赔
        {name: 'apply', path: '/apply', component: apply}, // 申请理赔填单
        {name: 'surrender', path: '/surrender', component: surrender}, // 退保管理首页
        {name: 'surrenderDetail', path: '/surrenderDetail', component: surrenderDetail}, //退保详情
        {name: 'progressQuery', path: '/progressQuery', component: progressQuery} //退保进度查询
    ]
})
// 页面跳转方向
let p = new Vue({
    router,
    data () {
        return {
            transitionName: 'slide-left'
        }
    },
    // render: h => h(p),
    template: '<transition :name="transitionName"><router-view class="child-view"></router-view></transition>',
    created () {
        this.beforeEach();
    },
    mounted () {
        this.$nextTick(() => {
            this.beforeEach();
        })
    },
    methods: {
        beforeEach () {
            this.$router.beforeEach((to, from, next) => {
                if (document.querySelector('.dropload-down')) {
                    document.querySelector('.dropload-down').outerHTML = '';
                }
                this.transitionName = this.dir(to.name, from.name)
                next();
            })
        },
        dir (to, from) {
            let slideDir = 'slide-left';
            switch (to) {
            case 'homepageMycenter':
                switch (from) {
                case 'homeOrder':
                case 'homePolicy':
                case 'homeLocation':
                case 'accountSecurity':
                case 'homepersonaldata':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'homepersonaldata':
                switch (from) {
                case 'accountSecurity':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'accountSecurity':
                switch (from) {
                case 'modifyPassword':
                case 'setLoginPassword':
                case 'setPayPassword':
                case 'setFinishPayPassword':
                case 'changePhone':
                case 'edmitPayPassword':
                case 'bindPhone':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'changePhone':
                switch (from) {
                case 'verifyPassword':
                case 'bindPhone':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'setFinishPayPassword':
                switch (from) {
                case 'verifyPhone':
                case 'verifyPassword':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'verifyPhone':
                switch (from) {
                case 'edmitPayPassword':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'verifyPassword':
                switch (from) {
                case 'edmitPayPassword':
                case 'bindPhone':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'homeLocation':
                switch (from) {
                case 'homeAddLocation':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'homePolicy':
                switch (from) {
                case 'homePolicy2':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            default:
                slideDir = 'slide-left';
                break;
            case 'apply':
                switch (from) {
                case 'helpCenter':
                case 'myClaims':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'helpCenter':
                switch (from) {
                case 'InfoCenter':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'applyClaims':
                switch (from) {
                case 'myClaims':
                case 'apply':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            case 'surrender':
                switch (from) {
                case 'surrenderDetail':
                case 'progressQuery':
                    slideDir = 'slide-right';
                    break;
                default :
                    slideDir = 'slide-left';
                    break;
                }
                break;
            }
            return slideDir;
        }
    }
}).$mount('#personal');