import { Transactions } from '../../api/transactions/Transactions';
import { UserAccounts } from '../../api/userAccounts/UserAccounts';

function getUserAccount(userId) {
    let userAccount = UserAccounts.findOne({ userId });
    if (!userAccount) {
        UserAccounts.insert({
            userId,
            points: 0,
            cash: 0,
        });
        userAccount = UserAccounts.findOne({ userId });
    }
    return userAccount;
}

class PurchaseHelper {
    static finishPurchase(transactionId) {
        const transaction = Transactions.findOne(transactionId);
        if (transaction && transaction.state === 1) {
            Transactions.update(transactionId, {
                $set: {
                    state: 2,
                },
            });

            const userAccount = getUserAccount(transaction.userId);
            // 直接转换为点数
            UserAccounts.update(userAccount._id, {
                $inc: {
                    points: transaction.params.amount,
                },
            });

            Transactions.update(transactionId, {
                $set: {
                    state: 3,
                },
            });
        }
    }
}

export { PurchaseHelper };
