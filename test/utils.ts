// Workaround to use ethers types in function parameters
import { ethers as ethersType } from 'ethers'
import {
	deployments,
	ethers
} from 'hardhat'
import { AMM } from '../typechain/AMM';
import { DecimalMath } from '../typechain/DecimalMath';
import { KAsset } from '../typechain/KAsset';
import { Kresko } from '../typechain/Kresko';
import { Reserve } from '../typechain/Reserve';

// export async function deployKresko(): Promise<Kresko> {
// 	// const decimalMath = await deployDecimalMath()

// 	// const KreskoContract = await ethers.getContractFactory('Kresko', {
// 	// 	libraries: {
// 	// 		DecimalMath: decimalMath.address
// 	// 	}
// 	// })
// 	// return KreskoContract.deploy() as Promise<Kresko>

// 	return deployments.fixture(['Kresko'])
// }]

export const setupKreskoWithKAsset = deployments.createFixture(async () => {
  await deployments.fixture('Kresko')
	return {
    kresko: <Kresko>await ethers.getContract('Kresko'),
  }
})

async function deployDecimalMath() {
	const DecimalMathContract = await ethers.getContractFactory('DecimalMath')
	return DecimalMathContract.deploy() as Promise<DecimalMath>
}

export async function deployKAssetAndFriends(
	kresko: ethersType.Contract,
	name: string,
	symbol: string
) {
	const KAssetConntract = await ethers.getContractFactory('KAsset')
	const kAsset = (await KAssetConntract.deploy(
		kresko.address,
		name,
		symbol
	)) as KAsset

	const AMMContract = await ethers.getContractFactory('AMM')
	const amm = (await AMMContract.deploy()) as AMM

	const ReserveContract = await ethers.getContractFactory('Reserve')
	const reserve = (await ReserveContract.deploy(
		kresko.address,
		amm.address
	)) as Reserve

	await amm.setReserve(reserve.address)

	return {
		kAsset,
		amm,
		reserve
	}
}