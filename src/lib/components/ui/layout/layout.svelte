<script lang="ts">
	import { Button } from '../button';
	import Separator from '../separator/separator.svelte';

	export let pathname: string;

	export let links: { title: string; href: string }[];
</script>

<header>
	<slot name="header" />
</header>
<Separator />
<div class="flex flex-col px-4 lg:flex-row lg:space-x-12 lg:space-y-0 max-w-[100vw] lg:max-w-screen-2xl mx-auto">
	<aside class="flex-shrink-0 py-4 lg:w-1/5 lg:border-r">
		<nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
			{#each links as link}
				<Button
					href={link.href}
					variant="ghost"
					class="{pathname === link.href
						? 'bg-muted hover:bg-muted'
						: 'hover:bg-transparent hover:underline'} justify-start"
				>
					{link.title}
				</Button>
			{/each}
		</nav>
	</aside>

	<div class="relative flex flex-col flex-1 flex-grow min-h-screen py-4 lg:w-4/5 ">
		<slot />
	</div>
</div>
