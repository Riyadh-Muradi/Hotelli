#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
#include <fstream>

using namespace std;

/* Tekijä: Riyadh Muradi */
/* Hotellivarausohjelma - Lopputyö */

const int MAX_HUONEITA = 300;
const int MIN_HUONEITA = 40;
const int YKSIO_HINTA = 100;
const int KAKSIO_HINTA = 150;

struct Huone
{
    int numero;
    int tyyppi;
    bool varattu;
    string asiakasNimi;
    int varausnumero;
    int alennus;
};

struct Hotelli
{
    Huone huoneet[MAX_HUONEITA];
    int huoneidenMaara;
};

Hotelli hotelli = {};

/* mut i love globaali muuttujii */
/* Jotku makrot kirjoituksen lyhentämiseksi eli taas reusable*/
#define h(i) hotelli.huoneet[i]
#define hm hotelli.huoneidenMaara

/* satunnainen luku välillä min ja max */
int arvoLuku(int min, int max)
{
    return min + rand() % (max - min + 1);
}

/* Ettei tarvi kirjoittaa tätä samaa koko ajan uusiks niiku on reusable */
void puhdistaCin()
{
    cin.clear();
    cin.ignore(10000, '\n');
}

void tallennaJSON();
void naytaHotellintila();

void alustaHotelli()
{
    /* Arvotaan huoneiden määrä ja varmistetaan et se on parilline */
    hm = arvoLuku(MIN_HUONEITA, 70);
    if (hm % 2 != 0)
        hm--;

    /* Jaetaan huoneet puoliksi ensimmäiset yksiöt, loput o kaksiot */
    int puolikas = hm / 2;

    for (int i = 0; i < hm; i++)
    {
        h(i).numero = i + 1;
        h(i).varattu = false;
        h(i).asiakasNimi = "";
        h(i).varausnumero = 0;
        h(i).alennus = 0;

        /* Ensimmäinen puoli saa tyypin 1 (yksiö), toinen puoli tyypin 2 (kaksio) */
        if (i < puolikas)
            h(i).tyyppi = 1;
        else
            h(i).tyyppi = 2;
    }

    cout << "Hotelli alustettu" << endl;
    cout << "Huoneita yhteensä: " << hm << " (" << puolikas << " yksiö + " << puolikas << " kaksio)" << endl;
    cout << "Hinnat - Yksiö: " << YKSIO_HINTA << "€, kaksio: " << KAKSIO_HINTA << "€" << endl;
    cout << endl;

    tallennaJSON();
}

void tallennaJSON()
{
    ofstream jsonFile("data.json");

    /* Tarkistetaan et tiedosto avautuu */
    if (!jsonFile.is_open())
    {
        cout << "VIRHE: Ei voitu avata json tiedostoa" << endl;
        return;
    }

    /* Tarkistetaan et tiedostoon voi kirjoittaa */
    if (!jsonFile.good())
    {
        cout << "VIRHE: Tiedostoon kirjoitus epäonnistui" << endl;
        jsonFile.close();
        return;
    }

    int vapaanaHuoneita = 0, varatuita = 0;

    /* Lasketaan vapaiden ja varattujen huoneiden määrä */
    for (int i = 0; i < hm; i++)
    {
        if (!h(i).varattu)
            vapaanaHuoneita++;
        else
            varatuita++;
    }

    /* Formattaa json tiedoston oikean näköiseksi. Tehty gpt:llä*/
    jsonFile << "{\n"
             << "  \"huoneidenMaara\": " << hm << ",\n"
             << "  \"vapaanaHuoneita\": " << vapaanaHuoneita << ",\n"
             << "  \"varatuita\": " << varatuita << ",\n"
             << "  \"yksioHinta\": " << YKSIO_HINTA << ",\n"
             << "  \"kaksioHinta\": " << KAKSIO_HINTA << ",\n"
             << "  \"huoneet\": [\n";

    /* Kirjoitetaan jokaisen huoneen tiedot */
    for (int i = 0; i < hm; i++)
    {
        jsonFile << "    {\n"
                 << "      \"numero\": " << h(i).numero << ",\n"
                 << "      \"tyyppi\": " << h(i).tyyppi << ",\n"
                 << "      \"varattu\": " << (h(i).varattu ? "true" : "false") << ",\n"
                 << "      \"asiakas\": \"" << h(i).asiakasNimi << "\",\n"
                 << "      \"varausNumero\": " << h(i).varausnumero << ",\n"
                 << "      \"alennus\": " << h(i).alennus << "\n"
                 << "    }";
        if (i < hm - 1)
            jsonFile << ",";
        jsonFile << "\n";
    }

    jsonFile << "  ]\n"
             << "}\n";

    /* Varmistetaan et kaikki data on kirjoitettu */
    if (!jsonFile.good())
    {
        cout << "VIRHE: JSON kirjoitus epäonnistui" << endl;
    }

    jsonFile.close();
}

int arpoVapaanHuoneen(int tyyppi)
{
    /* Etsitään ensimmäinen vapaa huone, joka on oikean tyypin */
    int vapaa = -1;
    for (int i = 0; i < hm; i++)
    {
        if (!h(i).varattu && h(i).tyyppi == tyyppi)
        {
            vapaa = h(i).numero;
            break;
        }
    }
    return vapaa;
}

int tarkistaHuoneTyyppi(int tyyppi)
{
    /* Tarkistetaan huonetyyppi ja lasketaan hinta */
    int hinta = 0;
    if (tyyppi == 1)
        hinta = YKSIO_HINTA;
    else
        hinta = KAKSIO_HINTA;
    return hinta;
}

void varaaHuone(int huoneNumero, string nimi)
{
    /* Laitetaan huone varatuksi */
    /* Tarkistetaan et huone ei ole jo varattu */
    if (h(huoneNumero - 1).varattu)
    {
        cout << "Huone on jo varattu" << endl;
        return;
    }

    h(huoneNumero - 1).varattu = true;
    h(huoneNumero - 1).asiakasNimi = nimi;

    int varausnumero = arvoLuku(10000, 99999);

    /* TODO: Tämä silmukka voisi olla funktio - helpompi testata */
    /* Tarkistetaan et varausnumero ei ole jo käytössä */
    bool loytyi = false;
    for (int i = 0; i < hm; i++)
    {
        if (h(i).varausnumero == varausnumero)
        {
            loytyi = true;
            break;
        }
    }

    /* Jos löytyi sama numero, arvotaan uusi */
    while (loytyi)
    {
        varausnumero = arvoLuku(10000, 99999);
        loytyi = false;
        for (int i = 0; i < hm; i++)
        {
            if (h(i).varausnumero == varausnumero)
            {
                loytyi = true;
                break;
            }
        }
    }

    /* Tallennetaan varausnumero huoneeseen */
    h(huoneNumero - 1).varausnumero = varausnumero;

    /* Alennukset: 0%, 10% tai 20% */
    int sattuma = arvoLuku(1, 3), alennus = 0;

    if (sattuma == 1)
        alennus = 0;
    else if (sattuma == 2)
        alennus = 10;
    else if (sattuma == 3)
        alennus = 20;

    /* Validoidaan alennus */
    if (alennus < 0 || alennus > 100)
    {
        cout << "VIRHE: Alennus ylitti sallitun rajan (" << alennus << "%)" << endl;
        alennus = 0;
    }

    h(huoneNumero - 1).alennus = alennus;

    /* Päivittää json tiedostoo */
    tallennaJSON();
}

void naytaVahvistus(int varausnumero, string asiakas, int tyyppi, int huone, int yot, int hinta, int kokonaishinta, int alennus, int hintaAlennoksen)
{
    /* Näytetään varauksen vahvistus */
    cout << "\nVaraus vahvistettu " << endl;
    cout << "Varausnumero: " << varausnumero << endl;
    cout << "Asiakas: " << asiakas << endl;

    if (tyyppi == 1)
        cout << "Huone: " << huone << " (yksiö)" << endl;
    else
        cout << "Huone: " << huone << " (kaksio)" << endl;

    cout << "Yöt: " << yot << endl;
    cout << "Yön hinta: " << hinta << "€" << endl;
    cout << "Kokonaishinta: " << kokonaishinta << "€" << endl;

    if (alennus > 0)
    {
        cout << "Alennus: " << alennus << "%" << endl;
        cout << "Hinta alennoksen jälkeen: " << hintaAlennoksen << "€" << endl;
    }

    cout << endl;
}

void naytaAlennusviesti(int alennus)
{
    /* Näytetään alennukseen liittyvä viesti */
    if (alennus == 0)
    {
        cout << "Ei alennusta" << endl;
    }
    else if (alennus == 10)
    {
        cout << "Sait 10% alennuksen varaukseesi!" << endl;
    }
    else if (alennus == 20)
    {
        cout << "Sait 20% alennuksen varaukseesi!" << endl;
    }
}

bool kysyJatka()
{
    /* Kysytään käyttäjältä jatkaa vai ei */
    cout << "Haluatko tehdä uuden varauksen? (k/e): ";
    string vastaus;
    getline(cin, vastaus);

    if (vastaus == "k" || vastaus == "K")
        return true;
    return false;
}

void naytaHotellintila()
{
    /* Näytetään hotellin tilastot*/
    int vapaanaYksio = 0;
    int vapaaKaksio = 0;

    for (int i = 0; i < hm; i++)
    {
        if (!h(i).varattu)
        {
            if (h(i).tyyppi == 1)
                vapaanaYksio = vapaanaYksio + 1;
            else
                vapaaKaksio = vapaaKaksio + 1;
        }
    }

    int kokonaisVapaa = vapaanaYksio + vapaaKaksio;
    int kokonaisVarattu = hm - kokonaisVapaa;

    cout << endl;
    cout << "Hotellin tilastot" << endl;
    cout << "Huoneita yhteensä: " << hm << endl;
    cout << "Varattuja: " << kokonaisVarattu << endl;
    cout << "Vapaana: " << kokonaisVapaa << endl;
    cout << endl;
    cout << "Yksiöitä vapaana: " << vapaanaYksio << endl;
    cout << "Kaksioita vapaana: " << vapaaKaksio << endl;
    cout << endl;
}

void etsiVaraus()
{
    /* Etsitään olemassa olevia varauksia */
    cout << "\nEtsi varaus" << endl;
    cout << "Etsi: 1 = Nimellä, 2 = Varausnumerolla: ";

    int valinta = 0;
    cin >> valinta;

    if (cin.fail())
    {
        puhdistaCin();
        cout << "VIRHE: Syötä numero 1 tai 2" << endl;
        return;
    }

    cin.ignore();

    if (valinta == 1)
    {
        /* Haku nimellä */
        cout << "Anna asiakkaan nimi: ";
        string nimi;
        getline(cin, nimi);

        if (nimi.empty())
        {
            cout << "VIRHE: Nimi ei saa olla tyhjä" << endl;
            return;
        }

        bool loytyi = false;

        for (int i = 0; i < hm; i++)
        {
            if (h(i).varattu && h(i).asiakasNimi == nimi)
            {
                loytyi = true;

                cout << "\nVaraus löytyi" << endl;
                cout << "Varausnumero: #" << h(i).varausnumero << endl;
                cout << "Asiakas: " << h(i).asiakasNimi << endl;
                cout << "Huone: " << h(i).numero;

                if (h(i).tyyppi == 1)
                    cout << " (yksiö)" << endl;
                else
                    cout << " (kaksio)" << endl;

                cout << "Alennus: " << h(i).alennus << "%" << endl;
                cout << endl;
            }
        }

        if (!loytyi)
        {
            cout << "Ei löytynyt varausta nimellä: " << nimi << endl;
        }
    }
    else if (valinta == 2)
    {
        /* Haku varausnumerolla */
        cout << "Anna varausnumero (10000-99999): ";
        int varausnumero = 0;
        cin >> varausnumero;

        if (cin.fail())
        {
            puhdistaCin();
            cout << "VIRHE: Syötä numero välillä 10000-99999" << endl;
            return;
        }

        if (varausnumero < 10000 || varausnumero > 99999)
        {
            cout << "VIRHE: Varausnumero tulee olla välillä 10000-99999" << endl;
            return;
        }

        bool loytyi = false;

        for (int i = 0; i < hm; i++)
        {
            if (h(i).varattu && h(i).varausnumero == varausnumero)
            {
                loytyi = true;

                cout << "\nVaraus löytyi" << endl;
                cout << "Varausnumero: #" << h(i).varausnumero << endl;
                cout << "Asiakas: " << h(i).asiakasNimi << endl;
                cout << "Huone: " << h(i).numero;

                if (h(i).tyyppi == 1)
                    cout << " (yksiö)" << endl;
                else
                    cout << " (kaksio)" << endl;

                cout << "Alennus: " << h(i).alennus << "%" << endl;
                cout << endl;
                break;
            }
        }

        if (!loytyi)
        {
            cout << "Ei löytynyt varausta numerolla: " << varausnumero << endl;
        }
    }
    else
    {
        cout << "VIRHE: Valinta tulee olla 1 tai 2" << endl;
    }
}

int main()
{
    srand(time(0));

    alustaHotelli();

    string nimi;

    int huoneNumero, yot, kokonaishinta, huoneTyyppi, hintaPerYo, varausnumero;

    bool jatka = true;

    while (jatka)
    {
        int valinta = 0;
        cout << "\nValitse: 1 = Uusi varaus, 2 = Etsi varaus, 3 = Hotellin tila, 4 = Lopeta: ";
        cin >> valinta;

        if (cin.fail())
        {
            puhdistaCin();
            cout << "VIRHE: Syötä numero 1, 2, 3 tai 4" << endl;
            continue;
        }

        if (valinta < 1 || valinta > 4)
        {
            cout << "VIRHE: Valinta tulee olla 1, 2, 3 tai 4" << endl;
            continue;
        }

        cin.ignore();

        if (valinta == 2)
        {
            etsiVaraus();
            continue;
        }

        if (valinta == 3)
        {
            naytaHotellintila();
            continue;
        }

        if (valinta == 4)
        {
            jatka = false;
            break;
        }

        if (valinta != 1)
            continue;

        /* TODO: input validatio omaan funtioon */
        cout << "\nUusi varaus" << endl;

        cout << "Anna nimesi: ";
        getline(cin, nimi);

        /* Validoidaan nimi - tyhjä, liian pitkä tai väärät merkit */
        if (nimi.empty())
        {
            cout << "VIRHE: Nimi ei saa olla tyhjä" << endl;
            continue;
        }

        if (nimi.length() > 100)
        {
            cout << "VIRHE: Nimi saa olla maksimissaan 100 merkkiä (antoit " << nimi.length() << ")" << endl;
            continue;
        }

        /* Tarkistetaan et nimi ei sisällä vain välilyöntejä */
        bool vainValilyjonteja = true;
        for (char c : nimi)
        {
            if (c != ' ')
            {
                vainValilyjonteja = false;
                break;
            }
        }
        if (vainValilyjonteja)
        {
            cout << "VIRHE: Nimi ei saa sisältää vain välilyöntejä" << endl;
            continue;
        }

        cout << "Huoneen tyyppi (1: yksiö, 2: kaksio): ";
        cin >> huoneTyyppi;

        if (cin.fail())
        {
            puhdistaCin();
            cout << "VIRHE: Syötä numero 1 tai 2" << endl;
            continue;
        }

        if (huoneTyyppi < 1 || huoneTyyppi > 2)
        {
            cout << "VIRHE: Huonetyyppi tulee olla 1 (yksiö) tai 2 (kaksio)" << endl;
            puhdistaCin();
            continue;
        }

        cin.ignore();

        /* Näytetään saatavilla olevien huoneiden määrä */
        int vapaanaYksio = 0;
        int vapaaKaksio = 0;

        for (int i = 0; i < hm; i++)
        {
            if (!h(i).varattu)
            {
                if (h(i).tyyppi == 1)
                    vapaanaYksio = vapaanaYksio + 1;
                else
                    vapaaKaksio = vapaaKaksio + 1;
            }
        }

        if (huoneTyyppi == 1)
        {
            cout << "Saatavilla olevia yksiöitä: " << vapaanaYksio << endl;
            if (vapaanaYksio == 0)
            {
                cout << "VIRHE: Kaikki yksiöt on varattu" << endl;
                continue;
            }
        }
        else
        {
            cout << "Saatavilla olevia kaksioita: " << vapaaKaksio << endl;
            if (vapaaKaksio == 0)
            {
                cout << "VIRHE: Kaikki kaksiot on varattu" << endl;
                continue;
            }
        }

        hintaPerYo = tarkistaHuoneTyyppi(huoneTyyppi);

        huoneNumero = arpoVapaanHuoneen(huoneTyyppi);

        if (huoneNumero == -1)
        {
            cout << "Kaikki huoneet varattuja" << endl;
            jatka = false;
            break;
        }

        cout << "Huoneeksi on varattu nro: " << huoneNumero << endl;

        cout << "Montako yötä: ";
        cin >> yot;

        if (cin.fail())
        {
            puhdistaCin();
            cout << "VIRHE: Syötä numero" << endl;
            continue;
        }

        if (yot < 1)
        {
            cout << "VIRHE: Yöt tulee olla vähintään 1" << endl;
            continue;
        }

        cin.ignore();

        /* Varataan huone ja tallennetaan tiedot */
        varaaHuone(huoneNumero, nimi);

        /* Haetaan varausnumero ja alennus varatusta huoneesta */
        varausnumero = h(huoneNumero - 1).varausnumero;
        int alennus = h(huoneNumero - 1).alennus;

        /* TODO: Omaan funtioon?? */
        /* Lasketaa kokonaishinta ja vähennetään alennus */
        kokonaishinta = yot * hintaPerYo;

        int alennusEuroa = (kokonaishinta * alennus) / 100;
        int hintaAlennoksen = kokonaishinta - alennusEuroa;

        /* Näytetää varauksen vahvistus asiakkaalle */
        naytaVahvistus(varausnumero, nimi, huoneTyyppi, huoneNumero, yot, hintaPerYo, kokonaishinta, alennus, hintaAlennoksen);

        naytaAlennusviesti(alennus);

        if (!kysyJatka())
        {
            break;
        }
    }

    cout << "\nKiitos käynistä" << endl;
    return 0;
}
