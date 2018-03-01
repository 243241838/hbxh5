var Data = {
    relationArr: [
        {type: '1', content: '本人'},
        {type: '2', content: '配偶'},
        {type: '3', content: '父母'},
        {type: '4', content: '子女'},
        {type: '5', content: '雇主'},
        {type: '6', content: '雇员'},
        {type: '7', content: '祖父母'},
        {type: '8', content: '孙子女'},
        {type: '9', content: '亲属'},
        {type: '10', content: '朋友'},
        {type: '11', content: '监护人'},
        {type: '12', content: '被监护人'},
        {type: '99', content: '其他'},
        {type: '0', content: '未知'}
    ],
    idTypeArr: ['其他', '身份证', '军官证', '护照', '驾驶证', '港澳台通行证/回乡证'],
    paymentStatus: [
        {
            type: '7',
            content: '核保中'
        },
        {
            type: '10',
            content: '待支付'
        },
        {
            type: '20',
            content: '已支付'
        },
        {
            type: '35',
            content: '已完成'
        },
        {
            type: '50',
            content: '已退款'
        },
        {
            type: '-11',
            content: '已失效'
        },
        {
            type: '60',
            content: '待出单'
        }
    ]
}
export default Data;