import { Meteor } from 'meteor/meteor';

import { UserAccounts } from '../UserAccounts';

// eslint-disable-next-line func-names
Meteor.publish('user-account', function () {
    return UserAccounts.find({ userId: this.userId });
});
