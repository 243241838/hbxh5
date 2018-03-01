var fs = require('fs');
var path = require('path');
var argument = process.argv.splice(2);
// 默认250
var server = 'http://10.1.100.250:8080/hbx-api-server/api.do';
if (argument[0] === 'aliyun') {
    // 阿里云
    server = 'http://www.51hbx.com/api/api.do';
} else if (argument[0] === 'test243') {
    // 243测试服务器
    // server = 'http://test.51hbx.com:2043/api/api.do';
    // server = 'http://10.25.1.130:8080/api/api.do'
    server = 'http://10.1.11.49:8080/api/api.do';
} else if (argument[0] === 'test250') {
    // 250测试服务器
    server = 'http://10.1.130.250:8080/hbx-api-server/api.do';
}
var data = 'module.exports = ' + JSON.stringify(server);
fs.writeFile(path.join(__dirname, 'server.js'), data, function (err) {
    if (err) {
        throw err;
    }
    console.log('change server is successful: ' + server);
})
// 10.25.1.110:8080/api/api.do //乔洋
//http://10.25.1.32:9999/api.do 彭家利
// 柯南 http://10.1.100.101:8080/api/api.do
// 柯南外网 http://183.129.223.66:1001/api/api.do
// 250外网 http://183.129.223.66:2050/hbx-api-server/api.do // 外网
// 张海 http://10.1.100.156:8080//api.do

// http://test.51hbx.com:1005/wap/index.html
// 启动服务端口8080