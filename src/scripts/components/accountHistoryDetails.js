import {localization} from '../common/localization/index.js';

export function parseTransactionDetails (text, lang = null)
{
    const result = {};
    
    const txIdMatch = /^[^:]+: (-?\d+)/u.exec(text);
    result.txId = txIdMatch[1];
    
    const refIdMatch = localization('$TransactionDetails', lang).exec(text);
    result.txType = refIdMatch[1].trim();
    if (refIdMatch[2])
        result.txRef = refIdMatch[2].trim();
    
    return result;
}
