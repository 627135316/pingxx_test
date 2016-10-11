import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const PingppEvents = new Mongo.Collection('PingppEvents');

const PingppEventSchema = new SimpleSchema({
    signed: { // 签名是否通过
        type: Boolean,
    },
    eventObj: { // 事件对象
        type: Object,
        blackbox: true,
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

PingppEvents.attachSchema(PingppEventSchema);

export { PingppEvents, PingppEventSchema };
