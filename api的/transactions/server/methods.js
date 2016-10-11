import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import validator from '../../simple-schema-validator';

import { Transactions } from '../Transactions';

import { PingppHelper } from '../../../helpers/server/PingppHelper';

new ValidatedMethod({
    name: 'transactions.add-wx-pub-qr',
    validate: validator(new SimpleSchema({
        amount: {
            type: Number,
        },
    })),
    run({ amount }) {
        const transaction = {
            userId: Meteor.userId(),
            subject: `充值${amount / 100}元`,
            body: `充值${amount / 100}元`,
            type: 'pingpp:wx_pub_qr',
            clientAddress: this.connection.clientAddress,
            tag: 1,
            state: 1,
            params: { amount },
        };
        const id = Transactions.insert(transaction);
        PingppHelper.createPay(id);
        return id;
    },
});

new ValidatedMethod({
    name: 'transactions.test.add-wx-pub',
    validate: null,
    run() {
        const transaction = {
            userId: Meteor.userId(),
            subject: '购买100元服务',
            body: '购买100元服务',
            type: 'pingpp:wx_pub',
            openId: 'asdfasdfasdfasf',
            clientAddress: this.connection.clientAddress,
            tag: 1,
            state: 1,
            params: {
                amount: 10000,
            },
        };
        const id = Transactions.insert(transaction);
        return PingppHelper.createPay(id);
    },
});
