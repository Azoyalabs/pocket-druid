<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addTableFilter } from 'svelte-headless-table/plugins';
	import { Input } from '$lib/components/ui/input/index';
	import TxInfoCell from './TxInfoCell.svelte';
	export let data;

	const table = createTable(readable(data.transactions), {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});
	const columns = table.createColumns([
		table.column({
			accessor: ({ message }) => ({ contract: message.contract, sender: message.sender }),
			header: 'Sender / Contract Address',
			cell: ({ value }) =>
				createRender(TxInfoCell, {
					contract: value.contract,
					sender: value.sender
				}),
			plugins: {
				filter: {
					getFilterValue: (v) => v.sender
				}
			}
		}),
		/*
		table.column({
			accessor: ({ message }) => message.sender,
			header: 'Sender'
		}),*/
		table.column({
			accessor: 'time',
			header: 'Date',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ message }) => message.msg.insert_data.data,
			header: 'Data',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ message }) => message.msg.insert_data.format ?? "Unknown",
			header: 'Data Format',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'hash',
			header: 'TxHash',

			plugins: {
				filter: {
					exclude: true
				}
			}
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { filterValue } = pluginStates.filter;
</script>

<section>
	<h1 class="text-3xl font-bold">Ontology</h1>
	<p class="mt-1 text-sm text-muted-foreground">Take a look at all the ontology data submitted</p>
</section>

<div class="mt-6">
	<div class="flex items-center py-4">
		<Input
			class="max-w-sm"
			placeholder="Filter by sender address..."
			type="text"
			bind:value={$filterValue}
		/>
	</div>
	<div class="border rounded-md">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>
<!-- 
<div class="mt-6">
	<ul class="gap-3">
		{#each data.transactions as tx (tx.hash)}
			{@const content = Object.entries(tx.content)}
			<li>
				{tx.hash} - {tx.time}
				<div>
					{#each tx.messages as m}
						{JSON.stringify(m)}
					{/each}
				</div>
			</li>
		{/each}
	</ul>
</div>
-->
