import { Meteor } from 'meteor/meteor';
import pingppObj from 'pingpp';
import crypto from 'crypto';

import { Transactions } from '../../api/transactions/Transactions';
import { PingppRequests } from '../../api/pingppRequests/PingppRequests';
import { PingppConfig } from '../../api/pingppConfig/PingppConfig';

let pingpp;
let createFn;

let pingppConfig = PingppConfig.findOne();

function reloadConfig() {
    pingpp = pingppObj(pingppConfig.apiKey);
    pingpp.setPrivateKey(pingppConfig.privateKey);
    if (!createFn) {
        createFn = Meteor.wrapAsync(pingpp.charges.create, pingpp.charges);
    }
}

PingppConfig.find().observe({
    changed: newDoc => {
        pingppConfig = newDoc;
        reloadConfig();
    },
});

if (pingppConfig) {
    reloadConfig();
}

class PingppHelper {
    static createPay(transactionId) {
        const transaction = Transactions.findOne(transactionId);
        try {
            let channel;
            let extra;

            switch (transaction.type) {
                case 'pingpp:wx_pub_qr':
                    channel = 'wx_pub_qr';
                    extra = {
                        product_id: transactionId,
                    };
                    break;
                case 'pingpp:wx_pub':
                    channel = 'wx_pub';
                    extra = {
                        open_id: transaction.openId,
                    };
                    break;
                default:
                    return 'unknown transaction type';
            }

            const obj = {
                subject: transaction.subject,
                body: transaction.body,
                amount: transaction.params.amount,
                order_no: transactionId,
                channel,
                currency: 'cny',
                client_ip: transaction.clientAddress,
                app: {
                    id: pingppConfig.appId,
                },
                extra,
            };
            PingppRequests.insert({
                type: 1,
                reqObj: obj,
            });
            const charge = createFn(obj);
            Transactions.update(transactionId, {
                $set: {
                    chargeObj: charge,
                },
            });
            PingppRequests.insert({
                type: 2,
                resObj: charge,
            });

            switch (transaction.type) {
                case 'pingpp:wx_pub_qr':
                    return charge.credential.wx_pub_qr;
                case 'pingpp:wx_pub':
                    return charge;
                default:
                    return 'unknown transaction type';
            }
        } catch (err) {
            PingppRequests.insert({
                type: 3,
                errObj: err,
            });
            Transactions.update(transactionId, {
                $set: {
                    errObj: err,
                },
            });
        }
        return null;
    }
    static testSignature(data, signature) {
        const verifier = crypto.createVerify('RSA-SHA256').update(data, 'utf8');
        return verifier.verify(pingppConfig.pingppPubKey, signature, 'base64');
    }
}

export { PingppHelper };
