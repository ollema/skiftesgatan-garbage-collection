<script lang="ts">
	import { SECTION_LAYERS, SECTION_TOTAL_DEPTH_CM } from './math';

	const SCALE = 6; // px per cm
	const VIEWBOX_WIDTH = 720;
	const X0 = 130;
	const LAYER_WIDTH = 250;
	const TOP = 30;
	const SOIL_DISPLAY_CM = 14; // illustrativt djup för "fast mark", ingen uppmätt siffra
	const LABEL_X = X0 + LAYER_WIDTH + 12;
	const HATCH_LINES = [0, 1, 2, 3, 4, 5, 6];

	const LAYER_FILL = {
		platta: '#d9dcd8',
		stenmjol: '#efe8d6',
		barlager: 'url(#stone)'
	} as const;
	const LAYER_STROKE = {
		platta: '#9aa19c',
		stenmjol: '#c9b98f',
		barlager: '#8d928c'
	} as const;

	let cursor = TOP;
	const layers = SECTION_LAYERS.map((layer) => {
		const top = cursor;
		const height = layer.heightCm * SCALE;
		cursor += height;
		return { ...layer, top, height };
	});
	const layersBottom = cursor;
	const soilTop = layersBottom + 2;
	const soilHeight = SOIL_DISPLAY_CM * SCALE;
	const viewBoxHeight = TOP + SECTION_TOTAL_DEPTH_CM * SCALE + 12 + soilHeight + 30;
</script>

<svg
	viewBox="0 0 {VIEWBOX_WIDTH} {viewBoxHeight}"
	style="max-width: {VIEWBOX_WIDTH}px"
	xmlns="http://www.w3.org/2000/svg"
	role="img"
	aria-label="Snitt genom plattytan"
>
	<defs>
		<pattern id="stone" width="12" height="12" patternUnits="userSpaceOnUse">
			<rect width="12" height="12" fill="#c7c9c3" />
			<circle cx="3" cy="4" r="2" fill="#a8aca5" />
			<circle cx="9" cy="9" r="2.5" fill="#a8aca5" />
		</pattern>
		<pattern id="soil" width="10" height="10" patternUnits="userSpaceOnUse">
			<rect width="10" height="10" fill="#e6dccb" />
			<circle cx="5" cy="5" r="1" fill="#c2b08f" />
		</pattern>
	</defs>

	<text class="small muted" x={LABEL_X} y={TOP - 12}>Färdig plattyta, i nivå med marken runtom</text
	>

	{#each layers as layer (layer.kind)}
		<rect
			x={X0}
			y={layer.top}
			width={LAYER_WIDTH}
			height={layer.height}
			fill={LAYER_FILL[layer.kind]}
			stroke={LAYER_STROKE[layer.kind]}
		/>
		{#if layer.kind === 'platta'}
			{#each HATCH_LINES as i (i)}
				<line
					x1={X0 + ((i + 1) * LAYER_WIDTH) / 8}
					y1={layer.top}
					x2={X0 + ((i + 1) * LAYER_WIDTH) / 8}
					y2={layer.top + layer.height}
					class="hatch"
				/>
			{/each}
		{/if}
		<text x={LABEL_X} y={layer.top + layer.height / 2 + 4}>{layer.name}</text>
		<g class="tick">
			<line x1={X0 - 14} y1={layer.top} x2={X0 - 14} y2={layer.top + layer.height} />
			<line x1={X0 - 19} y1={layer.top} x2={X0 - 9} y2={layer.top} />
			<line x1={X0 - 19} y1={layer.top + layer.height} x2={X0 - 9} y2={layer.top + layer.height} />
		</g>
		<text class="small" text-anchor="end" x={X0 - 24} y={layer.top + layer.height / 2 + 4}
			>{layer.heightCm} cm</text
		>
	{/each}

	<line x1={X0} y1={layersBottom} x2={X0 + LAYER_WIDTH} y2={layersBottom} class="ground-line" />
	<text x={LABEL_X} y={layersBottom + 4}>Fiberduk</text>

	<rect
		x={X0}
		y={soilTop}
		width={LAYER_WIDTH}
		height={soilHeight}
		fill="url(#soil)"
		stroke="#c2b08f"
	/>
	<text x={LABEL_X} y={soilTop + soilHeight / 2}>Fast mark (under matjorden)</text>
	<text class="small muted" x={LABEL_X} y={soilTop + soilHeight / 2 + 16}
		>Är matjorden djupare, fyll med mer bärlager</text
	>

	<g class="tick">
		<line x1={X0 - 70} y1={TOP} x2={X0 - 70} y2={layersBottom} />
		<line x1={X0 - 75} y1={TOP} x2={X0 - 65} y2={TOP} />
		<line x1={X0 - 75} y1={layersBottom} x2={X0 - 65} y2={layersBottom} />
	</g>
	<text
		class="small"
		text-anchor="middle"
		x={X0 - 76}
		y={(TOP + layersBottom) / 2}
		transform="rotate(-90 {X0 - 76} {(TOP + layersBottom) / 2})"
		>Gräv minst {SECTION_TOTAL_DEPTH_CM} cm</text
	>
</svg>

<style>
	svg {
		width: 100%;
		height: auto;
		display: block;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	}
	text {
		font-size: 12px;
		fill: #1e2a26;
	}
	text.small {
		font-size: 11px;
	}
	text.muted {
		fill: #5f6a65;
	}
	.hatch {
		stroke: #9aa19c;
		stroke-width: 1;
	}
	.tick {
		stroke: #1e2a26;
		stroke-width: 1;
	}
	.ground-line {
		stroke: #1e2a26;
		stroke-width: 2.5;
	}
</style>
