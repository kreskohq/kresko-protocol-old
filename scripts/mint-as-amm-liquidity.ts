import { abi as KreskoAbi } from '../build/contracts/Kresko.json'
import { e18 } from '../test/maths'
import { addresses, KAssets, kit } from './common'

const ASSET = KAssets.kETH

async function main() {
	const kresko = new kit.web3.eth.Contract(KreskoAbi as any, addresses.kresko)
	const amount = e18(625)
	console.log('Minting', amount.toString(), ASSET, 'as AMM liquidity')
	await kresko.methods
		.mintAsAMMLiquidity(addresses.kAssetAddresses[ASSET].kAsset, amount.toString())
		.send({ from: kit.defaultAccount })
	console.log('Minted!')
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e.message)
		process.exit(1)
	})
