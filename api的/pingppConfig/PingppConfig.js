import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const PingppConfig = new Mongo.Collection('PingppConfig');

const PingppConfigSchema = new SimpleSchema({
    appId: {
        type: String,
    },
    apiKey: {
        type: String,
    },
    privateKey: {
        type: String,
    },
    pingppPubKey: {
        type: String,
    },
});

PingppConfig.attachSchema(PingppConfigSchema);

export { PingppConfig, PingppConfigSchema };
