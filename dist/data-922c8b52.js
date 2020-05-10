const aasa = {
	_: 41
};
const acema = {
	_: 66
};
const aforti = {
	_: -100
};
const agrocredit = {
	_: 47
};
const akulaku = {
	_: 57
};
const alexcredit = {
	_: 41
};
const alfakredyt = {
	_: 31
};
const capitalia = {
	_: 36
};
const cashcredit = {
	_: 53
};
const cashwagon = {
	_: 42
};
const creamfinance = {
	_: 67
};
const credilikeme = {
	_: 18
};
const credissimo = {
	_: 80
};
const creditstar = {
	_: 74
};
const creditter = {
	_: 22
};
const credius = {
	_: 68
};
const danarupiah = {
	_: 24
};
const debifo = {
	_: 32
};
const delfingroup = {
	_: 77
};
const dinerito = {
	_: 53
};
const dozarplati = {
	_: 45
};
const ecofinance = {
	_: 40
};
const esto = {
	_: 62
};
const evergreen = {
	_: 51
};
const expresscredit = {
	_: 22
};
const finitera = {
	Albania: 23,
	Macedonia: 13
};
const finko = {
	Georgia: 14,
	Moldova: 53,
	Ukraine: 39
};
const fireof = {
	_: 43
};
const getbucks = {
	_: 15
};
const gfm = {
	_: 33
};
const hipocredit = {
	_: 41
};
const iutecredit = {
	_: 77
};
const julo = {
	_: 47
};
const kredit24 = {
	_: 24
};
const kviku = {
	_: 44
};
const mogo = {
	_: 76
};
const moneda = {
	_: 20
};
const monego = {
	_: 34
};
const mwananchi = {
	_: 54
};
const novaloans = {
	_: 51
};
const peachy = {
	_: 22
};
const rapicredit = {
	_: 45
};
const tascredit = {
	_: 45
};
const wowwo = {
	_: 70
};
const zenka = {
	_: 41
};
var originator_ratings = {
	aasa: aasa,
	acema: acema,
	aforti: aforti,
	agrocredit: agrocredit,
	akulaku: akulaku,
	alexcredit: alexcredit,
	alfakredyt: alfakredyt,
	"bb finance group": {
	_: 54
},
	"capital service": {
	_: 39
},
	capitalia: capitalia,
	cashcredit: cashcredit,
	cashwagon: cashwagon,
	creamfinance: creamfinance,
	credilikeme: credilikeme,
	credissimo: credissimo,
	creditstar: creditstar,
	creditter: creditter,
	credius: credius,
	danarupiah: danarupiah,
	debifo: debifo,
	delfingroup: delfingroup,
	"dineo credito": {
	_: 60
},
	dinerito: dinerito,
	dozarplati: dozarplati,
	"dziesiatka finanse": {
	_: 43
},
	"e cash": {
	_: 20
},
	ecofinance: ecofinance,
	esto: esto,
	"everest finanse": {
	_: 53
},
	evergreen: evergreen,
	expresscredit: expresscredit,
	"extra finance": {
	_: 52
},
	finitera: finitera,
	finko: finko,
	fireof: fireof,
	getbucks: getbucks,
	gfm: gfm,
	hipocredit: hipocredit,
	"id finance": {
	Spain: 59,
	Mexico: 8
},
	"idf eurasia": {
	_: 63
},
	"itf group": {
	_: 50
},
	iutecredit: iutecredit,
	julo: julo,
	"kredit pintar": {
	_: 62
},
	kredit24: kredit24,
	kviku: kviku,
	"lf tech": {
	_: 55
},
	"lime zaim": {
	_: 55
},
	"mikro kapital": {
	Russia: 45,
	Romania: 53,
	Belarus: 63,
	Moldova: 62
},
	mogo: mogo,
	moneda: moneda,
	monego: monego,
	"mozipo group": {
	_: 36
},
	mwananchi: mwananchi,
	novaloans: novaloans,
	peachy: peachy,
	"pinjam yuk": {
	_: 41
},
	"placet group": {
	_: 73
},
	rapicredit: rapicredit,
	"rapido finance": {
	_: -99
},
	"revo technology": {
	_: 59
},
	"sos credit": {
	_: 46
},
	"stik credit": {
	_: 53
},
	"sun finance": {
	Denmark: 30,
	Poland: 22,
	Kazakhstan: 13,
	Latvia: 28,
	Mexico: 12,
	Vietnam: 7
},
	"swiss capital kz": {
	_: 37
},
	tascredit: tascredit,
	"watu credit": {
	_: 61
},
	wowwo: wowwo,
	zenka: zenka
};

/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic, Raphael Krupinski
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

function rating (loan_originator, country)
{
    var data =
        originator_ratings;
    
    if (!(loan_originator.toLowerCase() in data))
        return NaN;
    
    const entry = data[loan_originator.toLowerCase()];
    const rating = entry.hasOwnProperty(country) ? entry[country] : entry._;
    return typeof rating === 'number' ? rating : NaN;
}

function iso_code (currency)
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

export { iso_code as i, rating as r };
