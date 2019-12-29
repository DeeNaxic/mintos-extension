/*
 *  @project >> Investment.Extensions: Mintos
 *  @authors >> DeeNaxic
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

function rating (originator)
{
    var ratings =
    {
        "1pm"                :    "81",
        "credissimo"         :    "80",
        "mogo"               :    "79",
        "creditstar"         :    "79",
        "iutecredit"         :    "77",
        "vizia"              :    "77",
        "placet group"       :    "71",
        "wowwo"              :    "70",
        "everest finanse"    :    "69",
        "credius"            :    "68",
        "creamfinance"       :    "67",
        "kredit pintar"      :    "66",
        "acema"              :    "66",
        "lime zaim"          :    "65",
        "dziesiä…tka finanse":    "62",
        "varks"              :    "61",
        "dozarplati"         :    "61",
        "watu credit"        :    "61",
        "dineo credito"      :    "60",
        "esto"               :    "60",
        "lf tech"            :    "59",
        "ebv finance"        :    "58",
        "capital service"    :    "57",
        "akulaku"            :    "57",
        "kviku"              :    "57",
        "bb finance group"   :    "55",
        "sebo"               :    "53",
        "stik credit"        :    "53",
        "dinerito"           :    "53",
        "cashcredit"         :    "53",
        "extra finance"      :    "52",
        "evergreen"          :    "51",
        "novaloans"          :    "51",
        "itf group"          :    "50",
        "agrocredit"         :    "47",
        "ecofinance"         :    "47",
        "mikro kapital"      :    "47",
        "sos credit"         :    "46",
        "alfakredyt"         :    "45",
        "fireof"             :    "43",
        "cashwagon"          :    "42",
        "zenka"              :    "41",
        "alexcredit"         :    "41",
        "dinero"             :    "39",
        "mozipo group"       :    "36",
        "capitalia"          :    "36",
        "monego"             :    "34",
        "hipocredit"         :    "32",
        "debifo"             :    "32",
        "kredit24"           :    "32",
        "rapicredit"         :    "28",
        "e cash"             :    "26",
        "creditter"          :    "25",
        "kredo"              :    "23",
        "expresscredit"      :    "22",
        "peachy"             :    "22",
        "getbucks"           :    "19",
        "credilikeme"        :    "18",
        "lendo"              :    "14",
        "tigo"               :    "13",
        "metrokredit"        :    "11",
    };
    
    if (originator.toLowerCase() in ratings)
    {
        return ratings[originator.toLowerCase()] + ' / 100';
    }
    else
    {
        return 'n/a';
    }
}
