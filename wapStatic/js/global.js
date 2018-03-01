// 屏幕适配
;(function (doc, win, undefined) {
    var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in win? 'orientationchange' : 'resize',
    recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (clientWidth === undefined) return;
        docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
    };
    if (doc.addEventListener === undefined) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window);
// 请求头
window.headers = {
    height: 2392,
    width: 1440,
    osName: 'A',
    clientVersion: '1.0.0',
    clientType: 10,
    versionType: 2,
    deviceNo: 'FBE018F2-DBA7-4CB9-8DB2-2ED01D13046B',
    deviceName: 30,
    'Content-Type': 'application/json',
    sessionId: window.localStorage.getItem('sessionId') ? window.localStorage.getItem('sessionId') : '',
    domainId: '30' // 10:android;20:ios;30:h5
}
// 微信公众号id
window.appId = '';