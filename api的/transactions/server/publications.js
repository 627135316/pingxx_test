import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Transactions } from '../Transactions';

// eslint-disable-next-line func-names
Meteor.publish('transactions', function () {
    return Transactions.find({ userId: this.userId });
});

Meteor.publish('transaction', (id) => {
    check(id, String);
    return Transactions.find(id);
});
