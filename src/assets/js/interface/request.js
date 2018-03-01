import axios from 'axios';
import md5 from 'md5';
import {
  Common,
  storage
} from 'js/common.js';
import Cookies from '../Cookies/Cookies.js';
import url from '../../../../build/server.js';
var md5Key = 'md5_key';
 //var url = '/lifeservice'; // 代理
var arr = [
    'getVerifyCode', // 获取验证码 3.4.1
    'getVerifyCode', // 获取验证码 3.4.1
    'verifyPayPwd', //  4.9.4.校验支付密码(verifyPayPwd)
    'verifyCode',
    'updateMobile', // 4.1.4.修改手机号码
    'regUser', // 注册 3.1.2
    'login', // 登录 3.2.1
    'logout', // 登录注销 3.2.2
    'feedBack', // 4.1.14.用户升意见反馈(feedBack)
    'resetLoginPwd', // 4.1.7.重设登录密码(resetLoginPwd)
    'updateLoginPwd', // 4.1.3.修改登录密码(updateLoginPwd)
    'findPasswordVerify', // 4.1.4 找回密码验证
    'findPassword', // 4.1.5 找回密码(findPassword)
    'getTrades', // 个人中心 我的订单列表 4.8.1.1
    'getPolicies', // 个人中心 我的保单列表 4.8.2
    'getUserInfo', // 获取用户信息 4.1.1
    'updateUserInfo', // 4.1.2.修改用户信息(updateUserInfo)
    'getConsignees', // 4.5.1. 获取收货人信息(getConsignees)
    'addConsignee', // 4.5.4.新增收货人(addConsignee)
    'updateConsignee', // 4.5.5 修改收货人信息(updateConsignee)
    'defualtConsignee', // 4.5.7 设置默认地址(defualtConsignee)
    'delConsignee', // 4.5.6 删除收货人(delConsignee)
    'setPayPwd', // 4.9.1 设置支付密码(setPayPwd)
    'modPayPwd', // 4.9.2 修改支付密码(modPayPwd)
    'forgetPayPwd', // 4.9.3 忘记支付密码(forgetPayPwd)
    'getProductTypeNew', // 5.3.1 获取保险分类列表(getProductTypeNew)
    'getAreaList', // 10.2.1 获取地区信息(getAreaList)
    'getBannerInfo', // 3.3.2 获取Banner信息
    'getTradeDetail', // 订单详情 保单详情 4.8.3
    'getOccupationType', // 6.1.1.获取职业分类信息(getOccupationType)
    'applyTrade', // 提交订单 6.1.4
    'cancelTrade',
    'getTradePayment', // 获取订单支付信息 6.1.5
    'getPaySign', // 获取支付签名信息 6.1.6 // var url = 'http://192.168.32.95:8080/api/api.do';
    'commitCarIns', // 车险(确认车险) 7.1.6.车险提交核保(commitCarIns)
    'getUserCouponsList', // 确认支付红包 6.1.4.2
    'getProductQa', // 产品问答 5.3.10
    'getSpecialProductList', // 5.2.3 分页获取爆款产品列表 (getSpecialProductList)
    'getSpecialDetail', // 5.2.2 获取专题详情
    'getAdsList', // 5.2.4 获取优选活动列表(getAdsList)
    'getSpecials', // 5.2.1 获取专题列表(getSpecials)
    'getProducts', // 5.3.3 获取产品列表(getProducts)
    'getHotKeys', // 5.3.2 获取系统搜索热词(getHotKeys)
    'getProductCase', // 案例分析 5.3.9
    'getProductGuide', // 理赔指南
    'getProductPrompt', // 健康告知
    'getProductClause', // 投保须知
    'getProductTerms', // 产品条款
    'getProductDetail', // 产品详情
    'getInsurers', // 5.1.1.获取保险公司列表(getInsurers)
    'getAvaCarAreas', // 7.1.1 获取车险投保地区(getAvaCarAreas)
    'checkCarInsState', // 查询车辆是否可以投保
    'compCarProps', // 补充车辆信息
    'getCarInsCalc', // 车辆保费计算
    'getOrderStatus', //7.1.9.查询车险订单状态（getOrderStatus）
    'queryCarOrderInsState', // 车险投保状态查询
    'reqCarInsPay', // 车险支付请求
    'getCancelInsuredList', //查询退保列表
    'getAllowCancelInsuredList', //获取可退保接口
    'cancelOrder', //申请退保
    //===========================================公用========================================//
    'getOssTokenOnJs', // 10.2.3 获取OSSToken信息(getOssTokenOnJs)
    'getOssToken',
    'getWXJsAPISignature', // 微信相关接口文档没有
    'wxAuthLogin',
    'wxBindMobile',
    //===========================================车险分期======================================//
    'queryIsPriceAndTrade', // 车险补充信息 12.2.提交报价信息 (submitPriceInfo)
    'submitPriceInfo', // 车险补充信息 12.2.提交报价信息 (submitPriceInfo)
    'getCarInfo', // 12.2.查询车辆信息 (queryPriceInfo)
    'getItemKind', // 车险调整投保方案 12.7.获取车险险别详情 (getItemKind)
    'getInsurersCar', //12.16.获取保险公司列表(getInsurersCar)
    'submitInsureBenefits', // 12.4.提交投保方案和险企信息 (submitInsureBenefits)
    'getPriceDetail', // 12.7.获取报价详情 (getPriceDetail)
    'getCarTrades', // 12.11.获取我的订单列表(getCarTrades)
    'applyInstallmentOrder', // 分期提交
    'getPriceList', // 12.6 获取报价列表
    'getPriceListDetail', // 12.6 获取询价列表详情
    'getCarTradeDetail', // 12.12 getCarTradeDetail 查看订单详情
    'cancelCarTrade', // 12.13 取消订单 (cancelCarTrade)
    'dispatchToDomin', // 去分期
    'getUserQRCodeUrl', // 邀请好友
    'carRegUser', // 12.17.车险分期用户注册(carRegUser)
    'getInstallmentInfo', // 12.15 获取分期详情
    'uploadImage', // 上传图片
    'updateImg', // 资料待补充
    'scanCredentialImgInfo', // 图片上传扫面
    'getBankShow', // 12.18 获取保险公司对应的银行账户(getBankShow)
    // 个人中心
    'getCarPolicies', // 12.20.获取我的保单列表(getCarPolicies)
    'getCustomerManage', // 12.21 获取我的客户
    'getUserPerformance', // 我的业绩
    'getCarUserInfo', // 12.22.获取我的客户资料(getCarUserInfo)
    'updateCustomerManage', // 12.23.客户资料修改(updateCustomerManage)
    //===========================================成为推广人员====================================//
    'applyAgent',
    'getApplyAgentStatus',
    'getLianLianAuthInfo',
    'getServiceInfoList',
    'getServiceInfo',
    'findClaimMsg', // 4.11.理赔管理
    'findClaimMsg', // 4.11.理赔管理
    'addClaimsRecords', //4.11.2.申请理赔（addClaimsRecords）
    'addClaimsImageRecords', //4.11.2.申请理赔（addClaimsRecords）
    'addClaimsVideoRecords', //4.11.4.申请理赔视频上传(/addClaimsVideoRecords)
    'addTempVideo', //.11.6.申请理赔图片上传(/addClaimsImageRecords)
    'getProductTerms' //5.3.8.获取产品保险条款信息 (getProductTerms)
];
let request = {}
arr.map((item, key) => {
    request[item] = function (data, fn, errFn) {
        if (data === undefined || data === null) {
            data = {};
        }
        var obj = {
            url: url,
            input: data,
            method: item
        }
        post(obj, fn, errFn);
    }
})
// post请求
function post(obj, fn, errFn) {
    var str = JSON.stringify(obj.input) + md5Key;
    str = str.replace(/\\/g, '');
    var sign = md5(str);
    // window.alert(JSON.stringify(window.headers));
    axios.post(obj.url, {
        input: obj.input,
        method: obj.method,
        sign: sign
    }, {
        headers: window.headers
    }).then((response) => {
        // console.log(response.data)
        //100107 会话超时
        if (response.data.respCode === '100106' || response.data.respCode === '100107') {
            let url = window.location.href;//记录强制跳转登录页时的url
            window.location.href = 'login.html?'+ url;
        }
        if (typeof fn === 'function') {
            fn(response);
        }
    }).catch((error) => {
        if (typeof errFn === 'function') {
            errFn(error);
        }
    })
}
export default request;
