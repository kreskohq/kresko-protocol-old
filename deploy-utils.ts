// Workaround to use ethers types in function parameters
import { ethers as ethersType } from 'ethers'
import { ethers } from 'hardhat'
import { IOracle } from './typechain/IOracle'
import { AMM } from './typechain/AMM'
import { DecimalMath } from './typechain/DecimalMath'
import { UniswapMath } from './typechain/UniswapMath'
import { ERC20Harness } from './typechain/ERC20Harness'
import { KAsset } from './typechain/KAsset'
import { Kresko } from './typechain/Kresko'
import { Reserve } from './typechain/Reserve'
import { abi as IERC20Abi } from './artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json'

export enum Network {
	ALFAJORES = 'ALFAJORES'
}

export enum Contract {
	'STABLE_TOKEN' = 'StableToken'
}

const rpcEndpoints: {
	[key in Network]: string
} = {
	[Network.ALFAJORES]: 'https://alfajores-forno.celo-testnet.org'
}

const contractAddresses: {
	[key in Network]: {
		[key in Contract]: string
	}
} = {
	[Network.ALFAJORES]: {
		[Contract.STABLE_TOKEN]: '0x874069fa1eb16d44d622f2e0ca25eea172369bc1'
	}
}

const contractAbis: {
	[key in Contract]: any
} = {
	[Contract.STABLE_TOKEN]: IERC20Abi
}

export function getContractAddress(contract: Contract, network: Network = Network.ALFAJORES) {
	return contractAddresses[network][contract]
}

export function getContract(contract: Contract, network: Network = Network.ALFAJORES) {
	return new ethers.Contract(
		getContractAddress(contract, network),
		contractAbis[contract]
	)
}

export async function deployKresko(stableToken: ethersType.Contract): Promise<Kresko> {
	const decimalMath = await deployDecimalMath()
	const KreskoContract = await ethers.getContractFactory('Kresko', {
		libraries: {
			// CeloRegistry: celoRegistry.address,
			// DecimalMath: decimalMath.address
		}
	})
	return KreskoContract.deploy(stableToken.address) as Promise<Kresko>
}

async function deployDecimalMath() {
	const DecimalMathContract = await ethers.getContractFactory('DecimalMath')
	return DecimalMathContract.deploy() as Promise<DecimalMath>
}

async function deployuniswapMath() {
	const DecimalMathContract = await ethers.getContractFactory('UniswapMath')
	return DecimalMathContract.deploy() as Promise<UniswapMath>
}

async function deployCeloRegistry() {
	const CeloRegistryContract = await ethers.getContractFactory('CeloRegistry')
	return CeloRegistryContract.deploy()
}

export async function deployKAssetAndFriends(
	stableToken: ethersType.Contract,
	kresko: ethersType.Contract,
	oracle: ethersType.Contract,
	name: string,
	symbol: string
) {
	const KAssetContract = await ethers.getContractFactory('KAsset')
	const kAsset = (await KAssetContract.deploy(kresko.address, name, symbol)) as KAsset

	const UniswapMath = await deployuniswapMath()
	const AMMContract = await ethers.getContractFactory('AMM', {
		libraries: {
			UniswapMath: UniswapMath.address
		}
	})
	const amm = (await AMMContract.deploy(
		kresko.address,
		oracle.address,
		stableToken.address,
		kAsset.address,
		ethers.BigNumber.from('60') // 60 seconds
	)) as AMM

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

export async function deployBasicOracle() {
	const BasicOracleContract = await ethers.getContractFactory('BasicOracle')
	const reporter = (await ethers.getSigners())[0].address
	return BasicOracleContract.deploy(reporter) as Promise<IOracle>
}

export async function deployERC20Harness() {
	const ERC20HarnessContract = await ethers.getContractFactory('ERC20Harness')
	return ERC20HarnessContract.deploy('ERC20 Harness', 'FOO') as Promise<ERC20Harness>
}
