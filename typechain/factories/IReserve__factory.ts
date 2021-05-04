/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { IReserve } from "../IReserve";

export class IReserve__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IReserve {
    return new Contract(address, _abi, signerOrProvider) as IReserve;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferStableTokenToAMM",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
