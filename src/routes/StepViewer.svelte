<script lang="ts">
	import PlanDrawing from './PlanDrawing.svelte';
	import { STEPS } from './steps';

	let index = $state(0);
	const step = $derived(STEPS[index]);

	function go(to: number) {
		index = Math.max(0, Math.min(STEPS.length - 1, to));
	}

	/** Piltangenterna bläddrar var man än är på sidan, utom i textfält och med modifierare. */
	function onkeydown(event: KeyboardEvent) {
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
		if (event.target instanceof HTMLElement && event.target.matches('input, textarea, select'))
			return;
		if (event.key === 'ArrowRight') go(index + 1);
		else if (event.key === 'ArrowLeft') go(index - 1);
		else return;
		event.preventDefault();
	}
</script>

<svelte:window {onkeydown} />

<div class="viewer">
	<div class="head" role="toolbar" aria-label="Välj steg">
		<button
			type="button"
			aria-label="Föregående steg"
			onclick={() => go(index - 1)}
			disabled={index === 0}
		>
			<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10.5 2.5 5 8l5.5 5.5" /></svg>
		</button>
		<h3 class="stack">
			{#each STEPS as s, i (s.id)}
				<span class:shown={i === index}>{i + 1}. {s.title}</span>
			{/each}
		</h3>
		<span class="counter">Steg {index + 1} av {STEPS.length}</span>
		<button
			type="button"
			aria-label="Nästa steg"
			onclick={() => go(index + 1)}
			disabled={index === STEPS.length - 1}
		>
			<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 2.5 11 8l-5.5 5.5" /></svg>
		</button>
	</div>

	{#key step.id}
		<PlanDrawing
			layers={step.layers}
			annotations={step.annotations}
			label="Steg {index + 1}: {step.title}"
		/>
	{/key}

	<div class="stack">
		{#each STEPS as s, i (s.id)}
			<p class:shown={i === index}>{s.text}</p>
		{/each}
	</div>
</div>

<style>
	.viewer {
		max-width: var(--drawing-width);
	}
	.head {
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	.head h3 {
		margin: 0;
		min-width: 0;
	}
	.head h3 span {
		text-wrap: balance;
	}
	/*
	 * Alla steg läggs i samma rutnätscell, så höjden blir den högsta textens och
	 * sidan slutar hoppa när man bläddrar längst ner. Bara det aktiva steget syns;
	 * visibility: hidden håller de andra utanför både skärmläsare och tabbordning.
	 */
	.stack {
		display: grid;
	}
	.stack > * {
		grid-area: 1 / 1;
		visibility: hidden;
	}
	.stack > .shown {
		visibility: visible;
	}
	.counter {
		color: var(--muted);
		font-size: 0.8125rem;
		white-space: nowrap;
	}
	button {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--ink);
		cursor: pointer;
	}
	button svg {
		width: 1.125rem;
		height: 1.125rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	button:hover:not(:disabled),
	button:focus-visible {
		background: var(--rule);
	}
	button:disabled {
		color: var(--rule);
		cursor: default;
	}
	p {
		margin: 0.75rem 0 0;
		text-wrap: pretty;
	}
	@media print {
		/* Utskriften visar bara det aktiva steget, så reservera ingen extra höjd. */
		.stack > *:not(.shown) {
			display: none;
		}
	}
</style>
