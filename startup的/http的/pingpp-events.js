import { HTTP } from 'meteor/http';
import { PingppEvents } from '../../../api/pingppEvents/PingppEvents';

import { PingppHelper } from '../../../helpers/server/PingppHelper';
import { PurchaseHelper } from '../../../helpers/server/PurchaseHelper';

HTTP.methods({
    'api/pingpp/events': {
        // eslint-disable-next-line object-shorthand, func-names
        post: function (eventObj) {
            const signed = PingppHelper.testSignature(JSON.stringify(eventObj), this.requestHeaders['x-pingplusplus-signature']);
            PingppEvents.insert({ signed, eventObj });

            if (signed) {
                if (eventObj.type === 'charge.succeeded') {
                    PurchaseHelper.finishPurchase(eventObj.data.object.order_no);
                }
            }
        },
    },
});
