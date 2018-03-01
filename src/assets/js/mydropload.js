import Dropload from 'dropload';
var mydropload = function (ele, upFn, loadFn) {
    var config = {
        scrollArea: window,
        domUp: {
            domClass: 'dropload-up',
            domRefresh: '<div class="dropload-refresh"></div>',
            domUpdate: '<div class="dropload-update"></div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span></div>'
        },
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh" id="upmore" style="color:rgb(168, 175, 172);height:95px;display: -webkit-box;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-box-pack: center;-webkit-justify-content: center;-ms-flex-pack: center;justify-content: center;-webkit-box-align: center;-webkit-align-items: center;-ms-flex-align: center;align-items: center;"><img style="width:89px;height:43px;" src="../../wapStatic/img/load.png"/></div>',
            domLoad: '<div class="dropload-load" style="color:rgb(168, 175, 172);"><span class="loading"></span>加载中...</div>',
            domNoData: ''
            // '<div class="dropload-noData" id="nodata" style="color:rgb(168, 175, 172);padding-top:18px;">全部都在这里啦</div>'
        },
        threshold: '200'
    }
    if (typeof upFn === 'function') {
        config.loadUpFn = upFn;
    }
    if (typeof loadFn === 'function') {
        config.loadDownFn = loadFn;
    }
    // $(ele)
    var d = new Dropload(ele, config);
    return d;
}
export default mydropload;