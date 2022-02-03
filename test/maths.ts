import { BigNumber } from 'ethers'

export function e18(n: number) {
	// to allow n to have decimals, multiply by 100 and then divide by 100
	return BigNumber.from(10).pow(18).mul(n * 100).div(100)
}

export function sqrt(x: BigNumber) {
	const ONE = BigNumber.from(1)
	const TWO = BigNumber.from(2)
	let z = x.add(ONE).div(TWO)
	let y = x
	while (z.sub(y).isNegative()) {
		y = z
		z = x.div(z).add(z).div(TWO)
	}
	return y
}
