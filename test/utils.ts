// Workaround to use ethers types in function parameters
import { ethers as ethersType } from 'ethers'
import {
	ethers
} from 'hardhat'
import { AMM } from '../typechain/AMM';
import { DecimalMath } from '../typechain/DecimalMath';
import { ERC20Harness } from '../typechain/ERC20Harness';
import { KAsset } from '../typechain/KAsset';
import { Kresko } from '../typechain/Kresko';
import { Reserve } from '../typechain/Reserve';

export async function deployKresko(stableToken: ethersType.Contract): Promise<Kresko> {
	const decimalMath = await deployDecimalMath()
	const KreskoContract = await ethers.getContractFactory('Kresko', {
		libraries: {
			// CeloRegistry: celoRegistry.address,
			DecimalMath: decimalMath.address
		}
	})
	return KreskoContract.deploy(
		stableToken.address
	) as Promise<Kresko>
}

async function deployDecimalMath() {
	const DecimalMathContract = await ethers.getContractFactory('DecimalMath')
	return DecimalMathContract.deploy() as Promise<DecimalMath>
}

async function deployCeloRegistry() {
	const CeloRegistryContract = await ethers.getContractFactory('CeloRegistry')
	return CeloRegistryContract.deploy()
}

export async function deployKAssetAndFriends(
	stableToken: ethersType.Contract,
	kresko: ethersType.Contract,
	name: string,
	symbol: string
) {
	const basicOracle = await deployBasicOracle()
	
	const KAssetContract = await ethers.getContractFactory('KAsset')
	const kAsset = (await KAssetContract.deploy(
		kresko.address,
		name,
		symbol
	)) as KAsset

	const AMMContract = await ethers.getContractFactory('AMM')
	const amm = (await AMMContract.deploy(basicOracle.address)) as AMM

	const ReserveContract = await ethers.getContractFactory('Reserve')
	const reserve = (await ReserveContract.deploy(
		stableToken.address,
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

async function deployBasicOracle() {
	const BasicOracleContract = await ethers.getContractFactory('BasicOracle')
	const reporter = (await ethers.getSigners())[0].address
	return BasicOracleContract.deploy(reporter)
}

export async function deployERC20Harness() {
	const ERC20HarnessContract = await ethers.getContractFactory('ERC20Harness')
	return ERC20HarnessContract.deploy('ERC20 Harness', 'FOO') as Promise<ERC20Harness>
}