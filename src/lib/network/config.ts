export const recommendNetwork = {
	chainId: 'okp4-nemeton-1',
	chainName: 'OKP4 nemeton',
	rpc: 'https://api.testnet.okp4.network:443/rpc',
	rest: 'https://api.testnet.okp4.network',
	bip44: {
		coinType: 118
	},
	bech32Config: {
		bech32PrefixAccAddr: 'okp4',
		bech32PrefixAccPub: 'okp4pub',
		bech32PrefixValAddr: 'okp4valoper',
		bech32PrefixValPub: 'okp4valoperpub',
		bech32PrefixConsAddr: 'okp4valcons',
		bech32PrefixConsPub: 'okp4valconspub'
	},
	currencies: [
		{
			coinDenom: 'KNOW',
			coinMinimalDenom: 'uknow',
			coinDecimals: 6
		}
	],
	feeCurrencies: [
		{
			coinDenom: 'KNOW',
			coinMinimalDenom: 'uknow',
			coinDecimals: 6,
			gasPriceStep: {
				low: 0.01,
				average: 0.025,
				high: 0.03
			}
		}
	],
	stakeCurrency: {
		coinDenom: 'KNOW',
		coinMinimalDenom: 'uknow',
		coinDecimals: 6
	},
	beta: true
};
