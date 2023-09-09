import { StargateClient } from '@cosmjs/stargate';
import type { LayoutLoad } from './$types';
import { HttpBatchClient, Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { QueryClient } from '@cosmjs/stargate';
import { setupWasmExtension } from '@cosmjs/cosmwasm-stargate';
import { PUBLIC_CHAIN_RPC } from '$env/static/public';
import { LAW_STONE_CODE_ID } from '$lib';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import { fromBase64, fromUtf8 } from '@cosmjs/encoding';
import { MsgExecuteContract, MsgInstantiateContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';

export const load = (async () => {
	const batchClient = new HttpBatchClient(PUBLIC_CHAIN_RPC);
	const tendermint = await Tendermint37Client.create(batchClient);

	const stargateClient = await StargateClient.create(tendermint);
	const queryClient = QueryClient.withExtensions(tendermint, setupWasmExtension);

	const { contracts } = await queryClient.wasm.listContractsByCodeId(LAW_STONE_CODE_ID);

	const contractsInfo = (
		await Promise.all(
			contracts.map(async (c) => {
				const { address, contractInfo } = await queryClient.wasm.getContractInfo(c);
				return {
					creator: contractInfo?.creator,
					address: address,
					height: contractInfo?.created?.blockHeight.toNumber(),
					index: contractInfo?.created?.txIndex.toNumber()
				};
			})
		)
	)
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		.sort((a, b) => b.height! - a.height!);

	// NOTE: transaction search can be extremely slow and render the queried node unresponsive
	const contractsInstantiationTransactionSearch = await stargateClient.searchTx(
		`instantiate.code_id=5`
	);
	const instantiations = contractsInstantiationTransactionSearch.map((tx) => {
		const decoded = decodeTxRaw(tx.tx);

		const messages = decoded.body.messages.map((m) => {
			const decoded = MsgInstantiateContract.decode(m.value);

			const decodedMsg = fromUtf8(decoded.msg);
			const msg: { program: string; storage_address: string } = JSON.parse(decodedMsg);

			try {
				let program = msg.program;

				// NOTE: Input needs to have a length divisible by 4 or base64 will fail, so we'll pad where we need to
				const missingChars = program.length % 4;
				if (missingChars > 0) {
					for (let index = 0; index < missingChars; index++) {
						program += '=';
					}
				}

				msg.program = fromUtf8(fromBase64(program));

				return msg;
			} catch (error) {
				console.error(`${decodedMsg} - ${msg.program}`);
				return msg;
			}
		});

		return {
			...messages[0],
			height: tx.height,
			index: tx.txIndex
		};
	});

	const getProgramFor = (height: number, _index: number) => {
		// NOTE: We're not actually using index as it is not the index in the block but rather the quantity of gas used prior to that tx
		return instantiations.find((i) => i.height === height /*&& i.index === index*/) ?? null;
	};

	const transactionSearch = await stargateClient.searchTx(`wasm.action='insert'`);
	const blocks = (
		await Promise.all(
			[...transactionSearch, ...instantiations].map(async (t) => {
				const block = await stargateClient.getBlock(t.height);
				return { [block.header.height]: new Date(block.header.time) };
			})
		)
	).reduce((p, c) => {
		return {
			...p,
			...c
		};
	});

	const transactions = transactionSearch
		.map((tx) => {
			const decoded = decodeTxRaw(tx.tx);

			const messages = decoded.body.messages.map((m) => {
				const decoded = MsgExecuteContract.decode(m.value);

				const msg: { insert_data: { format: string; data: string } } = JSON.parse(
					fromUtf8(decoded.msg)
				);

				msg.insert_data.data = fromUtf8(fromBase64(msg.insert_data.data));

				return {
					...decoded,
					msg
				};
			});

			return {
				height: tx.height,
				time: blocks[tx.height],
				hash: tx.hash,
				content: decoded,
				message: messages[0]
			};
		})
		.sort((a, b) => {
			return b.height - a.height;
		});

	return {
		stargateClient,
		queryClient,
		contracts: contractsInfo,
		transactions,
		getProgramFor,
		blocks
	};
}) satisfies LayoutLoad;
