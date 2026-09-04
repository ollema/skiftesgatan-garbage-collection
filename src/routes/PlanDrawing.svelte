<script lang="ts">
	import { BIN_SIZES, BINS } from './bins';
	import { FENCE, GAP, GATE, POSTS, TILE_PITCH } from './dimensions';
	import {
		ASPHALT,
		EXISTING_FENCE,
		NEW_FENCE,
		PLAN_DIMENSIONS,
		PLAN_SCALE,
		PLAN_VIEWBOX,
		planX,
		planY,
		SHED,
		SHED_FRONT_GUIDE,
		SHED_LABEL_AT,
		STRIP_CORNER_GUIDE,
		TILE_FIELDS,
		type Dimension
	} from './plan-view';

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
	style="max-width: {PLAN_VIEWBOX.width}px"
	xmlns="http://www.w3.org/2000/svg"
	role="img"
	aria-label="Plan över inhägnaden"
>
	<defs>
		<pattern
			id="tile"
			x={planX(0)}
			y={planY(0)}
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
	</defs>

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

	<!-- cykelskjul: tak i ljus ton, väggar i mörkbrunt, öppen framsida -->
	<rect
		x={planX(SHED.x)}
		y={planY(SHED.y)}
		width={SHED.width * PLAN_SCALE}
		height={SHED.depth * PLAN_SCALE}
		fill="#efe3d3"
	/>
	<line x1={planX(-0.03)} y1={planY(0)} x2={planX(-0.03)} y2={planY(SHED.depth)} class="wall" />
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
	<text
		class="label-small brown"
		x={planX(EXISTING_FENCE.labelAt.x)}
		y={planY(EXISTING_FENCE.labelAt.y)}>Befintligt staket</text
	>

	<!-- kärl -->
	{#each BINS as bin (bin.x)}
		{@const size = BIN_SIZES[bin.size]}
		{@const x = planX(bin.x)}
		{@const y = planY(GAP)}
		{@const w = size.width * PLAN_SCALE}
		{@const h = size.depth * PLAN_SCALE}
		<g>
			<rect {x} {y} width={w} height={h} rx="5" class="bin" />
			<line x1={x + 4} y1={y + 4} x2={x + w - 4} y2={y + 4} class="bin-highlight" />
			{#each size.wheels as [wx, wy], i (i)}
				<circle cx={x + wx * w} cy={y + wy * h} r="3" class="bin-wheel" />
			{/each}
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

	<!-- nytt staket och stolpar -->
	<line
		x1={planX(NEW_FENCE.east.x)}
		y1={planY(NEW_FENCE.east.y1)}
		x2={planX(NEW_FENCE.east.x)}
		y2={planY(NEW_FENCE.east.y2)}
		class="new-fence"
	/>
	<line
		x1={planX(NEW_FENCE.south.x1)}
		y1={planY(NEW_FENCE.south.y)}
		x2={planX(NEW_FENCE.south.x2)}
		y2={planY(NEW_FENCE.south.y)}
		class="new-fence"
	/>
	{#each POSTS as post (post.x + ',' + post.y)}
		<rect x={planX(post.x) - 5} y={planY(post.y) - 5} width="10" height="10" class="post" />
	{/each}
	<rect
		x={planX(FENCE.anchor.x) - 6}
		y={planY(FENCE.anchor.y) - 4}
		width="12"
		height="8"
		class="fence-anchor"
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

	<!-- grind hängd på skjulets vägg, slår inåt och fälls mot väggen -->
	<path
		d="M{planX(GATE.closedEnd.x)} {planY(GATE.closedEnd.y)} A{GATE.leafWidth *
			PLAN_SCALE} {GATE.leafWidth * PLAN_SCALE} 0 0 0 {planX(GATE.openEnd.x)} {planY(
			GATE.openEnd.y
		)}"
		fill="none"
		class="gate-sweep"
	/>
	<line
		x1={planX(GATE.hinge.x)}
		y1={planY(GATE.hinge.y)}
		x2={planX(GATE.openEnd.x)}
		y2={planY(GATE.openEnd.y)}
		class="gate-leaf"
	/>
	<circle cx={planX(GATE.hinge.x)} cy={planY(GATE.hinge.y)} r="5" class="gate-hinge" />

	<!-- mått -->
	{#each PLAN_DIMENSIONS as dim (dim.label)}
		{#if dim.orientation === 'horizontal'}
			{@const { y, x1, x2, textX, textY } = horizontalDimension(dim)}
			<g class="dim">
				<line {x1} y1={y} {x2} y2={y} />
				<line {x1} y1={y - 5} x2={x1} y2={y + 5} />
				<line x1={x2} y1={y - 5} {x2} y2={y + 5} />
				<text x={textX} y={textY} text-anchor="middle">{dim.label}</text>
			</g>
		{:else}
			{@const { x, y1, y2, textX, textY, rotate } = verticalDimension(dim)}
			<g class="dim">
				<line x1={x} {y1} x2={x} {y2} />
				<line x1={x - 5} {y1} x2={x + 5} y2={y1} />
				<line x1={x - 5} y1={y2} x2={x + 5} {y2} />
				<text x={textX} y={textY} text-anchor="middle" transform="rotate({rotate} {textX} {textY})"
					>{dim.label}</text
				>
			</g>
		{/if}
	{/each}
	<line
		x1={planX(STRIP_CORNER_GUIDE.x1)}
		y1={planY(STRIP_CORNER_GUIDE.y1)}
		x2={planX(STRIP_CORNER_GUIDE.x2)}
		y2={planY(STRIP_CORNER_GUIDE.y2)}
		class="alignment-guide"
	/>
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
	.alignment-guide {
		stroke: #b7bdb8;
		stroke-width: 1;
		stroke-dasharray: 2 3;
	}
	.new-fence {
		stroke: #e39b2b;
		stroke-width: 7;
	}
	.post {
		fill: #a86d12;
	}
	.fence-anchor {
		fill: none;
		stroke: #a86d12;
		stroke-width: 2;
	}
	.gate-sweep {
		stroke: #e39b2b;
		stroke-width: 1;
		stroke-dasharray: 3 3;
	}
	.gate-leaf {
		stroke: #e39b2b;
		stroke-width: 4;
	}
	.gate-hinge {
		fill: #a86d12;
	}
	.bin {
		fill: #cfebdc;
		stroke: #2b8a62;
		stroke-width: 2;
	}
	.bin-highlight {
		stroke: #2b8a62;
		stroke-width: 3;
	}
	.bin-wheel {
		fill: #2b8a62;
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
</style>
