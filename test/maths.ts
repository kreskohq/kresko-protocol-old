import { BigNumber } from 'ethers'

export function expand(n: number) {
	return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
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
