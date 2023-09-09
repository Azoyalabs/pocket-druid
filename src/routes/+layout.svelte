<script lang="ts">
	import { navigating, page } from '$app/stores';
	import Layout from '$lib/components/ui/layout/layout.svelte';
	import '../app.postcss';
	import { browser } from '$app/environment';
	import WalletButton from '$lib/components/ui/WalletButton/WalletButton.svelte';
	import { NATIVE_BALANCE, USER_ADDRESS } from '$lib/state';
	import { Toaster } from 'svelte-french-toast';
	import Spinner from '$lib/components/ui/spinner/Spinner.svelte';
	import Keplr from '$lib/components/ui/logos/Keplr.svelte';
	import { PUBLIC_DECIMALS } from '$env/static/public';
	import { recommendNetwork } from '$lib/network/config';
	import { numberFormatter } from '$lib/utils';
	import { Github } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	const links = [
		{
			title: 'Rules',
			href: '/'
		},
		{
			title: 'Ontology',
			href: '/ontology'
		},
		{
			title: 'Law Stone',
			href: '/law-stone'
		},
		{
			title: 'RDF',
			href: '/rdf'
		}
	];

	$: pathName = browser ? $page.url.pathname : '';
</script>

<Toaster />
<Layout {links} pathname={pathName}>
	<div slot="header" class="flex justify-between w-full px-4 py-4 mx-auto max-w-screen-2xl">
		<div class="flex items-center">
			<img
				src="/img/okp4.png"
				alt="okp4 logo"
				height="36"
				width="36"
				class="mr-2 border rounded-lg"
			/>
			<span class="font-medium">Pocket Druid</span>
		</div>

		{#if $USER_ADDRESS && $NATIVE_BALANCE}
			{@const displayedAddress = `${$USER_ADDRESS.slice(0, 6)}...${$USER_ADDRESS.slice(
				$USER_ADDRESS.length - 6
			)}`}
			<div class="flex items-center px-2 py-1 space-x-3 border rounded-md">
				<div class="w-9 h-9">
					<Keplr />
				</div>
				<div class="text-sm text-right">
					<div class="text-sm font-semibold tracking-wide">
						{displayedAddress}
					</div>
					<div class="text-xs mt-0.5">
						{numberFormatter(parseInt($NATIVE_BALANCE.amount) * Math.pow(10, -PUBLIC_DECIMALS))}
						<span class="tracking-wide">{recommendNetwork.currencies[0].coinDenom}</span>
					</div>
				</div>
			</div>
		{:else}
			<WalletButton />
		{/if}
	</div>

	<div class="flex-grow">
		{#if $navigating}
			<div class="flex flex-col items-center justify-center h-full">
				<Spinner />
			</div>
		{:else}
			<slot />
		{/if}
	</div>
</Layout>
<footer class="flex items-center justify-center px-4 py-4 border-t">
	<Button href="https://github.com/Azoyalabs/pocket-druid" class="rounded-full" variant="ghost">
		<Github />
	</Button>
</footer>
