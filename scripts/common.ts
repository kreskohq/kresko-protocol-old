import { newKit } from '@celo/contractkit'

export enum KAssets {
	kTSLA = 'kTSLA',
	kETH = 'kETH',
	kIAU = 'kIAU',
}

const kAssetAddresses: {
	[key in KAssets]: {
		kAsset: string;
		amm: string;
		reserve: string;
		oracle: string;
	}
} = {
	[KAssets.kTSLA]: {
		oracle: '0x56A95b65161a3ECe706754f553234d7cf89CD20e',
		amm: '0x6771EffcfFE138DAfd1960AE003E7F80e6E81959',
		reserve: '0x246B4EeF1d1A98D90083843BeBd1d2c13a9aDE6D',
		kAsset: '0xb864CBD5b4d9DfaB54C06A7Cf5947eB6153b2239'
	},
	[KAssets.kIAU]: {
    oracle: '0x168D354Ea55A440AdB8518c9631ce20DeF984ff0',
    amm: '0x409C1f376F028E2Da55cD2088D9080Fa2e58C2D7',
    reserve: '0xAf5e2AB5e1F2F655C78148B6d78418346E76846E',
    kAsset: '0xCC9C102Ee3066f27eAFfa4484633Bd4Fb5d2bC77'
  },
	[KAssets.kETH]: {
		oracle: '0xdD3f2818E113d953C04D1a56DCA7013C1C6e3767',
		amm: '0xC833e598E4c885750FEEdbdb967cd31E388fc4DD',
		reserve: '0x76d32363c64e144c57f3bf74f983349ce107a24f',
		kAsset: '0x811754723778eAa91da0196BAe677192B870b866'
	}
}

export const addresses = {
	kresko: '0x80B3e65b2dE63a912710Bf6ecA8E2E0AFAc9104F',
	stableToken: '0xAd31f467823951bedeaB81C67E669a88AfF6944D',
	kAssetAddresses
}

export const kit = newKit('https://alfajores-forno.celo-testnet.org')
const privateKey = process.env.PRIVATE_KEY
if (privateKey) {
	kit.addAccount(privateKey)
}
const [from] = kit.getWallet()!.getAccounts()
kit.defaultAccount = from

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}