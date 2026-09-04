<script lang="ts">
	import PlanDrawing from './PlanDrawing.svelte';
	import { formatKg, formatKr, formatNumber1 } from './format';
	import { FACTS, quantities } from './materials';

	const SECTIONS = [
		{ id: 'bakgrund', label: 'Bakgrund' },
		{ id: 'ritning', label: 'Ritning' },
		{ id: 'materialatgang', label: 'Materialåtgång' },
		{ id: 'kostnad', label: 'Kostnad' },
		{ id: 'instruktioner', label: 'Instruktioner' }
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

		<h3>Krav och rekommendationer från Göteborgs stad</h3>
		<ul class="check">
			<li>Inhägnad rekommenderas.</li>
			<li>Det ska vara lätt för boende att sortera rätt (vi ska sätta upp informationsskyltar).</li>
			<li>Insamlingen får inte orsaka lukt, buller eller sanitär olägenhet.</li>
			<li>Dragvägen får vara max 25 m lång, minst 1,2 m bred och minst 1,35 m bred i svängar.</li>
			<li>Ytan kärlen dras över ska vara hårdgjord och jämn, inte grus, gräs eller makadam.</li>
			<li>Om inhägnaden har dörr: 1,2 m fri bredd i öppningen.</li>
			<li>Dokumentet "Gör rum för miljön" anger dessutom minst 1,5 m fri gång framför kärlen.</li>
		</ul>

		<p>Dessa krav, tillsammans med måtten på de nya kärlen:</p>
		<ul class="check">
			<li>140 l: djup 50 cm, bredd 50 cm, höjd 109 cm</li>
			<li>370 l: djup 80 cm, bredd 76 cm, höjd 109 cm</li>
		</ul>
		<p>
			resulterar i ett minsta djup på inhägnaden: 6 cm + 80 cm + 150 cm = <strong>2,36 m.</strong>
			Det ger också en minsta bredd: 6 × 6 cm + 3 × 50 cm + 2 × 76 cm = <strong>3,38 m.</strong>
			Kärlen är cirka 1,1 m höga, så höjden på inhägnaden är satt till <b>1,5 m</b> så att det ska se
			lite trevligare ut.
		</p>

		<h3>Styrelsens förslag</h3>
		<p>
			Vi har tänkt bygga inhägnaden i innergården, öster om cykelskjulet. Dragvägen är redan godkänd
			och vi kan utnyttja existernade cykelskjul och staket för att skapa två av inhägnadens sidor.
		</p>
		<p>
			Vi har tänkt använda markplattor för att skapa en stabil och jämn yta för inhägnaden och för
			dragvägen. Grinden öppnas inåt och förankras i cykelskjulet.
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
								<td>
									{row.label}{#if row.estimated}<span class="est">uppsk.</span>{/if}
								</td>
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

	<section id="instruktioner">
		<h2>Instruktioner</h2>
		<p>
			Ni börjar på gräsmatta, och gräs och matjord går inte att bygga på: det är löst och sjunker
			ihop, så plattorna blir ojämna inom ett år. Därför gräver ni bort hela det mörka jordlagret
			ner till fastare mark och ersätter det med lager som bär.
		</p>
		<ol class="steps">
			<li>
				<strong>Beställ material.</strong> Det ni hämtar på Hornbach väger sammanlagt runt
				{formatKg(quantities.weightTotal)}, i huvudsak plattorna ({formatKg(quantities.weightPlattor)}).
				En vanlig skåpbil lastar 1–1,4 ton, så räkna med två vändor eller be Hornbach leverera plattorna
				på pall. Bärlager och stenmjöl beställs som storsäck hos stenbolaget.se:
				{quantities.bergskrossSacks} × 1 000 kg bergskross och {quantities.stenmjolSacks} × 500 kg
				stenmjöl, på {quantities.pallets} EUR-pallar, ca {formatKg(quantities.palletKg)} totalt. Hyr en
				pallyftare för att lossa och köra pallarna fram till platsen, en dag räcker. Beräknat
				stenmjölsbehov är ca {formatKg(Math.round(quantities.stenmjolKg))}, så en 500 kg-storsäck ger en
				knapp marginal — räcker det inte hela vägen ut i remsan, komplettera med en 20 kg-säck stenmjöl
				från Hornbach.
			</li>
			<li>
				<strong>Märk ut.</strong> Snöra upp inhägnaden med skjulväggen och det befintliga staketet som
				två av sidorna: 10 × 7 plattor = 3,53 × 2,47 m invändigt. Remsan är 4 plattor (1,41 m) bred och
				5 rader (1,76 m) lång, från grindöppningen rakt söderut. Lägg plattorna i ett sammanhängande rutnät
				med start i hörnet mellan skjulväggen och staketet, då går rutnätet obrutet genom grindöppningen
				ut i remsan. Mät samtidigt hur bred asfalten är framför skjulet: remsan når 1,35 m förbi skjulets
				framkant och ska gå minst lika långt söderut som asfalten, annars blir hörnet i svängen gräs. Är
				asfalten bredare, lägg en rad plattor till i remsan. Vill ni kunna ställa ett kärl till senare,
				oavsett storlek, ökar ni bredden till 12 plattor (4,24 m) istället för 10 — djupet behöver inte
				ändras.
			</li>
			<li>
				<strong>Gräv.</strong> Ta bort gräset och all matjord, det mörka lösa lagret, ner till fastare
				mark. Det brukar vara 15–25 cm. Räkna sedan från färdig plattyta: platta 5 cm + stenmjöl 3 cm
				+ bärlager 10 cm = 18 cm. Är matjorden djupare än så, fyll upp skillnaden med mer bärlager. Räkna
				med ca {formatNumber1(quantities.digM3)} m³ schaktmassor att köra bort, mer om matjorden är djup
				— storsäck eller släpkärra brukar räcka.
			</li>
			<li>
				<strong>Plintar.</strong> Gräv ner 4 betongplintar (Benders 4" × 700 mm med fast stolpjärn) med
				överkanten i nivå med färdig plattyta: en mitt på östra sidan, en i sydöstra hörnet, en mitt på
				södra sidan och en grindstolpe. Alla plintar står precis utanför plattornas kant, så ingen platta
				behöver kapas. Bakre änden av östra sidan får ingen stolpe alls, den fästs i det befintliga
				staketet — kontrollera i förväg att staketet har en frisk stolpe just där. Sitter närmaste stolpe
				en bit bort, fäst plankan i den och låt reglarna gå dit, eller sätt en egen stolpe ändå (en plint
				till, ca 160 kr). Packa väl runt plintarna och sätt dem innan plattorna.
			</li>
			<li>
				<strong>Fiberduk.</strong> Lägg en tunn geotextil mellan jorden och bärlagret, det håller stenen
				från att blandas ner i jorden med tiden.
			</li>
			<li>
				<strong>Bärlager.</strong> Krossad sten i blandade storlekar, från damm upp till 32 mm ("0–32",
				säljs även som "bergskross 0–32"). Lägg det i två omgångar som vardera packas med markvibrator:
				vibrationen låser bitarna i varandra och blir ett hårt, dränerande underlag som fördelar lasten
				— det är det här lagret som gör att plattorna inte sätter sig.
			</li>
			<li>
				<strong>Stenmjöl.</strong> Samma bergart men bara det finaste, här 0–8 mm (något grövre än de
				0–4 mm som annars är vanligast, men fungerar för det här), ungefär som grov sand. Dra av 3 cm
				tjockt jämnt ovanpå bärlagret med en rak bräda — det är stenmjölet som gör ytan plan, plattorna
				knackas ner i det.
			</li>
			<li>
				<strong>Plattor och fogsand.</strong> Betongplattor 35 × 35 × 5 cm med 3 mm fog. Ge ytan ca 1 cm
				fall per meter bort från väggen och sätt yttersta plattraden vid grinden och längs remsan i
				jordfuktig betong eller mot kantstöd så kanten inte vandrar. Sopa till sist ner fogsand i
				mellanrummen, den låser plattorna.
			</li>
			<li>
				<strong>Stolpar.</strong> Stolpar 95 × 95 mm skruvas i stolpjärnen. Där östra sidan möter det
				befintliga staketet finns ingen egen stolpe: skruva istället en regel 45 × 95 mm stående i
				staketets stolpe (genomgående bult eller franska träskruv, inte bara i brädorna), den blir
				fästpunkt för de tre reglarna på den sidan.
			</li>
			<li>
				<strong>Reglar och trall.</strong> Tre reglar 45 × 95 mm per fack, stående trall 28 × 120 mm med
				10 mm mellanrum, rostfri trallskruv. Nedersta brädan 3–5 cm ovanför plattorna.
			</li>
			<li>
				<strong>Grind.</strong> Öppningen är 4 plattor = 1,41 m fri bredd, så grindstolpen hamnar utanför
				plattorna och remsan är lika bred som öppningen. Grindbladet blir 1,37 m brett och väger runt
				30 kg: ram av 45 × 95 mm med diagonalsträva, samma brädor som staketet. Gångjärnen sätts i
				skjulets östra vägg: skruva först en regel 45 × 95 mm i väggens stomme som gångjärnsplanka, den
				ska sitta i väggens regelverk och inte bara i panelen — det förutsätter att sidoväggen är hel
				ända fram till skjulets framkant. Grinden slår inåt och fälls upp mot skjulväggen, där en krok
				håller den öppen under tömning. Klinka som går att öppna från båda håll mot grindstolpen, som i
				övrigt är en vanlig staketstolpe.
			</li>
			<li>
				<strong>Skyltar och provkörning.</strong> Sätt upp sorteringsskyltarna från Kretslopp och vatten.
				Rulla varje kärl ut genom grinden, runt hörnet och ut på asfalten innan ni kallar det klart. Håll
				sedan remsan och asfalten fria från cyklar och skotta dem på vintern, det är dragvägen kärlen
				dras över.
			</li>
		</ol>
	</section>
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
	ol.steps li {
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
		margin-left: 0.25rem;
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
