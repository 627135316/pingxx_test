import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const UserAccounts = new Mongo.Collection('UserAccounts');

const UserAccountSchema = new SimpleSchema({
    userId: {
        type: String,
    },
    points: {
        type: Number,
    },
    cash: {
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

UserAccounts.attachSchema(UserAccountSchema);

export { UserAccounts, UserAccountSchema };
