/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

import originator_ratings from '../../data/originators.json'

export function rating (loan_originator, country)
{
    var data =
        originator_ratings;
    
    if (loan_originator.toLowerCase() in data)
    {
        const entry = data[loan_originator.toLowerCase()];
        const rating = entry.hasOwnProperty(country) ? entry[country] : entry._;
        return rating ? `${rating} / 100` : 'n/a'
    }
    else
    {
        return 'n/a';
    }
}

export function iso_code (currency)
{
    var data =
    {
        '€'   : 978,
        'Kč'  : 203,
        '£'   : 826,
        '₸'   : 398,
        'Mex' : 484,
        'zł'  : 985
    };
    
    if (currency in data)
    {
        return data[currency];
    }
    else
    {
        return null;
    }
}
