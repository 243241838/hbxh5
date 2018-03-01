import {Common, storage} from './common.js';
import Cookies from 'js/Cookies/Cookies.js';
import request from './interface/request.js';
export default {
    config (wx, data) {
        wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareAppMessage',
                'onMenuShareTimeline',
                'onMenuShareQQ',
                'onMenuShareWeibo'
            ]
        });
    },
    // 判断当前客户端版本是否支持指定JS接口
    checkJsApi (wx) {
        wx.checkJsApi({
            jsApiList: [
                'onMenuShareAppMessage',
                'onMenuShareTimeline',
                'onMenuShareQQ',
                'onMenuShareWeibo'
            ],
            success: (res) => {
            }
        });
    },
    ready (wx, fn) {
        wx.ready((res) => {
            fn();
        });
        wx.error((res) => {
        });
    },
    // 用户授权
    getAccess (appid, url) {
        var link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appid +'&redirect_uri='+ window.encodeURIComponent(url) +'&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';
        window.location.href = link;
        return false;
    },
    // 登录取得用户信息
    wxAuthLogin (code, unionId) {
        let obj = {};
        if (unionId) {
            obj.code = code;
            obj.unionId = unionId;
        } else {
            obj.code = code;
        }
        window.headers.sessionId = storage.get('sessionId') ? storage.get('sessionId') : '';
        // window.alert(JSON.stringify(obj));
        request.wxAuthLogin(obj, (response) => {
            // window.alert(JSON.stringify(response));
            if (response.data.respCode === '000000') {
                let output = response.data.output;
                if (output && output.mobile) {
                    storage.set('sessionId', output.sessionId);// 保存会话id
                    storage.set('userInfo', JSON.stringify(output));
                    storage.set('userId', output.userId);
                    storage.set('unionId', output.unionId);
                    storage.set('mobile', output.mobile);
                } else if (output && !output.mobile) {
                    storage.set('unionId', output.unionId);
                    window.location.href = window.location.href.split('wap/')[0] + 'wap/FQLogin.html';
                }
                window.location.reload();
            } else {
                // window.alert(response.data.respMsg);
            }
        }, (err) => {
            console.log(JSON.stringify(err));
        })
    },
    momoAccess (appId, url) {
        // window.alert('用户授权(静默)');
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appId +'&redirect_uri='+ window.encodeURIComponent(url) +'&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect';
        return false;
    },
    // 用户授权(静默)
    getAccessNone (url) {
        if (Common.getQueryString('code')) {
            this.wxAuthLogin(Common.getQueryString('code'), storage.get('unionId'));
        } else {
            if (!window.appId) {
                this.getAppId((appId) => {
                    window.appId = appId;
                    this.momoAccess(appId, url);
                })
            } else {
                this.momoAccess(window.appId, url);
            }
        }
    },
    // 获取appid
    getAppId (callback) {
        let obj = {
            url: window.location.href
        }
        request.getWXJsAPISignature(obj, (response) => {
            if (response.data.respCode === '000000') {
                if (typeof callback === 'function') {
                    callback(response.data.output.appId);
                }
            }
        }, () => {
            // this.showtoast('网络错误，请查看网络是否连接', true);
        })
    },
    initShare (wx, type, params) {
        var data = {};
        if (type === 1) {
            data = {
                title: '汇保险车险季，免息月付买车险',
                desc: '汇保险车险分期，0首付，0利息，0手续费！',
                link: window.location.href.split('wap/')[0] + 'wap/FQcarInfo.html',
                imgUrl: 'http://image.51hbx.com/resource/images/installment/share/hbxlogo.png' + '?t=' + new Date().getTime(),
                type: '',
                dataUrl: ''
            }
        } else if (type === 2) {
            data = {
                title: '扫一扫，快速加入汇保险大家庭',
                desc: '心动不如行动！加入汇保险，跟我一起躺着出单赚钱！',
                link: window.location.href.split('wap/')[0] + 'wap/FQinvite.html?referrerUserId='+ params,
                imgUrl: 'http://image.51hbx.com/resource/images/installment/share/invite.png' + '?t=' + new Date().getTime(),
                type: '',
                dataUrl: ''
            }
        } else if (type === 3) {
            data = {
                title: '既见君子，云胡不喜。汇保险好礼相赠',
                desc: '汇保险新人注册即有好礼相赠，9月底车险到期车主更有双重好礼！',
                link: window.location.href.split('wap/')[0] + 'wap/FQnewRegist.html',
                imgUrl: 'http://image.51hbx.com/resource/images/installment/share/hbxlogo.png' + '?t=' + new Date().getTime(),
                type: '',
                dataUrl: ''
            }
        } else if (type === 4) {
            data = {
                title: '戳这里，教你免息月付买车险！',
                desc: '汇保险车险分期，0首付，0利息，0手续费！',
                link: window.location.href.split('wap/')[0] + 'wap/FQgreenHands.html',
                imgUrl: 'http://image.51hbx.com/resource/images/installment/share/hbxlogo.png' + '?t=' + new Date().getTime(),
                type: '',
                dataUrl: ''
            }
        }
        this.share(wx, data);
    },
    // 分享
    share (wx, data, fn, errFn) {
        // 分享到朋友圈
        wx.onMenuShareTimeline({
            title: data.title,
            link: data.link,
            imgUrl: data.imgUrl,
            success: () => {
            },
            cancel: () => {
            }
        });
        // 分享给朋友
        wx.onMenuShareAppMessage({
            title: data.title,
            link: data.link,
            imgUrl: data.imgUrl,
            desc: data.desc,
            type: data.type,
            dataUrl: data.dataUrl,
            success: () => {
            },
            cancel: () => {
            }
        });
        // 分享到QQ
        wx.onMenuShareQQ({
            title: data.title,
            link: data.link,
            imgUrl: data.imgUrl,
            desc: data.desc,
            success: () => {
            },
            cancel: () => {
            }
        });
        // 分享到微博
        wx.onMenuShareWeibo({
            title: data.title,
            link: data.link,
            imgUrl: data.imgUrl,
            desc: data.desc,
            success: () => {
            },
            cancel: () => {
            }
        });
        // 分享到QQ空间
        wx.onMenuShareQZone({
            title: data.title,
            link: data.link,
            imgUrl: data.imgUrl,
            desc: data.desc,
            success: () => {
            },
            cancel: () => {
            }
        });
    }
}