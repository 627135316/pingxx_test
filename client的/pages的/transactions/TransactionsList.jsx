import { Meteor } from 'meteor/meteor';
import React from 'react';
import reactMixin from 'react-mixin';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import moment from 'moment';

import { PageHeader, Table } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import { Spinner } from '../../components/Spinner';

import { Transactions } from '../../../api/transactions/Transactions';

export class TransactionsList extends React.Component {
    getMeteorData() {
        const subscription = Meteor.subscribe('transactions');
        return {
            ready: subscription.ready(),
            data: Transactions.find({}, { sort: { createdAt: -1 } }).fetch(),
        };
    }
    stateTd(transaction) {
        switch (transaction.state) {
            case 1:
                return (
                    <div>
                        微信扫码以完成支付：<br />
                        <QRCode value={transaction.chargeObj.credential.wx_pub_qr} />
                    </div>
                );
            case 2:
                return '处理失败，请联系客服';
            case 3:
                return '支付处理完成';
            default:
                return '未知状态';
        }
    }
    render() {
        return (
            <div>
                <PageHeader>订单列表</PageHeader>
                {this.data.ready
                    ? <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>创建时间</th>
                                <th>更新时间</th>
                                <th>主题</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.data.data.map(data => (
                                <tr key={data._id}>
                                    <td>{moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                                    <td>{moment(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                                    <td>{data.subject}</td>
                                    <td>{this.stateTd(data)}</td>
                                </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                    : <Spinner />
                }
            </div>
        );
    }
}

reactMixin(TransactionsList.prototype, ReactMeteorData);
