# Il sito di Chief Pilot

La pagina pubblica di **Chief Pilot** (l'app: `~/Documents/Development/Contrail`), su GitHub Pages con dominio `chiefpilot.app`, come `bottlegram-sito`. La strategia è in `Contrail/docs/sito/2026-10-26-strategia-sito.md`; il progetto della pagina in `docs/2026-10-30-pagina-design.md`; posizionamento e lingua del pubblico in `.agents/product-marketing.md`.

**Stato al 31/10/2026: pubblicata su https://www.chiefpilot.app** (GitHub Pages dal repo pubblico `chiotas/chiefpilot-sito`, ramo `main`, cartella `/`), col sì di Francesco. Il dominio nudo `chiefpilot.app` porta al `www`.

## Com'è fatto

Pagine statiche senza build né dipendenze, che funzionano anche aperte come file (niente `fetch`).

```
index.html       la pagina, tutto il testo in inglese
support.html     supporto (indirizzo per Apple)
privacy.html     privacy (indirizzo per Apple)
styles.css       colori e caratteri dell'app, cinque misure di testo, telefono e tablet
app.js           tabellone che gira, scie, il giro, ricevuta, hangar, compagnia, entrate
assets/
  disegni/       spallina, cinque aerei, terminal ai livelli 1–3 (generati, vedi tools/)
  mappa.svg      terre, coste e luci degli aeroporti (Natural Earth)
  carta*.svg     la griglia con le rotte tratteggiate dietro alcune sezioni (carta-giro.svg: alta quanto il giro; carta-foglio.svg: per il riquadro dell'apertura)
  schermate/     le schermate dell'app in inglese, JPEG a 1x e 2x
  icona-*.png    l'icona dell'app
CNAME            il dominio servito da Pages: www.chiefpilot.app
.nojekyll        dice a GitHub Pages di servire i file così come sono
```

Sul Mac, nella stessa cartella ma fuori dal repo pubblico (in `.gitignore`), resta il materiale di lavoro:

```
tools/
  disegni.py     rigenera disegni e mappa, e rimette le scie in index.html
  storie.py      rimette in index.html le storie d'esempio generate dall'app
  schermate.sh   una schermata PNG dell'app → JPEG 1x e 2x con sips
docs/            il progetto della pagina
.agents/         posizionamento e lingua del pubblico
.claude/         skill accese solo qui: taste-skill, marketing-skills, ui-ux-pro-max
```

La storia completa del lavoro (con questi file) è nel ramo locale `storia-locale`, mai spinto: il repo pubblico parte da un commit nuovo con il solo sito.

### La pagina, sezione per sezione

1. **Apertura** «Fly the plane. Run the airline.»: marchio piccolo sopra il titolo, che resta la cosa più grande del foglio; dietro, la carta del giro coi colori del riquadro (`assets/carta-foglio.svg`). A destra il tabellone Solari: in cima CHIEF PILOT in tessere gialle (più grandi, `--nk` in `styles.css`, sempre nella larghezza del tabellone), sotto DEPARTURES e le partenze, senza orologio; sopra la mappa notturna dell'Europa con tre catene di scie in tre direzioni, che non si incrociano e partono a circa due secondi l'una dall'altra: da Stornoway verso est (quella di stasera, prima tratta per Sumburgh, la prima riga del tabellone), da Londra verso nord fino ad Aberdeen, da Copenaghen giù a tappe fino ad Atene. Linea, alone, scali e base della stessa misura del logbook sullo schermo; la vista è quella di sempre (`viewBox` 1250 130 920 1080) e dopo Berlino la catena per Atene passa sotto il tabellone. Ogni catena va in ordine di volo (`CATENE_APERTURA` in `tools/disegni.py`, un orologio per catena in `app.js`).
2. **L'idea**: lo stesso sim, le stesse abitudini, e in più una compagnia. Dashboard in cornice di Mac. Dal 04/11 il planner è facoltativo anche sul sito (feedback 73 dell'app): chi lo usa ha il flusso di prima, che resta la vetrina del giro e delle cornici; chi no vola la diretta fra i due aeroporti, col tempo stimato dal tipo d'aereo. L'accesso con l'account del planner serve solo a chi lo usa.
3. **Il giro** «Just one more flight.»: quattro passi, con la griglia e le rotte di `assets/carta-giro.svg` fino a «Land, and get paid»; la missione a destra cambia stato mentre si scorre (aperta, piano trovato, in volo, atterrata). Sotto, due cornici: il volo pronto col piano dal planner e il volo in corso.
4. **Missioni** sul giallo della legenda del tabellone: titolo in alto, poi tre righe alternate, ritaglio da una parte e testo dall'altra (dove sei e cosa voli, i tipi di lavoro, gli stili di carriera). Ogni ritaglio è un pannello intero della schermata, senza parole tagliate. Dispatch in cornice.
4 bis. **Le storie** «Every mission comes with a story.» (richiesta di Francesco: «il nostro tocco di poesia»): si sceglie un aereo fra i modellini dell'app (leggero, turboelica, business jet, corto e lungo raggio, rare) e si legge una storia vera generata dall'app, con titolo, tratta, tipo di lavoro, aereo e la riga del meteo. La storia è una nota lasciata in sala equipaggi: carta col nastro adesivo, il testo fra virgolette “ ” (le mette `styles.css`) e la firma «Dispatch, Sirio Virtual»; «Another story» passa alla successiva. 30 storie da `Contrail/docs/sito/storie-esempio-en.md`, coi nomi delle città da Wikidata, messe nell'HTML da `tools/storie.py` (la prima si vede anche senza JavaScript). Kodiak, Twin Otter e PC-12 l'app li disegna come il Cessna: stanno sotto «Light aircraft», e ogni storia dice il suo aereo. La compagnia di prova delle storie (Frank Air, FRK) diventa quella d'esempio della pagina (Sirio Virtual, SRV).
5. **La ricevuta**: si sceglie com'è andato l'atterraggio e l'arrivo, e lo scontrino si ricalcola con le regole dell'app (Butter +10 %, Firm +5 %, Hard −5 %, in orario +5 %, in ritardo −10 %).
6. **Logbook**: la mappa grande con le scie che si accendono e il titolo dentro la mappa in basso a sinistra (sull'Atlantico dal tablet in su, sulla Spagna sul telefono); i numeri, le esportazioni. Logbook in cornice.
7. **Hangar e soldi**: i modellini dell'app nelle cinque famiglie, compra o leasing. Finances in cornice (scenario mid: niente cifre del 787 in vista, richiesta del master).
8. **Territorio**: il terminal ai livelli 1, 2, 3 con l'area d'influenza; poi due righe alternate. Your bases a destra con cosa si costruisce (ogni struttura mette il suo lavoro in bacheca e paga di più nella sua area; tornare a una base non costa). Il territorio a sinistra: 15 aree, quella dell'hub è compresa, le altre si comprano con un hub e un terminal di livello 1 regalati; basi, tour e contratti regionali solo nelle tue aree, rare più frequenti (`CareerStore+Shop.swift`, `MissionGenerator.swift`).
9. **La compagnia**: nome, codice e livrea vanno su tutti i biglietti (restano per la visita dopo). Lo stile decide solo la bacheca; il biglietto lo sceglie «Load it.», cioè cosa trasporta il volo, con la regola dell'app (`TicketFacts.document`, feedback 72): passeggeri di linea → linea in economica, charter e aerotaxi → linea in prima, isole e fine settimana → hopper, tour → tappe, lezioni e voli panoramici → libretto. Cargo, sanitario, trasferimento, lasciapassare e ordine di lavoro sono solo nominati: sul sito non hanno un disegno. Quattro biglietti disegnati in CSS e SVG: **linea** prima classe blu notte e oro con codice a barre, in economica lo stesso in argento `#A9C1D1` (`.tk-eco`, come `LineTicket`); **charter e isole** l'hopper Stornoway–Benbecula su carta consumata, piegato, con l'anello del caffè, il timbro BOARDED e il tagliando strappato; **tour** a tappe verso Nuuk, con le tappe fatte forate e timbrate; **aeroclub** la pagina del libretto del socio con le firme dell'istruttore. Inchiostro dei timbri: il filtro SVG `#ink`. La livrea stampata su carta chiara è scurita (`--ink-livery`). Sede e più compagnie.
10. **Gradi**: CAPTAIN in grande, i cinque gradi coi galloni e cosa apre ognuno (valori di `Tuning.ranks`), reputazione e traguardi. Spalline come `Epaulette` nell'app: Cadet 1 gallone, First Officer 3, Captain 4, Senior Captain 4 con la stellina, Training Captain 4 con la chevron.
11. **Ovunque**: PS5, Xbox, PC, Mac; missione → planner (se fai il piano) → EFB › Import Route.
12. **Com'è nata**: una lettera in prima persona di Francesco, su un foglio.
13. **Domande**, come testo da leggere in due colonne.
14. **Chiusura** «Where are you flying tonight?» e il piede con la nota sui marchi.

L'invito è uno solo, ripetuto: **«Tell me when it lands»**, che apre una mail con l'oggetto già scritto. Il tasto è il tagliando di una carta d'imbarco (scelto da Francesco fra tre prove il 31/10): carta con una grana leggera, intagli a semicerchio sulla linea di strappo, il tagliando con l'aereo al centro, la scritta in maiuscolo spaziato; al passaggio il tagliando si stacca (fermo con `prefers-reduced-motion`). Classi `.pass-key`, `.pass-key-small` per la barra; su support e privacy lo stesso tagliando dice «Write to us».

### Telefono e tablet (31/10)

Stesse sezioni e stesso ordine del desktop, ripensate per lo schermo (`styles.css`, blocchi `max-width: 1100px` e `760px`; il desktop non cambia, controllato a 1440 e 1728 confrontando le posizioni di tutti gli elementi con la pagina pubblicata):

- **Apertura**: titolo a 10,6vw sul telefono (7vw sul tablet), sempre la cosa più grande; marchio piccolo sopra. Il tabellone prende tutta la larghezza del riquadro e poggia sulla striscia; sopra resta una fascia di mappa (74svh, almeno 600 px) dove si vedono le scie.
- **Barra**: il tagliando sta a destra anche sul tablet; marchio e tagliando hanno 44 px al tocco (il tagliando con un `::after` invisibile).
- **Schermate**: sul telefono solo la finestra dell'app, con un filo e gli angoli tondi, senza MacBook; dal tablet in su il MacBook col notch.
- **Il giro**: la missione resta ferma in alto mentre i passi (26 px) scorrono sulla griglia con le rotte.
- **Livelli del terminal**: righe col disegno a sinistra e la riga a destra, tutti e tre in uno schermo.
- **Biglietti**: sotto 440 px di contenitore il tagliando del charter resta nello schermo e i visti del tour stanno sulle tappe fatte, fra tratta e data.
- **Piattaforme** in due righe (PS5 Xbox / PC Mac), i sette colori della livrea in una riga, l'aereo dell'hangar in 3:2, i passi «Works with every version» col pallino accanto.
- **Tablet**: le sei storie in una riga, la ricevuta allineata al titolo; link del piede e «See how one evening goes» con 44 px al tocco.
- Niente scroll orizzontale a 360, 390, 430 e 768.

### Allineato all'app

| | App | Sito |
|---|---|---|
| Fondo, card, overlay | `surfaceBase` `#06141B`, `surfaceRaised` `#11212D`, `surfaceOverlay` `#253745` | `--bg`, `--surface`, `--overlay` |
| Testo | `textPrimary` `#CCD0CF`, `#E6E9E8` alto contrasto, `textTertiary` `#9BA8AB` | `--ink`, `--ink-hi`, `--muted` |
| Azione | `armedCyan` `#5AD8F5` | il tasto di bordo e la spia |
| Tabellone | `flapFace`, `flapFaceTop`, `flapInk`, `boardLegend` `#FFC547` | le palette; il giallo è anche il campo delle Missioni |
| Scie | `trailCore` `#FFF4E2`, `trailGlow` `#FFB866` | uguali |
| Gradi | `rankGold` `#E9C46A` | CAPTAIN e i galloni |
| Livrea | `livery` `#4F7BFF` e `LiveryPalette` | la carta d'imbarco |
| Carattere | SF Pro, Expanded per i titoli, Condensed per il tabellone | `-apple-system` con `font-stretch` (Chrome e Safari sul Mac lo rispettano) |
| Logo | `Contrail/docs/logo/a-galloni/` | `assets/disegni/spallina.svg` e `assets/icona-*` |

### Traduzioni

Tutto il testo che si legge sta nell'HTML in inglese, compreso quello che lo script anima (le parole del tabellone, le storie, le righe della ricevuta, le celle dell'hangar stanno in elementi nascosti). Per le altre lingue basta il meccanismo di Bottlegram: `lingua.js` cammina sui nodi di testo e usa l'inglese come chiave di `lingue.js`. Non è costruito: si fa quando si traduce. Va caricato **prima** di `app.js`, perché `app.js` legge le parole dal DOM all'avvio.

## Da tenere d'occhio

1. **Le schermate** vengono dalla figlia «Sito: schermate in inglese» (`Contrail/docs/sito/schermate-en/`, `elenco.md`), carriere demo fatte dal motore. Per rifarne una: `tools/schermate.sh <png> <nome>` coi nomi `dashboard`, `dispatch`, `dispatch-detail`, `flight-ready`, `current-flight`, `logbook`, `finances`, `bases` (dalla versione alta), `territory` (il foglio del territorio), `airline` (dalla versione alta). I tre ritagli delle Missioni (`.crop`, variabili nell'HTML: `--a` rapporto del riquadro, `--w` larghezza dell'immagine in % del riquadro, `--l` e `--t` spostamenti in % di larghezza e altezza del riquadro; si calcolano dalla regione x0 y0 x1 y1 della schermata a 1x) vanno rimessi se cambia l'inquadratura. Foto del 01/11 sera dal 04/11, tranne `airline@2x.jpg` (31/10): quella nuova ha in vista il riquadro «Full version» col prezzo della build di sviluppo, e il ritaglio Career style è identico. `airline.jpg` a 1x non c'è perché la pagina usa solo il ritaglio dalla 2x.
2. **L'indirizzo `chiefpilot@bulbmode.com`**: è sul modello di Bottlegram, ma va creato o confermato. Compare in tutte e tre le pagine.
3. **La lettera di Francesco** («Com'è nata») è scritta in prima persona: la deve approvare lui.
4. I numeri d'esempio (la ricevuta del volo Francoforte–Monaco, la missione SRV214, i quattro biglietti) sono illustrazioni, segnate come tali dove serve; gradi, percentuali, 28.388 aeroporti e 3.000 frasi sono veri.

## Pubblicazione (31/10/2026)

- Repo pubblico `chiotas/chiefpilot-sito`; GitHub Pages dal ramo `main`, cartella `/`, dominio personalizzato `www.chiefpilot.app` (anche nel file `CNAME`).
- DNS su Namecheap (Advanced DNS di `chiefpilot.app`): quattro record `A` su `@` (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) e `CNAME` di `www` → `chiotas.github.io`. Tolti il parcheggio di `www` e il redirect di Namecheap su `@`. Il TXT SPF dell'inoltro mail di Namecheap è rimasto com'era. Niente `AAAA`: si possono aggiungere (`2606:50c0:8000::153` … `8003::153`).
- HTTPS: certificato Let's Encrypt emesso da GitHub per `www.chiefpilot.app` e `chiefpilot.app` (scade il 29/01/2027, GitHub lo rinnova da solo), **Enforce HTTPS** acceso (i domini `.app` si aprono solo in HTTPS). Il certificato è partito solo dopo aver tolto e rimesso il dominio personalizzato: GitHub ha aggiunto due commit sul file `CNAME`.
- Ancora da fare, facoltativo: verificare il dominio su GitHub (foto profilo → Settings → Pages → Add a domain, un record TXT su Namecheap), così nessun altro repo può usare `chiefpilot.app`.
- Controllato il 31/10: `https://www.chiefpilot.app` dà `200` da `GitHub.com`; `https://chiefpilot.app`, `http://chiefpilot.app` e `http://www.chiefpilot.app` portano con `301` a `https://www.chiefpilot.app/`; `support.html` e `privacy.html` danno `200`; la pagina pubblicata a 1440 è uguale a quella locale, senza errori.

Pages ripubblica da solo a ogni push su `main`.

## Controlli fatti (30–31/10)

- `taste-skill` lint: 0 errori. Ispettore a 1440, 1280, 1024, 768 e 390: 0 errori, quattro avvisi difesi: undici misure di testo (le schermate disegnate in HTML tengono le misure dell'app), nessun video (la pagina è vettoriale per scelta), una riga lunga, il titolo delle Missioni fermo per tre schermate mentre passano i quattro blocchi.
- `impeccable` audit e rifinitura: tab dell'hangar collegati al pannello, titolo «Captain» con un nome completo per i lettori di schermo, niente annunci automatici della missione, bersagli da 44 px al tocco, animazione del tabellone senza ricalcoli di layout, barre di scorrimento scure.
- Aperta come file in Chrome: il tabellone si compone, le scie si disegnano, le cornici caricano.
- Dopo le schermate nuove (31/10): lint 0, ispettore 0 errori; detector di impeccable con solo i componenti dell'app tenuti apposta (la barra di stato della striscia di volo, la fascia di livrea della carta d'imbarco, lo strappo della ricevuta, il maiuscolo della carta).
- `prefers-reduced-motion`: niente animazioni, il tabellone e le scie compaiono già finiti.
