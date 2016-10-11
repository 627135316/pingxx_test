import { Meteor } from 'meteor/meteor';
import React from 'react';
import reactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';

import { PageHeader } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import { Spinner } from '../../components/Spinner';

import { Transactions } from '../../../api/transactions/Transactions';

export class TransactionCreate2 extends React.Component {
    getMeteorData() {
        const id = this.props.routeParams.id;
        const subscription = Meteor.subscribe('transaction', id);
        const data = Transactions.findOne(id);
        if (data && data.state !== 1) {
            browserHistory.replace('/transactions');
        }
        return {
            ready: subscription.ready(),
            data,
        };
    }
    render() {
        return (
            <div>
                <PageHeader>请使用手机微信扫码：</PageHeader>
                {this.data.ready
                    ? <QRCode value={this.data.data.chargeObj.credential.wx_pub_qr} size={256} />
                    : <Spinner />
                }
            </div>
        );
    }
}

reactMixin(TransactionCreate2.prototype, ReactMeteorData);

TransactionCreate2.propTypes = {
    routeParams: React.PropTypes.shape({
        id: React.PropTypes.string,
    }),
};
