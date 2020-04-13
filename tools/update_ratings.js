import cheerio from 'cheerio'
import fetch from 'node-fetch';
import {readFileSync} from 'fs';

const uri = 'https://explorep2p.com/mintos-lender-ratings/'

async function update ()
{
    const page = await fetch(uri);
    const text = await page.text();
    const $ = cheerio.load(text)
    const input = []
    $('#supsystic-table-19 tbody tr').each(function ()
    {
        input.push({
            originator : $('td:nth-of-type(1)', this).data('original-value'),
            rating     : $('td:nth-of-type(7)', this).data('original-value'),
        })
    });
    
    const countries = getNameList()
    
    const model = fromInput(input, countries);
    const json = JSON.stringify(toOutput(model), undefined, 2);
    console.info(json);
}

function fromInput (input, countries)
{
    const convertRow = ({originator, rating}) =>
    {
        const result = {}
        
        const info = split(originator, countries);
        result.originator = info.originator;
        if (info.country)
            result.country = info.country;
        
        result.rating = Number.isInteger(rating) ? rating : null;
        
        // console.info({originator, rating}, result);
        return result;
    };
    return input.map(convertRow).filter(row => !!row)
}

/**
 * @param {string} text
 * @param {object} countries
 * @return {object}
 */
function split (text, countries)
{
    const result = {};
    const matched = text.match(/^([^(]+)\(([^)]+)\)$/);
    if (!matched)
    {
        let originatorCand = text;
        for (const country of Object.keys(countries))
            if (originatorCand.endsWith(country))
            {
                result.country = country;
                result.originator = originatorCand.replace(country, '').trimEnd();
                break;
            }
        
        if (!result.originator)
            result.originator = text;
    }
    else
    {
        result.originator = matched[1].trimEnd()
        let extra = matched[2].split(', ');
        
        if (extra[1] === 'Kaz.')
            extra = ['Kazakhstan'];
        
        for (const token of extra)
        {
            if (Object.keys(countries).includes(token))
                result.country = token;
            else
                console.log('Not a country', token)
        }
    }
    
    return result;
}


function getNameList ()
{
    const f = readFileSync('node_modules/country-list/data.json', 'utf8');
    const doc = JSON.parse(f)
    const fromEntries = Object.fromEntries(doc.map(({code, name}) => ([name, code])));
    fromEntries.Moldova = 'MD';
    fromEntries.Macedonia = 'MK';
    fromEntries.Vietnam = 'VN';
    return fromEntries;
}

function toOutput (ratings)
{
    return ratings
        .map(rating =>
        {
            const country = rating.hasOwnProperty('country') ? rating.country : '_';
            if (!country)
                throw new Error('Unknown country' + rating.country);
            return [rating.originator, {[country] : rating.rating}];
        })
        .map(fixOriginator)
        .sort(([k1], [k2]) => k1.localeCompare(k2))
        .reduce((result, [originator, entry]) =>
        {
            if (!result.hasOwnProperty(originator))
                result[originator] = {};
            
            return {
                ...result,
                [originator] : {
                    ...result[originator],
                    ...entry,
                }
            };
        }, {});
}

/*
* Mapping of names used on ExploreP2P to names used on Mintos.
*/
const originatorNames = {
    'alex credit'        : 'alexcredit',
    'dziesiątka finanse' : 'dziesiatka finanse',
    'e-cash'             : 'e cash',
    'stikcredit'         : 'stik credit',
    'swiss capital'      : 'swiss capital kz',
};

function fixOriginator (entry)
{
    let name = entry[0].trim().toLowerCase()
    name = originatorNames.hasOwnProperty(name) ? originatorNames[name] : name;
    const rating = entry[1];
    return [name, rating];
}

(async function ()
{
    try
    {
        await update();
    } catch (e)
    {
        console.warn(e);
    }
})()
