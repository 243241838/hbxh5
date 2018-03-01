import request from './interface/request';
let myPromise = {
    // 请求参数, 请求方法名, 数据列表, 后台返回列表名称, dropload
    pagination: (config, funName, productList, me) => {
        if (me) {
            // 阻止刷新
            me.isLockUp = true;
        }
        let promise = new Promise((resolve, reject) => {
            request[funName](config, (response) => {
                // console.log(response.data.output)
                // response.data.respCode = '100106'
                if (response.data.respCode === '000000') {
                    let arr = [];
                    if (config.pageIndex === 1) {
                        productList = [];
                    }
                    if (productList) {
                        arr = productList;
                    }
                    response.data.output.map((item) => {
                        arr.push(item);
                    })
                    productList = arr;
                    if (arr.length >= parseInt(response.data.output.totalCount)) {
                        // no data
                        me.isLockDown = true;
                        me.isData = false;
                    } else {
                        config.pageIndex++;
                    }
                    let obj = new window.Object();
                    obj = {
                        pageIndex: config.pageIndex,
                        productList: productList
                    }
                    resolve(obj);
                } else {
                    reject(response)
                }
            }, () => {
            })
        });
        return promise;
    }
}
export default myPromise;
