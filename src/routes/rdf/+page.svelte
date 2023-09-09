<script lang="ts">
	import {
		COGNITARIUM_CODE_ID,
		DEFAULT_COGNITARIUM_INSTANTATION_MESSAGE,
		EXTERNAL_LINKS,
		HACKATHON_LABEL,
		HACKATHON_MEMO,
		OBJECTARIUM_CODE_ID
	} from '$lib';
	import { Walletguard } from '$lib/components/ui/authguard';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { SIGNING_CLIENT, USER_ADDRESS } from '$lib/state.js';
	import { derived } from 'svelte/store';
	import toast from 'svelte-french-toast';
	import Button from '$lib/components/ui/button/button.svelte';
	import Spinner from '$lib/components/ui/spinner/Spinner.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { fromUtf8, toBase64, toUtf8 } from '@cosmjs/encoding';

	/**
	 * TODO:
	 * check if user has deployed a cognitarium smart contract
	 *
	 */
	export let data;

	async function getCognitariumInstancesFor(address: string): Promise<{ address: string }[]> {
		const { contractAddresses } = await data.queryClient.wasm.listContractsByCreator(address);
		const cognitariumInstances = (
			await Promise.all(
				contractAddresses.map(async (address) => {
					const contractInfoQuery = await data.queryClient.wasm.getContractInfo(address);
					const contractInfo = contractInfoQuery.contractInfo!;

					return {
						address,
						id: contractInfo.codeId.toInt()
					};
				})
			)
		).filter((c) => c.id === COGNITARIUM_CODE_ID);
		return cognitariumInstances;
	}

	const deployedCognitariumContracts = derived(USER_ADDRESS, ($address) => {
		if ($address) {
			return getCognitariumInstancesFor($address);
		} else {
			return null;
		}
	});

	async function instantiateCognitariumContract() {
		const instantiation = $SIGNING_CLIENT!.instantiate(
			$USER_ADDRESS!,
			COGNITARIUM_CODE_ID,
			DEFAULT_COGNITARIUM_INSTANTATION_MESSAGE,
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

	async function insertDataIntoContract() {
		const data = toBase64(toUtf8(rbfContent));
		console.log(
			data ===
				'PGh0dHBzOi8vb250b2xvZ3kub2twNC5zcGFjZS9kYXRhdmVyc2Uvc2VydmljZS9TM2Nvbm5lY3Rvcj4gPGh0dHBzOi8vb250b2xvZ3kub2twNC5zcGFjZS9kYXRhdmVyc2Uvc2VydmljZS9TM2Nvbm5lY3Rvci9zdGF0dXM+ICdzdWNjZXNzJyAu'
		);
		const msg = {
			insert_data: {
				data
				//: 'PGh0dHBzOi8vb250b2xvZ3kub2twNC5zcGFjZS9kYXRhdmVyc2Uvc2VydmljZS9TM2Nvbm5lY3Rvcj4gPGh0dHBzOi8vb250b2xvZ3kub2twNC5zcGFjZS9kYXRhdmVyc2Uvc2VydmljZS9TM2Nvbm5lY3Rvci9zdGF0dXM+ICdzdWNjZXNzJyAu'
			}
		};
		const execute = $SIGNING_CLIENT!.execute(
			$USER_ADDRESS!,
			selectedContract!.value,
			msg,
			'auto',
			HACKATHON_MEMO
		);

		toast.promise(execute, {
			loading: 'Sending Transaction...',
			success: (val) => {
				return `Transaction hash: ${val.transactionHash}`;
			},
			error: (err) => {
				return `Something went wrong.\n ${err}`;
			}
		});
	}
	// <https://ontology.okp4.space/dataverse/service/S3connector> <https://ontology.okp4.space/dataverse/service/S3connector/status> 'success' .
	let rbfContent: string = '';

	let selectedContract: { value: string } | undefined = undefined;
</script>

<section>
	<h1 class="text-3xl font-bold">RDF</h1>
	<p class="mt-1 text-sm text-muted-foreground">
		Insert RDF data straight into an instantiated Cognitarium contract, straight from the browser
	</p>
</section>

<div class="mt-6">
	<Walletguard address={$USER_ADDRESS}>
		<div slot="auth">
			{#if $deployedCognitariumContracts}
				{#await $deployedCognitariumContracts}
					<div>
						<Spinner />
					</div>
				{:then resolved}
					{#if resolved.length > 0}
						<form
							on:submit|preventDefault={insertDataIntoContract}
							class="p-4 space-y-6 border rounded-md"
						>
							<div>
								<Label class="block mb-2">Select an instantiated Cognitarium contract</Label>
								<Select.Root bind:selected={selectedContract}>
									<Select.Trigger class="">
										<Select.Value placeholder={'Select a deployed contract'} />
									</Select.Trigger>
									<Select.Content>
										{#each resolved as allowed (allowed)}
											<Select.Item value={allowed.address}>{allowed.address}</Select.Item>
										{/each}
									</Select.Content>
									<Select.Input name="selected-contract" bind:value={selectedContract} />
								</Select.Root>
							</div>

							<div>
								<Label class="block mb-2">RBF data to insert</Label>
								<Textarea placeholder="Type your RBF data here." bind:value={rbfContent} />
							</div>

							<div class="flex items-end justify-end">
								<Button
									type="submit"
									disabled={(selectedContract && selectedContract.value === null) ||
										rbfContent.length === 0}>Insert data</Button
								>
							</div>
						</form>
					{:else}
						<div class="h-[200px] border rounded-md flex flex-col justify-center items-center">
							Instantiate an Objectarium Smart Contract

							<Button class="mt-2" on:click={instantiateCognitariumContract}
								>Instantiate contract</Button
							>
						</div>
					{/if}
				{/await}
			{/if}
		</div>
		{selectedContract}
	</Walletguard>
</div>
