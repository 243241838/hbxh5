import Cookies from 'js-cookie';
export default {
    // 支付
    getPaymentInfo: function () {
        if (Cookies.get('paymentInfo')) {
            return JSON.parse(Cookies.get('paymentInfo'));
        } else {
            return '';
        }
    },
    setPaymentInfo: function (value) {
        Cookies.set('paymentInfo', value);
    },
    removePaymentInfo: function () {
        Cookies.remove('paymentInfo');
    },
    // 红包列表里的某个红包
    getRedPacket: function () {
        if (Cookies.get('redPacket')) {
            return JSON.parse(Cookies.get('redPacket'));
        } else {
            return '';
        }
    },
    setRedPacket: function (value) {
        Cookies.set('redPacket', value);
    },
    removeRedPacket: function () {
        Cookies.remove('redPacket');
    },
    // sessionId
    getSessionId: function () {
        if (Cookies.get('sessionId')) {
            return Cookies.get('sessionId');
        } else {
            return '';
        }
    },
    setSessionId: function (value) {
        Cookies.set('sessionId', value);
    },
    removeSessionId: function () {
        Cookies.remove('sessionId');
    }
}