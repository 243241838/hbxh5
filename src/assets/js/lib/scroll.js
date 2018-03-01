/**
 * 
 * @authors chenshw (chenshw@seaway.net.cn)
 * @date    2016-10-26 18:18:04
 * @version $Id$
 * @description 
 * @update [user] [date] [instruction]
 */

/*
 * 判断UA
 */
export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') > 0
export const isAndroid = UA && UA.indexOf('android') > 0
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
export const isWechat = /micromessenger/i.test(UA)

/* 
 * [addEventListener:监听Dom元素的事件 ]
 * target：监听对象 
 * type：监听函数类型，如click,mouseover 
 * func：监听函数 
 */
function addEventHandler(target, type, func) {
    if (target.addEventListener) {
        //监听IE9，谷歌和火狐 
        target.addEventListener(type, func, false);
    } else if (target.attachEvent) {
        target.attachEvent("on" + type, func);
    } else {
        target["on" + type] = func;
    }
}
/* 
 * [removeEventHandler:移除Dom元素的事件] 
 * target：监听对象 
 * type：监听函数类型，如click,mouseover 
 * func：监听函数 
 */
function removeEventHandler(target, type, func) {
    if (target.removeEventListener) {
        //监听IE9，谷歌和火狐 
        target.removeEventListener(type, func, false);
    } else if (target.detachEvent) {
        target.detachEvent("on" + type, func);
    } else {
        delete target["on" + type];
    }
}

/**
 * [upDownScroll 上线滚动]
 * @param  {[type]} pullDownFunc [description]
 * @param  {[type]} pullUpFunc   [description]
 * @return {[type]}              [description]
 * @update {[type]} upDownScroll [加id，非必传，防止page页面请求统一接口重复加载]
 */
export function UpDownScroll(pullDownFunc, pullUpFunc, id) {
    var _self = this,
        contentH = 0,
        dom = window,
        aDom = document.getElementById(id),
        isIos = false,
        isCallback = true,
        viewH = window.innerHeight; 
        _self.pullUpEl=null;
        _self.flag="wait";
    if (isIOS) {
        dom = aDom;
    }
    _self.pullUpEl=dom===window?document.getElementsByClassName("ui-fresh-text")[0]:dom.getElementsByClassName("ui-fresh-text")[0];
    addEventHandler(dom, "scroll", function(event) {
            var scrollTop=0;
            if (isIOS) {
                contentH = dom.getElementsByClassName("wrapper-scroll")[0].offsetHeight;
                scrollTop = dom.scrollTop;
            } else {
                contentH = document.body.scrollHeight;
                scrollTop= document.body.scrollTop;
            }
            // console.log(contentH)
            if (!document.getElementById(id)) {
                return;
            }
            
            // console.log(scrollTop)
            if(contentH - viewH - scrollTop <= 50){
            	// console.log(contentH - viewH - scrollTop)
                 if (!_self.flag || _self.flag == "wait") {
                     _self.pullUpEl.innerHTML='<i class="ui-loading"></i><p class="ui-loading-text">正在加载中...</p>';
                     _self.flag='loadding';
                      pullUpFunc(); 
                 }
            }

     })
}
//向下兼容
UpDownScroll.prototype.refresh = function() {
    this.pullUpEl.innerHTML='上拉加载更多...';
    this.flag='wait';
    // pullUpEl.html().show().data("flag", 'wait');
}
UpDownScroll.prototype.noIscroll = function() {
	this.pullUpEl.innerHTML='无更多数据';
    this.flag='nodata';
    // pullUpEl.html('<span class="ui-fresh-text">无更多数据</span>').show().data("flag", 'nodata');
}
