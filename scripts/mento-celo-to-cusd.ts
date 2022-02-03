import { e18 } from '../test/maths'
import { kit } from './common'
import Web3 from 'web3'

async function main() {
	const amount = e18(6).toString()
	const exchange = await kit.contracts.getExchange()
	const celo = await kit.contracts.getGoldToken()

	console.log(
		'Current CELO balance',
		Web3.utils.fromWei((await celo.balanceOf(kit.defaultAccount!)).toFixed().toString())
	)

	console.log('Approving', Web3.utils.fromWei(amount), 'CELO to Exchange...')
	await celo.approve(exchange.address, amount).sendAndWaitForReceipt({ from: kit.defaultAccount })
	console.log('Approved!')

	console.log('Exchanging...')
	const tx = exchange.sell(amount, 0, true)
	await tx.sendAndWaitForReceipt()
	console.log('Exchanged!')
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.log(e.message)
		process.exit(1)
	})
