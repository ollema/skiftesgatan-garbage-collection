<script lang="ts">
	import PlanDrawing from './PlanDrawing.svelte';
	import { formatKr } from './format';
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
			insamling (FNI) för plast, papper, metall och glas. För oss innebär FNI fem nya kärl: 370 l
			för papper och 370 l för plast, samt 140 l vardera för färgat glas, ofärgat glas och metall.
		</p>

		<h3>Krav och rekommendationer från Göteborgs stad</h3>
		<ul class="check">
			<li>Det ska vara lätt för boende att sortera rätt (vi ska sätta upp informationsskyltar).</li>
			<li>Insamlingen får inte orsaka lukt, buller eller sanitär olägenhet.</li>
			<li>Dragvägen får vara max 25 m lång, minst 1,2 m bred och minst 1,35 m bred i svängar.</li>
			<li>Dessutom behövs minst 1,5 m fritt utrymme framför kärlen där de är placerade.</li>
			<li>Ytan kärlen dras över ska vara hårdgjord och jämn, inte grus, gräs eller makadam.</li>
			<li>Inhägnad rekommenderas.</li>
			<li>Om inhägnaden har dörr så behöver öppningen vara minst 1,2 m bred.</li>
		</ul>

		<p>Dessa krav, tillsammans med måtten på de nya kärlen:</p>
		<ul class="check">
			<li>140 l: djup 50 cm, bredd 50 cm, höjd 109 cm</li>
			<li>370 l: djup 80 cm, bredd 76 cm, höjd 109 cm</li>
		</ul>
		<p>
			resulterar i ett minsta djup på inhägnaden: 6 cm + 80 cm + 150 cm = <strong>2,36 m.</strong>
			Det ger också en minsta bredd: 6 × 6 cm + 3 × 50 cm + 2 × 76 cm = <strong>3,38 m.</strong>
			Kärlen är cirka 1,1 m höga.
		</p>

		<h3>Styrelsens förslag</h3>
		<p>
			Styrelsen har tänkt bygga inhägnaden i innergården, höger om cykelskjulet. Dragvägen är redan
			godkänd och vi kan utnyttja existerande cykelskjul och staket för att skapa två av inhägnadens
			sidor.
		</p>
		<p>
			Vi har tänkt använda markplattor för att skapa en stabil och jämn yta för inhägnaden och för
			dragvägen.
		</p>
		<p>Höjden på inhägnaden är satt till 1,5 m för att det ska se lite trevligare ut.</p>
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
									{#if row.url}
										<a href={row.url} target="_blank" rel="noopener noreferrer">{row.label}</a>
									{:else}
										{row.label}
									{/if}
									{#if row.estimated}<span class="est">uppsk.</span>{/if}
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
						<td colspan="3">Totalt</td>
						<td class="n">{formatKr(quantities.total)}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>

	<section id="instruktioner">
		<h2>Instruktioner</h2>
		<ol class="steps">
			<li>
				<strong>Beställ material och boka maskiner. </strong>
			</li>
			<li>
				<strong>Märk ut.</strong> Använd t.ex. sprayfärg för att märka upp var vi ska gräva, var plintarna
				ska stå och var markplattorna ska läggas. Använd den stolpen i det existerande staketet och hörnet
				på cykelskjulet som referens men kontrollera även att allt ser rimligt ut genom att lägga ut några
				plattor på gräset.
			</li>
			<li>
				<strong>Gräv.</strong> Gräv ner till ett djup på 18 cm där det ska läggas plattor. Gräv ner till
				ett djup på 70 cm där det ska stå betongplintar.
			</li>
			<li>
				<strong>Placera plintar.</strong> Placera de fyra plintarna enligt ritningen. De ska stå med överkanten
				i nivå med existerande mark och färdig plattyta. Använd en stolpe för att rikta in plintarna korrekt.
				Viktigt att den högra väggen är i linje med stolpe i existerande staket. Alla plintar ska stå
				precis utanför den tilltänkta kanten på plattorna så att ingen platta behöver kapas. Packa väl
				runt plintarna.
			</li>
			<li>
				<strong>Lägg ut fiberduk.</strong> Lägg en tunn fiberduk mellan jorden och bärlagret.
			</li>
			<li>
				<strong>Fyll på med bärlager.</strong> Krossad sten i blandade storlekar, upp till 32 mm ("0–32").
				Lägg det i två omgångar som vardera packas med markvibrator. Vibrationen låser bitarna i varandra
				och blir ett hårt, dränerande underlag som fördelar lasten. Det är det här lagret som gör att
				plattorna inte sätter sig.
			</li>
			<li>
				<strong>Fyll på med stenmjöl.</strong> Krossad sten i finare storlekar, upp till 8 mm ("0-8").
				Ungefär som grov sand. Plana 3 cm tjockt jämnt ovanpå bärlagret med en rak bräda. Det är stenmjölet
				som gör ytan plan, plattorna knackas sen ner i det.
			</li>
			<li>
				<strong>Plattor och fogsand.</strong> Knacka ner (med hjälp av särskild hammare) betongplattor
				35 × 35 × 5 cm med 3 mm fog, alternativt 17.5 x 35 x 5 cm vid gången mot asfalten. Sopa till sist
				ner fogsand i mellanrummen som låser fast plattorna.
			</li>
			<li>
				<strong>Förankra stolpar.</strong> Stolpar 95 × 95 mm skruvas i plintarna. Vid övre änden av högra
				sidan, som förankras på befintliga staketet så skruvas stolpen istället fast på existerande staketets
				stolpe.
			</li>
			<li>
				<strong>Skruva på reglar och trall.</strong> Tre reglar 95 × 95 mm per fack, samma dimension som
				stolparna för att matcha det befintliga staketet, stående trall 28 × 120 mm med 10 mm mellanrum,
				rostfri trallskruv. Nedersta brädan 3–5 cm ovanför plattorna. Såga av toppen med vinkel för att
				förhindra vattenansamling.
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
	td a {
		color: inherit;
		text-decoration-color: var(--muted);
	}
	td a:hover {
		text-decoration-color: var(--ink);
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
