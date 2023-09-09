export const OBJECTARIUM_CODE_ID = 4;
export const LAW_STONE_CODE_ID = 5;
export const COGNITARIUM_CODE_ID = 6;


export const HACKATHON_LABEL = `Nemeton-Dagda3-https://github.com/Azoyalabs/pocket-druid`;
export const HACKATHON_MEMO = `Nemeton-Dagda3-https://github.com/Azoyalabs/pocket-druid`;

export const DEFAULT_COGNITARIUM_INSTANTATION_MESSAGE = {
	limits: {
		max_triple_count: '1000000',
		max_byte_size: '1000000000',
		max_triple_byte_size: '999999',
		max_query_limit: 30,
		max_query_variable_count: 30,
		max_insert_data_byte_size: '99999900',
		max_insert_data_triple_count: '10000'
	}
};

export const EXTERNAL_LINKS = {
	EXPLORER: {
		TX: (hash: string) => `https://testnet.ping.pub/OKP4%20testnet/tx/${hash}`,
		CONTRACT: (code: number, address: string) =>
			`https://testnet.ping.pub/OKP4%20testnet/cosmwasm/${code}/transactions?contract=${address}`
	}
};
