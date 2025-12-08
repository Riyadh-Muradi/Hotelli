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

Huone huoneet[MAX_HUONEITA];
int huoneidenMaara = 0;
int varausnumerot[MAX_HUONEITA];
int varausnumeroMaara = 0;

int arvoLuku(int min, int max)
{
    return min + rand() % (max - min + 1);
}

void tallennaJSON();

void alustaHotelli()
{
    /* Arvotaan huoneiden määrä ja varmistetaan että se on parillinen */
    huoneidenMaara = arvoLuku(MIN_HUONEITA, 70);
    if (huoneidenMaara % 2 != 0)
        huoneidenMaara--;

    /* Jaetaan huoneet puoliksi: ensimmäiset yksiöt, loput kaksiot */
    int puolikas = huoneidenMaara / 2;

    for (int i = 0; i < huoneidenMaara; i++)
    {
        huoneet[i].numero = i + 1;
        huoneet[i].varattu = false;
        huoneet[i].asiakasNimi = "";
        huoneet[i].varausnumero = 0;
        huoneet[i].alennus = 0;

        /* Ensimmäinen puoli saa tyypin 1 (yksiö), toinen puoli tyypin 2 (kaksio) */
        if (i < puolikas)
            huoneet[i].tyyppi = 1;
        else
            huoneet[i].tyyppi = 2;
    }

    cout << "Hotelli alustettu" << endl;
    cout << "Huoneita yhteensä: " << huoneidenMaara << " (" << puolikas << " yksiö + " << puolikas << " kaksio)" << endl;
    cout << "Hinnat - Yksiö: " << YKSIO_HINTA << "€, kaksio: " << KAKSIO_HINTA << "€" << endl;
    cout << endl;

    tallennaJSON();
}

void tallennaJSON()
{
    ofstream jsonFile("data.json");

    /* Tarkistetaan et tiedosto avautuu  */
    if (!jsonFile.is_open())
    {
        cout << "Ei voitu avata json filua" << endl;
        return;
    }

    int vapaanaHuoneita = 0, varatuita = 0;

    for (int i = 0; i < huoneidenMaara; i++)
    {
        if (!huoneet[i].varattu)
            vapaanaHuoneita++;
        else
            varatuita++;
    }

    /* Formattaa json tiedoston oikean näköiseksi. Tehty gpt:llä*/
    jsonFile << "{\n"
             << "  \"huoneidenMaara\": " << huoneidenMaara << ",\n"
             << "  \"vapaanaHuoneita\": " << vapaanaHuoneita << ",\n"
             << "  \"varatuita\": " << varatuita << ",\n"
             << "  \"yksioHinta\": " << YKSIO_HINTA << ",\n"
             << "  \"kaksioHinta\": " << KAKSIO_HINTA << ",\n"
             << "  \"huoneet\": [\n";

    for (int i = 0; i < huoneidenMaara; i++)
    {
        jsonFile << "    {\n"
                 << "      \"numero\": " << huoneet[i].numero << ",\n"
                 << "      \"tyyppi\": " << huoneet[i].tyyppi << ",\n"
                 << "      \"varattu\": " << (huoneet[i].varattu ? "true" : "false") << ",\n"
                 << "      \"asiakas\": \"" << huoneet[i].asiakasNimi << "\",\n"
                 << "      \"varausNumero\": " << huoneet[i].varausnumero << ",\n"
                 << "      \"alennus\": " << huoneet[i].alennus << "\n"
                 << "    }";
        if (i < huoneidenMaara - 1)
            jsonFile << ",";
        jsonFile << "\n";
    }

    jsonFile << "  ]\n"
             << "}\n";
    jsonFile.close();
}

int arpoVapaanHuoneen(int tyyppi)
{
    /* Etsitään ensimmäinen vapaa huone, joka on oikean tyypin */
    int vapaa = -1;
    for (int i = 0; i < huoneidenMaara; i++)
    {
        if (!huoneet[i].varattu && huoneet[i].tyyppi == tyyppi)
        {
            vapaa = huoneet[i].numero;
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
    /* Tarkistetaan että huone ei ole jo varattu */
    if (huoneet[huoneNumero - 1].varattu)
    {
        cout << "Huone on jo varattu" << endl;
        return;
    }

    huoneet[huoneNumero - 1].varattu = true;
    huoneet[huoneNumero - 1].asiakasNimi = nimi;

    int varausnumero = arvoLuku(10000, 99999);

    /* Tarkistetaan että varausnumero ei ole jo käytössä */
    bool loytyi = false;
    for (int i = 0; i < varausnumeroMaara; i++)
    {
        if (varausnumerot[i] == varausnumero)
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
        for (int i = 0; i < varausnumeroMaara; i++)
        {
            if (varausnumerot[i] == varausnumero)
            {
                loytyi = true;
                break;
            }
        }
    }

    /* Tallennetaan varausnumero käytettyjen listaan */
    varausnumerot[varausnumeroMaara] = varausnumero;
    varausnumeroMaara++;

    huoneet[huoneNumero - 1].varausnumero = varausnumero;

    /* Alennukset: 0%, 10% tai 20% */
    int sattuma = arvoLuku(1, 3), alennus = 0;

    if (sattuma == 1)
        alennus = 0;
    else if (sattuma == 2)
        alennus = 10;
    else
        alennus = 20;

    huoneet[huoneNumero - 1].alennus = alennus;

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

void etsiVaraus()
{
    /* Etsitään olemassa olevia varauksia */
    cout << "\nEtsi varaus" << endl;
    cout << "Anna asiakkaan nimi: ";

    string nimi;
    getline(cin, nimi);

    if (nimi.empty())
    {
        cout << "Nimi ei saa olla tyhjä" << endl;
        return;
    }

    bool loytyi = false;

    for (int i = 0; i < huoneidenMaara; i++)
    {
        if (huoneet[i].varattu && huoneet[i].asiakasNimi == nimi)
        {
            loytyi = true;

            cout << "\nVaraus löytyi" << endl;
            cout << "Varausnumero: #" << huoneet[i].varausnumero << endl;
            cout << "Asiakas: " << huoneet[i].asiakasNimi << endl;
            cout << "Huone: " << huoneet[i].numero;

            if (huoneet[i].tyyppi == 1)
                cout << " (yksiö)" << endl;
            else
                cout << " (kaksio)" << endl;

            cout << "Alennus: " << huoneet[i].alennus << "%" << endl;
            cout << endl;
        }
    }

    if (!loytyi)
    {
        cout << "Ei löytynyt varausta nimellä: " << nimi << endl;
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
        cout << "Valitse: 1 = Uusi varaus, 2 = Etsi varaus, 3 = Lopeta: ";
        cin >> valinta;

        if (cin.fail())
        {
            cin.clear();
            cin.ignore(10000, '\n');
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
            jatka = false;
            break;
        }

        if (valinta != 1)
            continue;

        /* TODO: input validatio omaan funtioon */
        cout << "\nUusi varaus" << endl;

        cout << "Anna nimesi: ";
        getline(cin, nimi);

        if (nimi.empty() || nimi.length() > 100)
        {
            cout << "Nimi ei saa olla tyhjä tai yli 100 merkkiä" << endl;
            continue;
        }

        cout << "Huoneen tyyppi (1: yksiö, 2: kaksio): ";
        cin >> huoneTyyppi;

        if (cin.fail())
        {
            cin.clear();
            cin.ignore(10000, '\n');
            cout << "Valitse 1 tai 2" << endl;
            continue;
        }

        if (huoneTyyppi < 1 || huoneTyyppi > 2)
        {
            cout << "Valitse 1 tai 2" << endl;
            cin.clear();
            cin.ignore(10000, '\n');
            continue;
        }

        cin.ignore();

        hintaPerYo = tarkistaHuoneTyyppi(huoneTyyppi);

        huoneNumero = arpoVapaanHuoneen(huoneTyyppi);

        if (huoneNumero == -1)
        {
            cout << "Kaikki huoneet varattuja" << endl;
            jatka = false;
            break;
        }

        cout << "Sinulle arpoi huone numero: " << huoneNumero << endl;

        cout << "Montako yötä: ";
        cin >> yot;

        if (cin.fail())
        {
            cin.clear();
            cin.ignore(10000, '\n');
            cout << "Vähintään 1 yö" << endl;
            continue;
        }

        if (yot < 1)
        {
            cout << "Vähintään 1 yö" << endl;
            continue;
        }

        cin.ignore();

        /* Varataan huone ja tallennetaan tiedot */
        varaaHuone(huoneNumero, nimi);

        /* Haetaan varausnumero ja alennus varatusta huoneesta */
        varausnumero = huoneet[huoneNumero - 1].varausnumero;
        int alennus = huoneet[huoneNumero - 1].alennus;

        /* TODO: Omaan funtioon?? */
        /* Lasketaa kokonaishinta ja vähennetään alennus */
        kokonaishinta = yot * hintaPerYo;

        int alennusEuroa = (kokonaishinta * alennus) / 100;
        int hintaAlennoksen = kokonaishinta - alennusEuroa;

        /* Näytetää varauksen vahvistus asiakkaalle */
        naytaVahvistus(varausnumero, nimi, huoneTyyppi, huoneNumero, yot, hintaPerYo, kokonaishinta, alennus, hintaAlennoksen);

        if (!kysyJatka())
        {
            break;
        }
    }

    cout << "\nKiitos" << endl;
    return 0;
}
