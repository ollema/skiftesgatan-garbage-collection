<script lang="ts">
	import PlanDrawing from './PlanDrawing.svelte';
	import SectionDrawing from './SectionDrawing.svelte';
	import { FACTS, formatKr, ORDER_NOTES, quantities } from './math';

	const SECTIONS = [
		{ id: 'bakgrund', label: 'Bakgrund' },
		{ id: 'ritning', label: 'Ritning' },
		{ id: 'materialatgang', label: 'Materialåtgång' },
		{ id: 'kostnad', label: 'Kostnad' },
		{ id: 'uppbyggnad', label: 'Så byggs plattytan upp' },
		{ id: 'bygge', label: 'Så bygger ni' },
		{ id: 'bestallning', label: 'Innan ni beställer' }
	];
</script>

<svelte:head>
	<title>Fastighetsnära insamling för BRF Skiftesgatan 4</title>
</svelte:head>

<main>
	<header>
		<h1>Fastighetsnära insamling för BRF Skiftesgatan 4</h1>
	</header>

	<nav class="toc" aria-label="Innehåll">
		{#each SECTIONS as s (s.id)}
			<a href="#{s.id}">{s.label}</a>
		{/each}
	</nav>

	<section id="bakgrund">
		<h2>Bakgrund</h2>
		<p>
			Göteborgs nya krav på förpackningssortering för flerbostadshus träder i kraft 2027‑01‑01.
			Föreningen sorterar i dag bara restavfall och matavfall och behöver införa fastighetsnära
			sortering för plast, papper, metall och glas. De nuvarande återvinningsstationerna blir
			därefter LIP (lättillgängliga insamlingsplatser), för skrymmande förpackningar och
			returpapper. Det innebär fem nya kärl: 370 l för papper och 370 l för plast, samt 140 l
			vardera för färgat glas, ofärgat glas och metall.
		</p>

		<h3>Krav</h3>
		<ul class="check">
			<li>Inhägnad rekommenderas.</li>
			<li>Lätt för boende att sortera rätt: sätt upp informationsskyltar.</li>
			<li>Får inte orsaka lukt, buller eller sanitär olägenhet.</li>
			<li>
				Dragväg: max 25 m (bekräftat OK vid platsbesöket 2026‑08‑19), minst 1,2 m bred, 1,35 m bred
				i svängen.
			</li>
			<li>Ytan kärlen dras över ska vara hårdgjord och jämn — inte grus, gräs eller makadam.</li>
			<li>Om inhägnaden har dörr: 1,2 m fri bredd i öppningen.</li>
			<li>Dokumentet "Gör rum för miljön" anger dessutom minst 1,5 m fri gång framför kärlen.</li>
		</ul>
		<p>
			Det ger ett minsta djup på inhägnaden: 6 cm mellanrum + 80 cm (370 l-kärlets djup) + 150 cm
			(fri gång) = 2,36 m. Det ger också en minsta bredd: 6 × 6 cm mellanrum + 3 × 50 cm (140
			l-kärlens bredd) + 2 × 76 cm (370 l-kärlets bredd) = 3,38 m. Kärlen är cirka 1,1 m höga, så
			höjden på inhägnaden är satt till 1,5 m.
		</p>

		<h3>Placering</h3>
		<p>Tilltänkt placering är i innergården, öster om cykelskjulet. Skjulet har fyra sidor:</p>
		<ul class="check">
			<li>
				Bakre väggen är det befintliga höga staketet, som fortsätter österut som inhägnadens norra
				sida.
			</li>
			<li>
				Sidoväggen i öster blir inhägnadens västra sida, där grinden hängs. Den slår inåt, fälls upp
				mot väggen och hålls öppen med en krok under tömning, vilket håller dragvägen helt fri och
				gör att vi slipper en stolpmonterad gångjärnslösning. Skjulets djup är cirka 2,67 m.
			</li>
			<li>Framsidan är öppen mot asfalten som leder till cykelskjulet.</li>
			<li>Sidoväggen i väster är inte relevant för inhägnadens placering.</li>
		</ul>
		<p>
			Att bygga inhägnaden här ger två av fyra sidor gratis (staketet och skjulväggen), och
			dragvägen är redan bekräftad som godkänd.
		</p>
	</section>

	<section id="ritning">
		<h2>Ritning</h2>
		<PlanDrawing />
	</section>

	<section id="materialatgang">
		<h2>Materialåtgång</h2>
		<dl class="facts">
			{#each FACTS as fact (fact.term)}
				<dt>{fact.term}</dt>
				<dd>{fact.description}</dd>
			{/each}
		</dl>
	</section>

	<section id="kostnad">
		<h2>Kostnad</h2>
		<p>
			Priser från hornbach.se (varuhuset i Göteborg) september 2026, inkl. moms, exkl. frakt.
			Plattorna är räknade exakt plus några i reserv, övriga mängder innehåller 5–10 % spill. Rader
			märkta <span class="est">uppsk.</span> är mina uppskattningar, inte verkliga priser. Bärlager och
			stenmjöl köps i stället som storsäck på pall hos stenbolaget.se (prisexempel september 2026, inkl.
			leverans och pallar), med en hyrd pallyftare för lossning.
		</p>
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>Artikel</th>
						<th class="n">Antal</th>
						<th class="n">À-pris</th>
						<th class="n">Kostnad</th>
					</tr>
				</thead>
				<tbody>
					{#each quantities.bomGroups as group (group.label)}
						<tr class="group">
							<td colspan="4">{group.label}</td>
						</tr>
						{#each group.rows as row (row.label)}
							<tr>
								<td
									>{row.label}{#if row.estimated}<span class="est"> uppsk.</span>{/if}</td
								>
								<td class="n">{row.quantity}</td>
								<td class="n">{formatKr(row.unitPrice)}</td>
								<td class="n">{formatKr(row.cost)}</td>
							</tr>
						{/each}
						<tr class="sum">
							<td colspan="3">Summa {group.label.split(',')[0]}</td>
							<td class="n">{formatKr(group.sum)}</td>
						</tr>
					{/each}
					<tr class="sum">
						<td colspan="3">Totalt material</td>
						<td class="n">{formatKr(quantities.total)}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<section id="uppbyggnad">
		<h2>Så byggs plattytan upp</h2>
		<p>
			Ni börjar på gräsmatta, och gräs och matjord går inte att bygga på: det är löst och sjunker
			ihop, så plattorna blir ojämna inom ett år. Därför gräver ni bort hela det mörka jordlagret
			ner till fastare mark och ersätter det med lager som bär.
		</p>
		<div class="section-wrap">
			<SectionDrawing />
			<dl class="layers">
				<dt>Bärlager</dt>
				<dd>
					Krossad sten i blandade storlekar, från damm upp till 32 mm ("0–32", säljs även som
					"bergskross 0–32"). När lagret vibreras ihop med en markvibrator ("packas") låser bitarna
					i varandra och blir ett hårt, dränerande underlag som fördelar lasten. Det är det här
					lagret som gör att plattorna inte sätter sig. Köps som storsäck på pall.
				</dd>
				<dt>Stenmjöl</dt>
				<dd>
					Samma bergart men bara det finaste, här 0–8 mm (något grövre än de 0–4 mm som annars är
					vanligast, men fungerar för det här), ungefär som grov sand. Läggs 3 cm tjockt ovanpå
					bärlagret och dras av jämnt med en rak bräda. Det är stenmjölet som gör ytan plan,
					plattorna knackas ner i det. Köps som storsäck på pall, tillsammans med bärlagret.
				</dd>
				<dt>Fiberduk</dt>
				<dd>
					En tunn geotextil mellan jorden och bärlagret så att stenen inte blandas ner i jorden med
					tiden.
				</dd>
				<dt>Plattor och fogsand</dt>
				<dd>
					Betongplattor 35 × 35 × 5 cm med 3 mm fog. Fogsanden sopas ner i mellanrummen och låser
					plattorna.
				</dd>
			</dl>
		</div>
	</section>

	<section id="bygge">
		<h2>Så bygger ni</h2>
		<ol class="steps">
			<li>
				<strong>Märk ut.</strong> Snöra upp inhägnaden med skjulväggen och det befintliga staketet som
				två av sidorna: 10 × 7 plattor = 3,53 × 2,47 m invändigt. Remsan är 4 plattor (1,41 m) bred och
				5 rader (1,76 m) lång, från grindöppningen rakt söderut. Lägg plattorna i ett sammanhängande rutnät
				med start i hörnet mellan skjulväggen och staketet, då går rutnätet obrutet genom grindöppningen
				ut i remsan.
			</li>
			<li>
				<strong>Gräv.</strong> Ta bort gräset och all matjord, det mörka lösa lagret, ner till fastare
				mark. Det brukar vara 15–25 cm. Räkna sedan från färdig plattyta: platta 5 cm + stenmjöl 3 cm
				+ bärlager 10 cm = 18 cm, se snittet ovan. Är matjorden djupare än så, fyll upp skillnaden med
				mer bärlager.
			</li>
			<li>
				<strong>Plintar.</strong> Gräv ner 4 betongplintar (Benders 4" × 700 mm med fast stolpjärn) med
				överkanten i nivå med färdig plattyta: en mitt på östra sidan, en i sydöstra hörnet, en mitt på
				södra sidan och en grindstolpe. Alla plintar står precis utanför plattornas kant, så ingen platta
				behöver kapas. Bakre änden av östra sidan får ingen stolpe alls, den fästs i det befintliga staketet.
				Packa väl runt plintarna och sätt dem innan plattorna.
			</li>
			<li>
				<strong>Lager.</strong> Lägg fiberduk, sedan bärlagret i två omgångar som vardera packas med markvibrator.
				Dra av 3 cm stenmjöl jämnt, lägg plattorna med 3 mm fog och sopa i fogsand. Ge ytan ca 1 cm fall
				per meter bort från väggen. Sätt yttersta plattraden vid grinden och längs remsan i jordfuktig
				betong eller mot kantstöd så kanten inte vandrar.
			</li>
			<li>
				<strong>Stolpar och staket.</strong> Stolpar 95 × 95 mm skruvas i stolpjärnen. Där östra sidan
				möter det befintliga staketet skruvas en regel 45 × 95 mm stående i staketets stolpe (genomgående
				bult eller franska träskruv, inte bara i brädorna) och de tre reglarna fästs i den. Tre reglar
				45 × 95 mm per fack, stående trall 28 × 120 mm med 10 mm mellanrum, rostfri trallskruv. Nedersta
				brädan 3–5 cm ovanför plattorna.
			</li>
			<li>
				<strong>Grind.</strong> Öppningen är 4 plattor = 1,41 m fri bredd, så grindstolpen hamnar utanför
				plattorna och remsan är lika bred som öppningen. Grindbladet blir 1,37 m brett: ram av 45 × 95
				mm med diagonalsträva, samma brädor som staketet. Gångjärnen sätts i skjulets östra vägg: skruva
				först en regel 45 × 95 mm i väggens stomme som gångjärnsplanka. Grinden slår inåt och fälls upp
				mot skjulväggen, där en krok håller den öppen under tömning. Klinka som går att öppna från båda
				håll mot grindstolpen, som i övrigt är en vanlig staketstolpe.
			</li>
			<li>
				<strong>Skyltar och provkörning.</strong> Sätt upp sorteringsskyltarna från Kretslopp och vatten.
				Rulla varje kärl ut genom grinden, runt hörnet och ut på asfalten innan ni kallar det klart.
			</li>
		</ol>
	</section>

	<section id="bestallning">
		<h2>Innan ni beställer</h2>
		<ul class="check">
			<li>
				<strong>Vikt från Hornbach.</strong> Det ni hämtar där väger sammanlagt runt {ORDER_NOTES.weightTotal},
				i huvudsak plattorna {ORDER_NOTES.weightPlattor}. En vanlig skåpbil lastar 1–1,4 ton, så
				räkna med två vändor eller be Hornbach leverera plattorna på pall.
			</li>
			<li>
				<strong>Bärlager och stenmjöl på pall.</strong> Beställs som storsäck hos stenbolaget.se:
				{ORDER_NOTES.bergskrossSacks} × 1 000 kg bergskross och {ORDER_NOTES.stenmjolSacks} × 500 kg stenmjöl,
				på {ORDER_NOTES.pallets} EUR-pallar, ca {ORDER_NOTES.palletKg} totalt. Hyr en pallyftare för att
				lossa och köra pallarna fram till platsen, en dag räcker.
			</li>
			<li>
				<strong>Stenmjölets marginal.</strong> Beräknat behov är ca {ORDER_NOTES.stenmjolNeeded}, så
				en 500 kg-storsäck ger en knapp marginal. Räcker det inte hela vägen ut i remsan,
				komplettera med en 20 kg-säck stenmjöl från Hornbach.
			</li>
			<li>
				<strong>Schaktmassor.</strong> Ca {ORDER_NOTES.digM3} m³ jord att köra bort, mer om matjorden
				är djup. Räkna med storsäck eller släpkärra.
			</li>
			<li>
				<strong>Fästet i det befintliga staketet.</strong> Kontrollera att staketet har en frisk stolpe
				där inhägnadens östra sida möter det. Sitter närmaste stolpe en bit bort, fäst plankan i den och
				låt reglarna gå dit, eller sätt en egen stolpe ändå (en plint till, ca 160 kr).
			</li>
			<li>
				<strong>Grinden på skjulväggen.</strong> Bladet är 1,37 m brett och väger runt 30 kg, så gångjärnsplankan
				ska sitta i väggens regelverk, inte bara i panelen. Det förutsätter att sidoväggen är hel ända
				fram till skjulets framkant.
			</li>
			<li>
				<strong>Asfaltens bredd.</strong> Remsan når 1,35 m förbi skjulets framkant. Mät hur bred asfalten
				är framför skjulet: remsan ska gå minst lika långt söderut som asfalten, annars blir hörnet i
				svängen gräs. Är asfalten bredare, lägg en rad till (4 plattor).
			</li>
			<li>
				<strong>Marginal för fler kärl.</strong> 10 plattor (3,53 m) ger 15 cm över. Ett kärl till, oavsett
				om det är 140 l eller 370 l, ryms om bredden ökas till 12 plattor (4,24 m), djupet behöver inte
				ändras.
			</li>
			<li>
				<strong>Dragvägen</strong> är godkänd av Kretslopp och vatten (max 25 m). Håll remsan och asfalten
				fria från cyklar och skottade på vintern.
			</li>
		</ul>
	</section>

	<footer>
		Kärlmått från Kretslopp och vattens tabell (140 l: 50 × 55 × 109 cm, 370 l: 76 × 80 × 109 cm).
		Avstånd och krav på dragväg från "Gör rum för miljön" (oktober 2025) och Inga Ziles platsbesök i
		augusti 2026. Ritningen är schematisk men skalenlig.
	</footer>
</main>

<style>
	main {
		max-width: 68.75rem;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 4rem;
	}
	h1,
	h2,
	h3 {
		text-wrap: balance;
	}
	h1 {
		font-size: 2.125rem;
		line-height: 1.15;
		letter-spacing: -0.01em;
		margin: 0 0 0.5rem;
		font-weight: 700;
	}
	h2 {
		font-size: 1.3125rem;
		margin: 0 0 0.375rem;
		font-weight: 700;
	}
	h3 {
		font-size: 1rem;
		margin: 1.125rem 0 0.375rem;
		font-weight: 700;
	}
	p,
	ul.check li,
	ol.steps li,
	.layers dd,
	footer {
		text-wrap: pretty;
	}
	p {
		margin: 0 0 0.75rem;
		max-width: 76ch;
	}
	p:last-of-type {
		margin-bottom: 0;
	}
	.toc {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1.125rem;
		background: var(--paper);
		border-bottom: 1px solid var(--rule);
		padding: 0.625rem 0;
		margin: 0 0 0.25rem;
		font-size: 0.8125rem;
	}
	.toc a {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 0.15em;
		white-space: nowrap;
	}
	.toc a:hover,
	.toc a:focus-visible {
		color: var(--muted);
	}
	section {
		padding: 1.25rem 0;
		scroll-margin-top: 3.25rem;
	}
	.table-wrap {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}
	.facts {
		font-size: 0.875rem;
		margin: 0;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 0.75rem;
		max-width: 76ch;
	}
	.facts dt {
		color: var(--muted);
	}
	.facts dd {
		margin: 0;
	}
	.section-wrap {
		display: grid;
		grid-template-columns: minmax(0, 32.5rem) 1fr;
		gap: 1.75rem;
		align-items: start;
		margin-top: 0.75rem;
	}
	.layers {
		font-size: 0.875rem;
		max-width: 60ch;
	}
	.layers dt {
		font-weight: 600;
		margin-top: 0.625rem;
	}
	.layers dd {
		margin: 0.125rem 0 0;
	}
	@media (max-width: 51.25rem) {
		.section-wrap {
			grid-template-columns: 1fr;
		}
	}
	table {
		border-collapse: collapse;
		width: 100%;
		font-size: 0.8125rem;
		margin-top: 0.5rem;
	}
	th,
	td {
		text-align: left;
		padding: 0.375rem 0.5rem 0.375rem 0;
		vertical-align: top;
		border-bottom: 1px solid var(--rule);
	}
	th {
		font-weight: 600;
		color: var(--muted);
		font-size: 0.75rem;
	}
	td.n,
	th.n {
		text-align: right;
		white-space: nowrap;
	}
	tr.sum td {
		font-weight: 700;
		border-bottom: 2px solid var(--ink);
	}
	tr.sum:last-child td {
		padding-top: 1.125rem;
	}
	tr.group td {
		font-weight: 700;
		padding: 1.25rem 0.5rem 0.375rem 0;
		border-bottom: 1px solid var(--ink);
	}
	tr.group:first-child td {
		padding-top: 0.5rem;
	}
	.est {
		color: var(--muted);
		font-size: 0.78125rem;
	}
	ol.steps {
		padding-left: 1.375rem;
		max-width: 76ch;
	}
	ol.steps li {
		margin-bottom: 0.5rem;
	}
	ul.check {
		padding-left: 1.25rem;
		max-width: 76ch;
	}
	ul.check li {
		margin-bottom: 0.375rem;
	}
	footer {
		font-size: 0.78125rem;
		color: var(--muted);
		border-top: 1px solid var(--rule);
		padding-top: 1rem;
		margin-top: 1.5rem;
	}
	@media print {
		main {
			padding: 0;
		}
		.toc {
			display: none;
		}
		section {
			padding: 1.125rem 0;
			break-inside: avoid;
		}
	}
</style>
