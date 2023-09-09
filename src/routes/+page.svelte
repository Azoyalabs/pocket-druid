<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';

	export let data;
	// import * as Card from "$lib/components/"

	import hljs from 'highlight.js/lib/core';
	import prolog from 'highlight.js/lib/languages/prolog';
	import 'highlight.js/styles/atom-one-light.css';

	hljs.registerLanguage('prolog', prolog);

	$: contracts = data.contracts.filter((c) => c.creator?.includes(creatorInput));
	let creatorInput = '';
</script>

<section>
	<h1 class="text-3xl font-bold">Submited Rules</h1>
	<p class="mt-1 text-sm text-muted-foreground">All rules submitted to the network</p>
</section>

<div class="mt-6">
	<div class="flex items-center py-4">
		<Input
			class="max-w-sm"
			placeholder="Filter by creator address..."
			type="text"
			bind:value={creatorInput}
		/>
	</div>
	{#if contracts.length > 0}
		<ul class="space-y-3">
			{#each contracts as contract (contract.address)}
				<Card.Root>
					<Card.Header>
						<Card.Title class="break-all">{contract.address}</Card.Title>
						<Card.Description class="break-all">
							<span class="text-xs">Instantiated by</span>
							{contract.creator}
							- {data.blocks[contract.height].toUTCString()}
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="text-xs font-semibold uppercase text-muted-foreground">
							Contained Program
						</div>
						<pre class="p-2 mt-1 overflow-x-auto whitespace-pre-line border rounded-md">
						<!-- {data.getProgramFor(contract.height, contract.index)?.program} -->
						{@html hljs.highlight(data.getProgramFor(contract.height, contract.index)?.program, {
								language: 'prolog'
							}).value}
					</pre>
					</Card.Content>
				</Card.Root>
			{/each}
		</ul>
	{:else}
		<div>No rule found</div>
	{/if}
</div>
