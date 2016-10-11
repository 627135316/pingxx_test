import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory } from 'react-router';

import { PageHeader, Button } from 'react-bootstrap';

export class TransactionCreate1 extends React.Component {
    constructor(props) {
        super(props);
        this.purchase500 = this.purchase.bind(this, 50000);
        this.purchase1000 = this.purchase.bind(this, 100000);
        this.state = {
            processing: false,
        };
    }
    purchase(amount) {
        Meteor.call('transactions.add-wx-pub-qr', { amount }, (error, id) => {
            browserHistory.replace(`/transactions/create/${id}`);
        });
    }
    render() {
        return (
            <div>
                <PageHeader>充值</PageHeader>
                请选择充值金额：<br />
                {this.state.processing ? '正在处理中，请稍候' : <div>
                    <Button onClick={this.purchase500}>500元</Button><br />
                    <Button onClick={this.purchase1000}>1000元</Button>
                </div>
                }
            </div>
        );
    }
}
