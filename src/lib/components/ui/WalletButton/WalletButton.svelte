<script lang="ts">
	import { WalletIcon } from 'lucide-svelte';
	import { Button } from '../button';
	import { cn } from '$lib/utils';
	import { connectKeplr } from '$lib/state';

	let className: string | undefined = undefined;
	export { className as class };
</script>

<Button class={cn(className)} on:click={() => connectKeplr(window.keplr)}>
	<WalletIcon size={14} class="mr-2" /> Connect to Keplr
</Button>
