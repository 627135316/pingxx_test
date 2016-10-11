import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const PingppRequests = new Mongo.Collection('PingppRequests');

const PingppRequestSchema = new SimpleSchema({
    type: { // 类型，1：请求；2：正常；3：错误；
        type: Number,
    },
    reqObj: { // 请求对象，三者存一种
        type: Object,
        blackbox: true,
        optional: true,
    },
    resObj: { // 回调正常对象，三者存一种
        type: Object,
        blackbox: true,
        optional: true,
    },
    errObj: { // 错误对象，三者存一种
        type: Object,
        blackbox: true,
        optional: true,
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
});

PingppRequests.attachSchema(PingppRequestSchema);

export { PingppRequests, PingppRequestSchema };
