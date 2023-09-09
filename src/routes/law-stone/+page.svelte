<script lang="ts">
	import { HACKATHON_LABEL, HACKATHON_MEMO, LAW_STONE_CODE_ID } from '$lib';
	import { Walletguard } from '$lib/components/ui/authguard';
	import { Button } from '$lib/components/ui/button';
	import { Input, FileInput } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { SIGNING_CLIENT, USER_ADDRESS } from '$lib/state';
	import { toBase64 } from '@cosmjs/encoding';
	import toast from 'svelte-french-toast';

	let files: FileList | null = null;
	let encodedProgram: string | null = null;

	let storage: string = 'okp41lppz4x9dtmccek2m6cezjlwwzup6pdqrkvxjpk95806c3dewgrfq602kgx';

	$: (async () => {
		if (files && files.length > 0) {
			const content = await files.item(0)!.arrayBuffer();
			encodedProgram = toBase64(new Uint8Array(content));
		} else {
			encodedProgram = null;
		}
	})();

	async function instantiateLawStoneContract() {
		const msg = {
			program: encodedProgram,
			storage_address: storage
		};

		const instantiation = $SIGNING_CLIENT!.instantiate(
			$USER_ADDRESS!,
			LAW_STONE_CODE_ID,
			msg,
			HACKATHON_LABEL,
			'auto',
			{
				memo: HACKATHON_MEMO
			}
		);


		toast.promise(instantiation, {
			loading: 'Sending Transaction...',
			success: (val) => {
				return `Instantiated at ${val.contractAddress}`;
			},
			error: (err) => {
				return `Something went wrong.\n ${err}`;
			}
		});
	}
</script>

<section>
	<h1 class="text-3xl font-bold">Law Stone</h1>
	<p class="mt-1 text-sm text-muted-foreground">Instantiate a Law Stone from a Prolog file</p>
</section>

<div class="mt-6">
	<Walletguard address={$USER_ADDRESS}>
		<form
			on:submit|preventDefault={instantiateLawStoneContract}
			slot="auth"
			class="p-4 space-y-6 border rounded-md"
		>
			<div class="flex flex-col w-full gap-1.5">
				<Label for="file">File</Label>
				<FileInput
					id="file"
					bind:files
					type="file"
					class="max-w-xl mt-1"
					multiple={false}
					accept=".pl"
				/>
				<p class="text-sm text-muted-foreground">Select a Prolog file</p>
			</div>

			<div>
				<Label for="storage">Storage Address (Objectarium instance)</Label>
				<Input
					class="mt-1"
					type="text"
					bind:value={storage}
					placeholder={'Objectarium contract address'}
				/>
			</div>

			<div class="flex items-end justify-end">
				<Button type="submit" disabled={storage === '' || encodedProgram === null}
					>Instantiate law stone</Button
				>
			</div>
		</form>
	</Walletguard>
</div>
