/*
 *  @project >> Investment.Extensions: www.Mintos.com
 *  @authors >> DeeNaxic
 *  @contact >> investment.extensions@gmail.com
 *  @licence >> GNU GPLv3
 */

function rating (originator)
{
    var ratings =
    {
        "1pm"                :    "81",
        "Credissimo"         :    "80",
        "Creditstar"         :    "79",
        "IuteCredit"         :    "77",
        "VIZIA"              :    "77",
        "Mogo"               :    "76",
        "Placet Group"       :    "71",
        "Credius"            :    "68",
        "Creamfinance"       :    "67",
        "Kredit Pintar"      :    "66",
        "Lime Zaim"          :    "65",
        "Dziesiatka Finanse" :    "62",
        "ACEMA"              :    "61",
        "Varks"              :    "61",
        "Dozarplati"         :    "61",
        "Watu Credit"        :    "61",
        "Dineo Credito"      :    "60",
        "ESTO"               :    "60",
        "LF Tech"            :    "59",
        "EBV Finance"        :    "58",
        "Capital Service"    :    "57",
        "Kviku"              :    "57",
        "BB Finance Group"   :    "55",
        "Akulaku"            :    "54",
        "Sebo"               :    "53",
        "Stik Credit"        :    "53",
        "CashCredit"         :    "55",
        "Extra Finance"      :    "52",
        "Everest Finanse"    :    "51",
        "Novaloans"          :    "51",
        "ITF Group"          :    "50",
        "AgroCredit"         :    "47",
        "EcoFinance"         :    "47",
        "Mikro Kapital"      :    "47",
        "SOS Credit"         :    "46",
        "AlfaKredyt"         :    "45",
        "Simbo"              :    "43",
        "Fireof"             :    "43",
        "Zenka"              :    "41",
        "Lendrock"           :    "41",
        "Alexcredit"         :    "41",
        "Dinero"             :    "39",
        "Cashwagon"          :    "37",
        "Mozipo Group"       :    "36",
        "Capitalia"          :    "36",
        "Monego"             :    "34",
        "Hipocredit"         :    "32",
        "Debifo"             :    "32",
        "Kredit24"           :    "32",
        "Rapicredit"         :    "28",
        "E Cash"             :    "26",
        "Lendo"              :    "24",
        "Kredo"              :    "23",
        "ExpressCredit"      :    "22",
        "Kuki.pl"            :    "22",
        "GetBucks"           :    "20",
        "Credilikeme"        :    "18",
        "Peachy"             :    "17",
        "Rapido Finance"     :    "16",
        "Tigo"               :    "13",
        "Tengo"              :    "13",
        "Dineria"            :    "12",
        "Metrokredit"        :    "11",
        "Bino"               :     "9"
    };
    
    if (originator in ratings)
    {
        return ratings[originator] + ' / 100';
    }
    else
    {
        return 'n/a';
    }
}
