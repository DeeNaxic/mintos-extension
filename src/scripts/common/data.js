/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

export function rating (loan_originator)
{
    var data =
    {
        "acema"              :    "66",
        "agrocredit"         :    "47",
        "akulaku"            :    "57",
        "alexcredit"         :    "41",
        "alfakredyt"         :    "45",
        "bb finance group"   :    "55",
        "capital service"    :    "53",
        "capitalia"          :    "36",
        "cashcredit"         :    "53",
        "cashwagon"          :    "42",
        "creamfinance"       :    "67",
        "credilikeme"        :    "18",
        "credissimo"         :    "80",
        "creditstar"         :    "79",
        "creditter"          :    "25",
        "credius"            :    "68",
        "danarupiah"         :    "24",
        "debifo"             :    "32",
        "dineo credito"      :    "60",
        "dinerito"           :    "53",
        "dinero"             :    "39",
        "dozarplati"         :    "61",
        "dziesiatka finanse" :    "62",
        "e cash"             :    "26",
        "ecofinance"         :    "47",
        "esto"               :    "60",
        "everest finanse"    :    "69",
        "evergreen"          :    "51",
        "expresscredit"      :    "22",
        "extra finance"      :    "52",
        "fireof"             :    "43",
        "getbucks"           :    "23",
        "gfm"                :    "41",
        "hipocredit"         :    "32",
        "itf group"          :    "50",
        "iutecredit"         :    "77",
        "julo"               :    "47",
        "kredit pintar"      :    "66",
        "kredit24"           :    "32",
        "kredo"              :    "23",
        "kviku"              :    "57",
        "lendo"              :    "14",
        "lf tech"            :    "66",
        "lime zaim"          :    "65",
        "metrokredit"        :    "11",
        "mikro kapital"      :    "47",
        "mogo"               :    "79",
        "moneda"             :    "20",
        "monego"             :    "34",
        "mozipo group"       :    "36",
        "novaloans"          :    "51",
        "peachy"             :    "22",
        "pinjam yuk"         :    "41",
        "placet group"       :    "71",
        "rapicredit"         :    "28",
        "sebo"               :    "53",
        "sos credit"         :    "46",
        "stik credit"        :    "53",
        "swiss capital"      :    "40",
        "tascredit"          :    "52",
        "tigo"               :    "13",
        "varks"              :    "63",
        "vizia"              :    "77",
        "watu credit"        :    "61",
        "wowwo"              :    "70",
        "zenka"              :    "41",
    };
    
    if (loan_originator.toLowerCase() in data)
    {
        return data[loan_originator.toLowerCase()] + ' / 100';
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
