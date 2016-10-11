import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Transactions = new Mongo.Collection('Transactions');

const TransactionSchema = new SimpleSchema({
    userId: {
        type: String,
    },
    type: { // 支付方式
        type: String,
    },
    tag: { // 标签
        type: Number,
    },
    subject: { // 主题
        type: String,
    },
    body: { // 描述
        type: String,
    },
    clientAddress: { // 客户端地址
        type: String,
    },
    params: { // 参数列表
        type: Object,
        blackbox: true,
        optional: true,
    },
    openId: { // 用户openId
        type: String,
        optional: true,
    },
    chargeObj: { // 提起支付回调返回对象
        type: Object,
        blackbox: true,
        optional: true,
    },
    errObj: { // 提起支付回调失败对象
        type: Object,
        blackbox: true,
        optional: true,
    },
    state: { // 状态，1：未支付；2：已支付；3：已处理
        type: Number,
    },
    createdAt: {
        type: Date,
        // eslint-disable-next-line object-shorthand, func-names
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return { $setOnInsert: new Date() };
            }
            this.unset();  // Prevent user from supplying their own value
            return undefined;
        },
        denyUpdate: true,
    },
    updatedAt: {
        type: Date,
        // eslint-disable-next-line object-shorthand, func-names
        autoValue: function () {
            if (this.isUpdate) {
                return new Date();
            }
            return undefined;
        },
        denyInsert: true,
        optional: true,
    },
});

Transactions.attachSchema(TransactionSchema);

export { Transactions, TransactionSchema };
