<script lang="ts">
	import type { Hst } from '@histoire/plugin-svelte';
	import Layout from './layout.svelte';
	export let Hst: Hst;


	const pathname = '';
	const links = [
		{ href: '', title: 'Title' },
		{ href: '/2', title: 'Title 2' },
		{ href: '/3', title: 'Title 3' }
	];
</script>

<Hst.Story title="Layout">
	<Layout {links} {pathname}>
		<div>
			<h3 class="text-lg font-medium">Lorem Ipsum</h3>
			<p class="text-sm text-muted-foreground">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pharetra nunc nec rhoncus
				commodo. Cras ac turpis viverra, gravida justo pharetra, fermentum ipsum. In eget luctus
				odio.
			</p>
		</div>
	</Layout>
</Hst.Story>
