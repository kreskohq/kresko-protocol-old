import ERC20Harness from '../build/contracts/ERC20Harness.json'
import { abi as KreskoAbi } from '../build/contracts/Kresko.json'
import { e18 } from '../test/maths'
import { addresses, KAssets, kit, sleep } from './common'
import Web3 from 'web3'

const ASSET = KAssets.kETH

async function main() {
	console.log('Adding collateral for', ASSET)
	const amount = e18(5_000_000).toString()
	const kresko = new kit.web3.eth.Contract(KreskoAbi as any, addresses.kresko)
	let cUSD = new kit.web3.eth.Contract(ERC20Harness.abi as any, addresses.stableToken)

	console.log(
		'Current cUSD balance',
		Web3.utils.fromWei((await cUSD.methods.balanceOf(kit.defaultAccount!).call()).toString())
	)

	console.log('Approving', Web3.utils.fromWei(amount), 'cUSD...')
	await cUSD.methods.approve(addresses.kresko, amount).send({ from: kit.defaultAccount })
	await sleep(6000)
	console.log('Approved!')

	console.log('Depositing collateral...')
	await kresko.methods.depositCollateral(addresses.kAssetAddresses[ASSET].kAsset, amount).send({ from: kit.defaultAccount })
	await sleep(6000)
	console.log('Deposited!')
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e.message)
		process.exit(1)
	})
