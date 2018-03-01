import Countdown from 'countdown-js';
import Cookies from './Cookies/Cookies.js';
var ostorage = window.localStorage;
const storage = {
    // localStorage存入
    set: function (name, val) {
        ostorage.setItem(name, val);
    },
    // localStorage取出
    get: function (name) {
        return ostorage.getItem(name);
    },
    remove: function (name) {
        ostorage.removeItem(name);
    }
};
window.String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
}
function isWeiXin () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/micromessenger/i)) {
        if (JSON.stringify(ua.match(/micromessenger/i)[0]) === '"micromessenger"') {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
const Common = {
    isLogin: function () {
        if (isWeiXin()) {
            if (!Common.getUserId()) {
                return false;
            } else {
                return true;
            }
        } else {
            if (!storage.get('sessionId')) {
                return false;
            } else {
                return true;
            }
        }
    },
    // 取得样式
    getStyle: function (dom, styleName) {
        if (dom.currentStyle) {
            return dom.currentStyle[styleName];
        } else {
            return window.getComputedStyle(dom, false)[styleName];
        }
    },
    stringTojson: (data) => {
        var odata = data.split(';');
        var allDate = [];
        for (var i = 0; i < odata.length; i++) {
            var oneDate = odata[i].split('_');
            allDate.push(oneDate);
        }
        return allDate;
    },
    // 窗口的高度
    windowHeight: function () {
        if (window.innerHeight !== undefined) {
            return window.innerHeight;
        } else {
            var B = document.body;
            var D = document.documentElement;
            return Math.min(D.clientHeight, B.clientHeight);
        }
    },
    // body的高度
    bodyHeight: function () {
        return parseInt(Common.getStyle(document.getElementsByTagName('body')[0], 'height'));
    },
    // body是否占满全屏
    isFullScreen: function () {
        if (Common.bodyHeight() < Common.windowHeight()) {
            return false;
        }
        return true;
    },
    // 设置body为全屏, 不传参数默认body
    setFullScreen: function (dom) {
        // 设置元素的高度100%
        if (dom) {
            if (parseInt(Common.getStyle(dom, 'height')) < Common.windowHeight()) {
                dom.style.height = Common.windowHeight() + 'px';
            } else {
                dom.style.height = 'auto';
                if (parseInt(Common.getStyle(dom, 'height')) < Common.windowHeight()) {
                    dom.style.height = Common.windowHeight() + 'px';
                }
            }
        } else {
            // 不是全屏
            if (!Common.isFullScreen()) {
                document.getElementsByTagName('body')[0].style.height = Common.windowHeight() + 'px';
            } else {
                // 已经全屏,设置为自动
                document.getElementsByTagName('body')[0].style.height = 'auto';
                // 自动适应后不是全屏
                if (!Common.isFullScreen()) {
                    document.getElementsByTagName('body')[0].style.height = Common.windowHeight() + 'px';
                }
            }
        }
    },
    // 获取地址栏参数
    getQueryString: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    /**
     * [countdown 倒计时]
     * @param {[Object]} time [时间对象{days: '',hours: '',minutes: '',seconds: ''}]
     * @param {[Number]}  endTime [结束时间-毫秒]
     * @param {[Boolean]} isTimeout [是否过期]
     * @param {[Function]} callback [回调方法]
    */
    countdown: function (time, endTime, isTimeout, callback) {
        if (new Date().getTime() > endTime) {
            isTimeout = true;
            callback(time, isTimeout);
            return;
        } else {
            isTimeout = false;
        }
        let arr = Object.keys(time);
        let timer = Countdown.timer(endTime, (timeLeft) => {
            isTimeout = false;
            time = timeLeft;
            for (let i = 0; i < arr.length; i++) {
                if (timeLeft[arr[i]] < 10) {
                    time[arr[i]] = '0' + timeLeft[arr[i]];
                }
            }
            callback(time, isTimeout);
        }, () => {
            isTimeout = true;
            callback(time, isTimeout);
        })
    },
    // 名字省略显示
    ellipsisName: function (value) {
        if (!value) {
            return;
        }
        if (value.length === 2) {
            return value[0] + '*';
        } else if (value.length >= 3) {
            var str = value.substring(0, 1);
            for (var i = 1; i < value.length - 1; i++) {
                str += '*';
            }
            return str + value.substring(value.length - 1);
        } else {
            return '*';
        }
    },
    // 去掉前后空格
    Trim (str) {
        if (str || parseInt(str) === 0) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        } else {
            return '';
        }
    },
    // 身份证省略显示
    ellipsisId: function (value) {
        if (!value) {
            return;
        }
        var str = value.substring(0, 4);
        for (var i = 4; i < value.length - 4; i++) {
            str += '*';
        }
        return str + value.substring(value.length - 4);
    },
    // 保存userId
    setUserId: function (userId) {
        storage.set('userId', userId);
    },
    // 取得userId
    getUserId: function () {
        return storage.get('userId');
    },
    // 删除userId
    removeUserId: function () {
        storage.remove('userId');
    },
    // 获取当前时间的后几天和前几天 用法 GetDateStr(60), 60天后 格式1990-06-07
    GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        m = m < 10 ? ('0' + m) : m;
        var d = dd.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    },
    // 获取当前时间的后几天和前几天 用法 GetDateStr(60), 60天后 格式19900607
    GetDateStr1(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        m = m < 10 ? ('0' + m) : m;
        var d = dd.getDate();
        d = d < 10 ? ('0' + d) : d;
        return '' + y + m + d + '';
    },
    // 标准格式转换成19701101
    formatNewDate: function (date) {
        var month = parseInt(date.getMonth()) + 1;
        var day = parseInt(date.getDate());
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        var result = '' + date.getFullYear() + month + '' + day;
        // console.log(result)
        return result;
    },
    //标准格式转换成1970-11-01
    formatNewDate1: function (date) {
        var month = parseInt(date.getMonth()) + 1;
        var day = parseInt(date.getDate());
        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        var result = '' + date.getFullYear() + '-' + month + '-' + day;
        return result;
    }
}
var valid = {
    /**
     * [ID 身份证验证]
     * @param {[type]} gets [description]
     */
    ID: function (gets) {
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子;
        var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值，10代表X;
        if (gets.length === 15) {
            return isValidityBrithBy15IdCard(gets);
        } else if (gets.length === 18) {
            var aidCard = gets.split(''); // 得到身份证数组
            if (isValidityBrithBy18IdCard(gets) && isTrueValidateCodeBy18IdCard(aidCard)) {
                return true;
            }
            return false;
        }
        return false;

        function isTrueValidateCodeBy18IdCard (aidCard) {
            var sum = 0; // 声明加权求和变量
            if (aidCard[17].toLowerCase() === 'x') {
                aidCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
            }
            for (var i = 0; i < 17; i++) {
                sum += Wi[i] * aidCard[i]; // 加权求和
            }
            var valCodePosition = sum % 11; // 得到验证码所位置
            if (parseInt(aidCard[17]) === ValideCode[valCodePosition]) {
                return true;
            }
            return false;
        }

        function isValidityBrithBy18IdCard (idCard18) {
            var year = idCard18.substring(6, 10);
            var month = idCard18.substring(10, 12);
            var day = idCard18.substring(12, 14);
            var tempdate = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 这里用getFullYear()获取年份，避免千年虫问题
            if (tempdate.getFullYear() !== parseFloat(year) || tempdate.getMonth() !== parseFloat(month) - 1 || tempdate.getDate() !== parseFloat(day)) {
                console.log('身份证生日错误')
                return false;
            }
            return true;
        }

        function isValidityBrithBy15IdCard (idCard15) {
            var year = idCard15.substring(6, 8);
            var month = idCard15.substring(8, 10);
            var day = idCard15.substring(10, 12);
            var tempdate = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
            if (tempdate.getYear() !== parseFloat(year) || tempdate.getMonth() !== parseFloat(month) - 1 || tempdate.getDate() !== parseFloat(day)) {
                return false;
            }
            return true;
        }
    },
    /**
     * [phone 手机验证]
     * @param  {[type]} gets [description]
     * @return {[type]}      [description]
     */
    phone: function (gets) {
        if (/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$|17[0-9]{9}$/.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * [plateNumber 车牌号验证]
     * @param  {[type]} gets [description]
     * @return {[type]}      [description]
     */
    plateNumber: function (gets) {
        var re = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{5}$/; // 车牌号
        if (gets.search(re) === -1) {
            return false;
        } else {
            return true;
        }
    },
    // 车辆品牌验证
    CarBrand: function (gets) {
        var re = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/; // 品牌
        if (re.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    // 车辆品牌验证
    CarNumber: function (gets) {
        var re = /^[a-zA-Z0-9]+$/; // 品牌
        if (re.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * [userName 姓名验证]
     * @param  {[type]} gets [description]
     * @return {[type]}      [description]
     */
    userName: function (gets) {
        /* var re = /^[\u4e00-\u9fa5]{2,20}$/;2到20个中文字符 */
        var re = /^[A-Za-z]|[\u4e00-\u9fa5]{2,20}$/;
        if (re.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    // 中文名字
    cneeName: function (gets) {
        var re = /^[\u4e00-\u9fa5]{1,10}$/;
        if (re.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    // 信息页面时间 20170909
    time: function (gets) {
        var re = /^[0-9]{8}$/; // 品牌
        if (re.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    // 昵称
    nickName: function (gets) {
        var re = /^[\u4E00-\u9FA5A-Za-z0-9_]{1,6}$/;
        if (re.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    // 其他 //中文，数字，母
    else: function (gets) {
        var re = /^[\u4E00-\u9FA5A-Za-z0-9_]{1,40}$/;
        if (re.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    // 邮政编码验证
    areaCode: function (gets) {
        var re = /[1-9]\d{5}(?!\d)/;
        if (re.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    // 密码 检测密码由6-20字母和数字组成，不能是纯数字或纯英文
    password: function (value) {
        var re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        if (re.test(value)) {
            return true;
        } else {
            return false;
        }
    },
    // 支付密码 6-12位数字字母组成
    PayPassword: function (gets) {
        var re = /^[\da-zA-z]{6,12}$/;
        if (re.test(gets)) {
            return true;
        } else {
            return false;
        }
    },
    contrastDate: function (a, b) {
        var arr = a.split('-');
        var startTime = new Date(arr[0], arr[1] - 1, arr[2]);
        var startTimes = startTime.getTime();
        var arrs = b.split('-');
        var endTime = new Date(arrs[0], arrs[1] - 1, arrs[2]);
        var endTimes = endTime.getTime();
        if (startTimes >= endTimes) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * [邮箱验证 description]
     * @param  {[type]}  gets [description]
     * @return {Boolean}      [description]
     */
    isEmail: function (gets) {
        var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        return reg.test(gets);
    },
    /**
     * [地址验证 description]
     * @param  {[type]} gets [description]
     * @return {[type]}      [description]
     */
    address: function (gets) {
        var reg = /^[A-Za-z]|[\u4e00-\u9fa5]|[0-9]{4,}$/;
        return reg.test(gets);
    },
    // 是否是微信浏览器
    isWeiXin: function () {
        return isWeiXin();
    },
    // ios设备
    isIOS: function () {
        var u = navigator.userAgent;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        return isIOS;
    },
    // android设备
    isAndroid: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        return isAndroid;
    }
};
export {
    valid,
    Common,
    storage
}