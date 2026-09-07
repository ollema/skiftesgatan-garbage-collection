<script lang="ts">
	import { BIN_SIZES, BINS } from './bins';
	import {
		ENCLOSURE_OFFSET_X,
		ENCLOSURE_OFFSET_Y,
		FENCE,
		GAP,
		POST_WIDTH,
		POSTS,
		TILE_PITCH
	} from './dimensions';
	import {
		ASPHALT,
		CONNECTOR_LABEL,
		EXISTING_FENCE,
		EXISTING_STUD,
		FENCE_CLADDING,
		GRAVEL_NORTH,
		GRAVEL_WEST,
		NEW_FENCE,
		PLAN_DIMENSIONS,
		PLAN_SCALE,
		PLAN_VIEWBOX,
		POST_HOLES,
		planX,
		planY,
		SHED,
		SHED_FRONT_GUIDE,
		SHED_LABEL_AT,
		SHED_STUDS,
		TILE_FIELDS,
		type Dimension
	} from './plan-view';

	const postPx = POST_WIDTH * PLAN_SCALE;

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
	aria-label="Plan över inhägnaden"
>
	<defs>
		<pattern
			id="tile"
			x={planX(ENCLOSURE_OFFSET_X)}
			y={planY(ENCLOSURE_OFFSET_Y)}
			width={TILE_PITCH * PLAN_SCALE}
			height={TILE_PITCH * PLAN_SCALE}
			patternUnits="userSpaceOnUse"
		>
			<rect width={TILE_PITCH * PLAN_SCALE} height={TILE_PITCH * PLAN_SCALE} fill="#eeefec" />
			<path
				d="M{TILE_PITCH * PLAN_SCALE} 0H0V{TILE_PITCH * PLAN_SCALE}"
				fill="none"
				stroke="#cfd4ce"
				stroke-width="1"
			/>
		</pattern>
		<pattern id="gravel" width="11" height="11" patternUnits="userSpaceOnUse">
			<rect width="11" height="11" fill="#ded7c7" />
			<circle cx="2" cy="2.5" r="1" fill="#b3a890" />
			<circle cx="7.5" cy="1.5" r="1" fill="#b3a890" />
			<circle cx="4.5" cy="6" r="1" fill="#b3a890" />
			<circle cx="9" cy="7.5" r="1" fill="#b3a890" />
			<circle cx="1.5" cy="9.5" r="1" fill="#b3a890" />
		</pattern>
	</defs>

	<!-- gräsmatta som bakgrund där inget annat täcker -->
	<rect x="0" y="0" width={PLAN_VIEWBOX.width} height={PLAN_VIEWBOX.height} fill="#d7e6c1" />

	<!-- asfalt framför hela skjulet -->
	<rect
		x={planX(ASPHALT.x)}
		y={planY(ASPHALT.y)}
		width={ASPHALT.width * PLAN_SCALE}
		height={ASPHALT.height * PLAN_SCALE}
		fill="#e2e4e0"
	/>
	<text
		class="label muted"
		text-anchor="middle"
		x={planX(ASPHALT.labelAt.x)}
		y={planY(ASPHALT.labelAt.y)}>Asfalt</text
	>

	<!-- grus: marginalen mellan befintliga väggen och plattfältets nya, förskjutna kanter -->
	<rect
		x={planX(GRAVEL_NORTH.x)}
		y={planY(GRAVEL_NORTH.y)}
		width={GRAVEL_NORTH.width * PLAN_SCALE}
		height={GRAVEL_NORTH.height * PLAN_SCALE}
		fill="url(#gravel)"
	/>
	<rect
		x={planX(GRAVEL_WEST.x)}
		y={planY(GRAVEL_WEST.y)}
		width={GRAVEL_WEST.width * PLAN_SCALE}
		height={GRAVEL_WEST.height * PLAN_SCALE}
		fill="url(#gravel)"
	/>
	<!-- grävda stolphål, 170×170 mm - halva som hamnar under plattorna täcks av dem nedan -->
	{#each POST_HOLES as hole (hole.x + ',' + hole.y)}
		<rect
			x={planX(hole.x)}
			y={planY(hole.y)}
			width={hole.size * PLAN_SCALE}
			height={hole.size * PLAN_SCALE}
			fill="url(#gravel)"
		/>
	{/each}

	<!-- plattor: inhägnadens golv + remsa, ett sammanhängande rutnät -->
	<rect
		x={planX(TILE_FIELDS.enclosure.x)}
		y={planY(TILE_FIELDS.enclosure.y)}
		width={TILE_FIELDS.enclosure.width * PLAN_SCALE}
		height={TILE_FIELDS.enclosure.height * PLAN_SCALE}
		fill="url(#tile)"
		class="tile-field"
	/>
	<rect
		x={planX(TILE_FIELDS.strip.x)}
		y={planY(TILE_FIELDS.strip.y)}
		width={TILE_FIELDS.strip.width * PLAN_SCALE}
		height={TILE_FIELDS.strip.height * PLAN_SCALE}
		fill="url(#tile)"
		class="tile-field"
	/>
	<!-- ny rad som viker av västerut och täcker glappet mot asfalten (spegelvänt L) -->
	<rect
		x={planX(TILE_FIELDS.connector.x)}
		y={planY(TILE_FIELDS.connector.y)}
		width={TILE_FIELDS.connector.width * PLAN_SCALE}
		height={TILE_FIELDS.connector.height * PLAN_SCALE}
		fill="url(#tile)"
		class="tile-field"
	/>
	<text
		class="label-small muted"
		text-anchor="end"
		x={planX(CONNECTOR_LABEL.x)}
		y={planY(CONNECTOR_LABEL.y)}
		transform="rotate(-90 {planX(CONNECTOR_LABEL.x)} {planY(CONNECTOR_LABEL.y)})"
		>{CONNECTOR_LABEL.text}</text
	>

	<!-- cykelskjul: tak i ljus ton, väggar i mörkbrunt, öppen framsida -->
	<rect
		x={planX(SHED.x)}
		y={planY(SHED.y)}
		width={SHED.width * PLAN_SCALE}
		height={SHED.depth * PLAN_SCALE}
		fill="#efe3d3"
	/>
	<line x1={planX(-0.03)} y1={planY(0)} x2={planX(-0.03)} y2={planY(SHED.depth)} class="wall" />
	<!-- hörnstolpe, sydöstra hörnet av skjulet (mot öppna framsidan), sticker ut västerut ur väggen -->
	<rect
		x={planX(SHED_STUDS.se.x1)}
		y={planY(SHED_STUDS.se.y1)}
		width={(SHED_STUDS.se.x2 - SHED_STUDS.se.x1) * PLAN_SCALE}
		height={(SHED_STUDS.se.y2 - SHED_STUDS.se.y1) * PLAN_SCALE}
		class="brown"
	/>
	<!-- hörnstolpe, nordöstra hörnet av skjulet (mot befintliga staketet), sticker ut norrut ur väggen -->
	<rect
		x={planX(SHED_STUDS.ne.x1)}
		y={planY(SHED_STUDS.ne.y1)}
		width={(SHED_STUDS.ne.x2 - SHED_STUDS.ne.x1) * PLAN_SCALE}
		height={(SHED_STUDS.ne.y2 - SHED_STUDS.ne.y1) * PLAN_SCALE}
		class="brown"
	/>
	<line
		x1={planX(SHED_FRONT_GUIDE.x1)}
		y1={planY(SHED_FRONT_GUIDE.y1)}
		x2={planX(SHED_FRONT_GUIDE.x2)}
		y2={planY(SHED_FRONT_GUIDE.y2)}
		class="wall-guide"
	/>
	<text class="label ink" text-anchor="middle" x={planX(SHED_LABEL_AT.x)} y={planY(SHED_LABEL_AT.y)}
		>Cykelskjul</text
	>

	<!-- befintligt högt staket = skjulets bakvägg, fortsätter som inhägnadens norra sida -->
	<line
		x1={planX(EXISTING_FENCE.x1)}
		y1={planY(EXISTING_FENCE.y1)}
		x2={planX(EXISTING_FENCE.x2)}
		y2={planY(EXISTING_FENCE.y2)}
		class="wall"
	/>
	<!-- befintlig stolpe, sticker ut norrut ur väggen - här fästs det nya staketets stolpe (se FENCE.anchor) -->
	<rect
		x={planX(EXISTING_STUD.x)}
		y={planY(EXISTING_STUD.y1)}
		width={EXISTING_STUD.width * PLAN_SCALE}
		height={(EXISTING_STUD.y2 - EXISTING_STUD.y1) * PLAN_SCALE}
		class="brown"
	/>
	<text
		class="label-small brown"
		x={planX(EXISTING_FENCE.labelAt.x)}
		y={planY(EXISTING_FENCE.labelAt.y)}>Befintligt staket</text
	>

	<!-- kärl -->
	{#each BINS as bin (bin.x)}
		{@const size = BIN_SIZES[bin.size]}
		{@const x = planX(bin.x)}
		{@const y = planY(ENCLOSURE_OFFSET_Y + GAP)}
		{@const w = size.width * PLAN_SCALE}
		{@const h = size.depth * PLAN_SCALE}
		<g>
			<rect {x} {y} width={w} height={h} rx="5" class="bin" />
			<text class="bin-label" text-anchor="middle" x={x + w / 2} y={y + h / 2 - 4}
				>{size.label}</text
			>
			<text class="bin-name" text-anchor="middle" x={x + w / 2} y={y + h / 2 + 9}
				>{bin.name[0]}</text
			>
			{#if bin.name[1]}
				<text class="bin-name" text-anchor="middle" x={x + w / 2} y={y + h / 2 + 20}
					>{bin.name[1]}</text
				>
			{/if}
		</g>
	{/each}

	<!-- nytt staket: regel/stolpe (95×95, mittlinje) + trallklädsel utanpå, öppning istället för grind -->
	<line
		x1={planX(NEW_FENCE.east.x)}
		y1={planY(NEW_FENCE.east.y1)}
		x2={planX(NEW_FENCE.east.x)}
		y2={planY(NEW_FENCE.east.y2)}
		stroke-width={postPx}
		class="new-fence"
	/>
	<line
		x1={planX(NEW_FENCE.south.x1)}
		y1={planY(NEW_FENCE.south.y)}
		x2={planX(NEW_FENCE.south.x2)}
		y2={planY(NEW_FENCE.south.y)}
		stroke-width={postPx}
		class="new-fence"
	/>
	<!-- trall, 28 mm, spikad på utsidan av reglarna -->
	<rect
		x={planX(FENCE_CLADDING.east.x)}
		y={planY(FENCE_CLADDING.east.y1)}
		width={FENCE_CLADDING.east.width * PLAN_SCALE}
		height={(FENCE_CLADDING.east.y2 - FENCE_CLADDING.east.y1) * PLAN_SCALE}
		class="cladding"
	/>
	<rect
		x={planX(FENCE_CLADDING.south.x1)}
		y={planY(FENCE_CLADDING.south.y)}
		width={(FENCE_CLADDING.south.x2 - FENCE_CLADDING.south.x1) * PLAN_SCALE}
		height={FENCE_CLADDING.south.height * PLAN_SCALE}
		class="cladding"
	/>
	{#each POSTS as post (post.x + ',' + post.y)}
		<rect
			x={planX(post.x) - postPx / 2}
			y={planY(post.y) - postPx / 2}
			width={postPx}
			height={postPx}
			class="post"
		/>
	{/each}
	<rect
		x={planX(FENCE.anchor.x) - postPx / 2}
		y={planY(FENCE.anchor.y) - postPx / 2}
		width={postPx}
		height={postPx}
		class="post"
	/>
	<text
		class="label-fence"
		text-anchor="end"
		x={planX(NEW_FENCE.labelAt.x)}
		y={planY(NEW_FENCE.labelAt.y)}>Nytt staket</text
	>
	<text
		class="label-fence"
		text-anchor="end"
		x={planX(NEW_FENCE.labelAt.x)}
		y={planY(NEW_FENCE.labelAt.y) + 16}>1,5 m högt</text
	>

	<!-- mått -->
	{#each PLAN_DIMENSIONS as dim (dim.label)}
		{#if dim.orientation === 'horizontal'}
			{@const { y, x1, x2, textX, textY } = horizontalDimension(dim)}
			<g class="dim" class:muted={dim.muted}>
				<line {x1} y1={y} {x2} y2={y} />
				<line {x1} y1={y - 5} x2={x1} y2={y + 5} />
				<line x1={x2} y1={y - 5} {x2} y2={y + 5} />
				<text x={textX} y={textY} text-anchor="middle">{dim.label}</text>
			</g>
		{:else}
			{@const { x, y1, y2, textX, textY, rotate } = verticalDimension(dim)}
			<g class="dim" class:muted={dim.muted}>
				<line x1={x} {y1} x2={x} {y2} />
				<line x1={x - 5} {y1} x2={x + 5} y2={y1} />
				<line x1={x - 5} y1={y2} x2={x + 5} {y2} />
				<text x={textX} y={textY} text-anchor="middle" transform="rotate({rotate} {textX} {textY})"
					>{dim.label}</text
				>
			</g>
		{/if}
	{/each}
</svg>

<style>
	svg {
		width: 100%;
		height: auto;
		display: block;
		margin-top: 12px;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	}
	.tile-field {
		stroke: #b7bdb8;
		stroke-width: 1;
	}
	.wall {
		stroke: #5a3e1e;
		stroke-width: 6;
	}
	.wall-guide {
		stroke: #5a3e1e;
		stroke-width: 1.5;
		stroke-dasharray: 6 6;
	}
	.new-fence {
		stroke: #e39b2b;
	}
	.cladding {
		fill: #f0c98a;
		stroke: #c9832f;
		stroke-width: 1;
	}
	.post {
		fill: #a86d12;
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
	.bin-name {
		font-size: 10.5px;
		fill: #174d36;
	}
	.label {
		font-size: 12px;
		font-weight: 600;
	}
	.label-small {
		font-size: 11px;
		font-weight: 600;
	}
	.label-fence {
		font-size: 12px;
		font-weight: 600;
		fill: #a86d12;
	}
	.muted {
		fill: #5f6a65;
	}
	.ink {
		fill: #1e2a26;
	}
	.brown {
		fill: #5a3e1e;
	}
	.dim {
		stroke: #1e2a26;
		stroke-width: 1;
		font-size: 11px;
	}
	.dim text {
		stroke: none;
		fill: #1e2a26;
	}
	.dim.muted {
		opacity: 0.6;
	}
	.dim.muted text {
		font-size: 10px;
	}
</style>
