<script lang="ts">
	import { SOPKARL, SOPKARL_SIZES } from './bins';
	import {
		INHAGNAD_OFFSET_X,
		INHAGNAD_OFFSET_Y,
		PLATT_YTOR,
		PLATTA_PITCH,
		PLINT_HAL,
		SCHAKT_POLYGON,
		SOPKARL_GAP,
		STAKET,
		STOLPAR,
		STOLPE_WIDTH,
		type Rect
	} from './dimensions';
	import {
		ASPHALT,
		EXISTING_FENCE,
		EXISTING_STUD,
		NEW_FENCE,
		PLAN_SCALE,
		PLAN_VIEWBOX,
		PLINT_TOPP,
		planX,
		planY,
		SHED,
		SHED_FRONT_GUIDE,
		SHED_STUDS,
		TRALL_BOARDS,
		type Annotation,
		type Dimension,
		type Layer
	} from './plan-view';

	let {
		layers,
		annotations = [],
		label
	}: { layers: Layer[]; annotations?: Annotation[]; label: string } = $props();

	const visible = $derived(new Set(layers));

	/** Ritningen finns flera gånger på sidan, så mönstrens id måste vara unika. */
	const id = $props.id();

	const postPx = STOLPE_WIDTH * PLAN_SCALE;
	const tilePx = PLATTA_PITCH * PLAN_SCALE;

	const schaktPoints = SCHAKT_POLYGON.map((p) => `${planX(p.x)},${planY(p.y)}`).join(' ');
	const tileFields = Object.values(PLATT_YTOR);

	function rect(r: Rect) {
		return {
			x: planX(r.x),
			y: planY(r.y),
			width: r.width * PLAN_SCALE,
			height: r.height * PLAN_SCALE
		};
	}

	function horizontalDimension(dim: Extract<Dimension, { orientation: 'horizontal' }>) {
		const y = planY(dim.at);
		const x1 = planX(dim.from);
		const x2 = planX(dim.to);
		return { y, x1, x2, textX: (x1 + x2) / 2, textY: dim.below ? y + 14 : y - 5 };
	}

	function verticalDimension(dim: Extract<Dimension, { orientation: 'vertical' }>) {
		const x = planX(dim.at);
		const y1 = planY(dim.from);
		const y2 = planY(dim.to);
		const textX = dim.left ? x - 6 : x + 14;
		const textY = (y1 + y2) / 2;
		return { x, y1, y2, textX, textY, rotate: dim.left ? -90 : 90 };
	}
</script>

<svg
	viewBox="0 0 {PLAN_VIEWBOX.width} {PLAN_VIEWBOX.height}"
	xmlns="http://www.w3.org/2000/svg"
	role="img"
	aria-label={label}
>
	<defs>
		<pattern
			id="{id}-tile"
			x={planX(INHAGNAD_OFFSET_X)}
			y={planY(INHAGNAD_OFFSET_Y)}
			width={tilePx}
			height={tilePx}
			patternUnits="userSpaceOnUse"
		>
			<rect width={tilePx} height={tilePx} fill="#ccd0c8" />
			<!-- fogen ritas en halv linjebredd in i rutan, annars klipper mönstret bort
			     yttre halvan och fogarna inne i fältet blir tunnare än fältens kanter -->
			<path d="M{tilePx} 0.5H0.5V{tilePx}" fill="none" stroke="#b0b5ad" stroke-width="1" />
		</pattern>
		<pattern id="{id}-barlager" width="11" height="11" patternUnits="userSpaceOnUse">
			<rect width="11" height="11" fill="#b8b8b8" />
			<circle cx="2" cy="2.5" r="1.2" fill="#8f8f8f" />
			<circle cx="7.5" cy="1.5" r="1" fill="#9a9a9a" />
			<circle cx="4.5" cy="6" r="1.4" fill="#9a9a9a" />
			<circle cx="9" cy="7.5" r="1" fill="#8f8f8f" />
			<circle cx="1.5" cy="9.5" r="1" fill="#9a9a9a" />
		</pattern>
		<pattern id="{id}-stenmjol" width="6" height="6" patternUnits="userSpaceOnUse">
			<rect width="6" height="6" fill="#cfc9b8" />
			<circle cx="1.5" cy="1.5" r="0.5" fill="#b8b09a" />
			<circle cx="4.5" cy="4" r="0.5" fill="#b8b09a" />
		</pattern>
	</defs>

	<!-- gräsmatta som bakgrund där inget annat täcker -->
	<rect x="0" y="0" width={PLAN_VIEWBOX.width} height={PLAN_VIEWBOX.height} fill="#d7e6c1" />

	<!-- asfalt framför hela skjulet -->
	<rect {...rect(ASPHALT)} fill="#e2e4e0" />

	<!-- markuppbyggnaden, nedifrån och upp: schakt, plinthål, fiberduk, bärlager, stenmjöl, plattor -->
	{#if visible.has('schakt')}
		<polygon points={schaktPoints} fill="#7f5b3a" />
	{/if}
	<!-- plinthålen sticker ut utanför schakten; den delen packad jord som förblir synlig -->
	{#if visible.has('plinthal')}
		{#each PLINT_HAL as hole (hole.x + ',' + hole.y)}
			<rect {...rect(hole)} fill="#6b4a2b" />
		{/each}
	{/if}
	{#if visible.has('fiberduk')}
		<polygon points={schaktPoints} fill="#dcdcdc" />
	{/if}
	{#if visible.has('barlager')}
		<polygon points={schaktPoints} fill="url(#{id}-barlager)" />
	{/if}
	{#if visible.has('stenmjol')}
		{#each tileFields as field (field.x + ',' + field.y)}
			<rect {...rect(field)} fill="url(#{id}-stenmjol)" />
		{/each}
	{/if}

	<!-- plinttopparna; de ligger under plattorna -->
	{#if visible.has('plint-topp')}
		{#each PLINT_TOPP as plint (plint.x + ',' + plint.y)}
			<rect {...rect(plint)} fill="#b5b5b5" stroke="#7a7a7a" stroke-width="1" />
		{/each}
	{/if}
	{#if visible.has('plattor')}
		{#each tileFields as field (field.x + ',' + field.y)}
			<rect {...rect(field)} fill="url(#{id}-tile)" />
		{/each}
	{/if}

	<!-- utmärkning med sprayfärg: schaktens omriss och plinthålen -->
	{#if visible.has('markering')}
		<polygon points={schaktPoints} class="markering" />
		{#each PLINT_HAL as hole (hole.x + ',' + hole.y)}
			<rect {...rect(hole)} class="markering" />
		{/each}
	{/if}

	<!-- cykelskjul: tak i ljus ton, väggar i mörkbrunt, öppen framsida -->
	<rect
		x={planX(SHED.x)}
		y={planY(SHED.y)}
		width={SHED.width * PLAN_SCALE}
		height={SHED.depth * PLAN_SCALE}
		fill="#efe3d3"
	/>
	<line x1={planX(-0.03)} y1={planY(0)} x2={planX(-0.03)} y2={planY(SHED.depth)} class="wall" />
	<!-- hörnstolpe i skjulets framkant (mot öppna framsidan), sticker ut inåt skjulet ur väggen -->
	<rect
		x={planX(SHED_STUDS.front.x1)}
		y={planY(SHED_STUDS.front.y1)}
		width={(SHED_STUDS.front.x2 - SHED_STUDS.front.x1) * PLAN_SCALE}
		height={(SHED_STUDS.front.y2 - SHED_STUDS.front.y1) * PLAN_SCALE}
		class="brown"
	/>
	<!-- hörnstolpe i skjulets bakkant (mot befintliga staketet), sticker ut förbi staketlinjen -->
	<rect
		x={planX(SHED_STUDS.rear.x1)}
		y={planY(SHED_STUDS.rear.y1)}
		width={(SHED_STUDS.rear.x2 - SHED_STUDS.rear.x1) * PLAN_SCALE}
		height={(SHED_STUDS.rear.y2 - SHED_STUDS.rear.y1) * PLAN_SCALE}
		class="brown"
	/>
	<line
		x1={planX(SHED_FRONT_GUIDE.x1)}
		y1={planY(SHED_FRONT_GUIDE.y1)}
		x2={planX(SHED_FRONT_GUIDE.x2)}
		y2={planY(SHED_FRONT_GUIDE.y2)}
		class="wall-guide"
	/>

	<!-- befintligt högt staket = skjulets bakvägg, fortsätter som inhägnadens bakre sida -->
	<line
		x1={planX(EXISTING_FENCE.x1)}
		y1={planY(EXISTING_FENCE.y1)}
		x2={planX(EXISTING_FENCE.x2)}
		y2={planY(EXISTING_FENCE.y2)}
		class="wall"
	/>
	<!-- befintlig stolpe, sticker ut förbi staketlinjen - här fästs det nya staketets stolpe (se STAKET.anchor) -->
	<rect
		x={planX(EXISTING_STUD.x)}
		y={planY(EXISTING_STUD.y1)}
		width={EXISTING_STUD.width * PLAN_SCALE}
		height={(EXISTING_STUD.y2 - EXISTING_STUD.y1) * PLAN_SCALE}
		class="brown"
	/>

	<!-- kärl -->
	{#if visible.has('karl')}
		{#each SOPKARL as bin (bin.x)}
			{@const size = SOPKARL_SIZES[bin.size]}
			{@const x = planX(bin.x)}
			{@const y = planY(INHAGNAD_OFFSET_Y + SOPKARL_GAP)}
			{@const w = size.width * PLAN_SCALE}
			{@const h = size.depth * PLAN_SCALE}
			<g>
				<rect {x} {y} width={w} height={h} rx="5" class="bin" />
				<text class="bin-label" text-anchor="middle" x={x + w / 2} y={y + h / 2 + 4}
					>{size.label}</text
				>
			</g>
		{/each}
	{/if}

	<!-- nytt staket: reglar (95×95, mittlinje) + trallbrädor utanpå + stolpar överst -->
	{#if visible.has('reglar')}
		<line
			x1={planX(NEW_FENCE.far.x)}
			y1={planY(NEW_FENCE.far.y1)}
			x2={planX(NEW_FENCE.far.x)}
			y2={planY(NEW_FENCE.far.y2)}
			stroke-width={postPx}
			class="new-fence"
		/>
		<line
			x1={planX(NEW_FENCE.front.x1)}
			y1={planY(NEW_FENCE.front.y)}
			x2={planX(NEW_FENCE.front.x2)}
			y2={planY(NEW_FENCE.front.y)}
			stroke-width={postPx}
			class="new-fence"
		/>
	{/if}
	{#if visible.has('trall')}
		{#each TRALL_BOARDS as board (board.x + ',' + board.y)}
			<rect {...rect(board)} class="cladding" />
		{/each}
	{/if}
	{#if visible.has('stolpar')}
		{#each [...STOLPAR, STAKET.anchor] as post (post.x + ',' + post.y)}
			<rect
				x={planX(post.x) - postPx / 2}
				y={planY(post.y) - postPx / 2}
				width={postPx}
				height={postPx}
				class="post"
			/>
		{/each}
	{/if}

	<!-- annoteringar -->
	{#each annotations as a, i (i)}
		{#if a.kind === 'dimension' && a.orientation === 'horizontal'}
			{@const { y, x1, x2, textX, textY } = horizontalDimension(a)}
			<g class="dim">
				<line {x1} y1={y} {x2} y2={y} />
				<line {x1} y1={y - 5} x2={x1} y2={y + 5} />
				<line x1={x2} y1={y - 5} {x2} y2={y + 5} />
				<text x={textX} y={textY} text-anchor="middle">{a.label}</text>
			</g>
		{:else if a.kind === 'dimension'}
			{@const { x, y1, y2, textX, textY, rotate } = verticalDimension(a)}
			<g class="dim">
				<line x1={x} {y1} x2={x} {y2} />
				<line x1={x - 5} {y1} x2={x + 5} y2={y1} />
				<line x1={x - 5} y1={y2} x2={x + 5} {y2} />
				<text x={textX} y={textY} text-anchor="middle" transform="rotate({rotate} {textX} {textY})"
					>{a.label}</text
				>
			</g>
		{:else if a.kind === 'callout'}
			{@const x = planX(a.x)}
			{@const y = planY(a.y)}
			{@const tx = x + a.dx * PLAN_SCALE}
			{@const ty = y + a.dy * PLAN_SCALE}
			{@const anchor = a.dx > 0 ? 'start' : a.dx < 0 ? 'end' : 'middle'}
			<g class="dim callout">
				<circle cx={x} cy={y} r="3" />
				<line x1={x} y1={y} x2={tx} y2={ty} />
				<text
					x={tx + (a.dx > 0 ? 4 : a.dx < 0 ? -4 : 0)}
					y={ty + (a.dy > 0 ? 12 : 4)}
					text-anchor={anchor}>{a.label}</text
				>
			</g>
		{:else}
			<text class="field-label" x={planX(a.x)} y={planY(a.y)} text-anchor="middle">{a.label}</text>
		{/if}
	{/each}
</svg>

<style>
	svg {
		width: 100%;
		max-width: var(--drawing-width);
		height: auto;
		display: block;
		margin-top: 12px;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	}
	.wall {
		stroke: #8c7d4e;
		stroke-width: 6;
	}
	.wall-guide {
		stroke: #8c7d4e;
		stroke-width: 1.5;
		stroke-dasharray: 6 6;
	}
	.markering {
		fill: none;
		stroke: #d0341b;
		stroke-width: 3;
		stroke-linejoin: round;
	}
	.new-fence {
		stroke: #b3a571;
	}
	.cladding {
		fill: #cdc08c;
		stroke: #a89a68;
		stroke-width: 0.5;
	}
	.post {
		fill: #9a8a50;
	}
	.bin {
		fill: #cfebdc;
		stroke: #2b8a62;
		stroke-width: 2;
	}
	.bin-label {
		font-size: 10.5px;
		font-weight: 700;
		fill: #174d36;
	}
	.brown {
		fill: #8c7d4e;
	}
	.dim {
		stroke: #1e2a26;
		stroke-width: 1;
		font-size: 11px;
	}
	.dim text,
	.field-label {
		stroke: #fcfcfa;
		stroke-width: 3;
		paint-order: stroke;
		fill: #1e2a26;
	}
	.callout circle {
		fill: #1e2a26;
	}
	.field-label {
		font-size: 12px;
		font-weight: 700;
	}
</style>
