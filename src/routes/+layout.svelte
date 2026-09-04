<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(:root) {
		--ink: #1e2a26;
		--muted: #5f6a65;
		--rule: #d9ddd9;
		--paper: #fcfcfa;
		--accent: #2b8a62;
	}
	:global(*) {
		box-sizing: border-box;
	}
	:global(html) {
		background: var(--paper);
	}
	:global(body) {
		margin: 0;
		color: var(--ink);
		font-family: 'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', sans-serif;
		font-size: 0.9375rem;
		line-height: 1.5;
		font-variant-numeric: tabular-nums;
	}
	@media print {
		:global(body) {
			font-size: 0.75rem;
		}
	}
</style>
