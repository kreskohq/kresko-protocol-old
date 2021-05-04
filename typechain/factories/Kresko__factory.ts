/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { Kresko } from "../Kresko";

export class Kresko__factory extends ContractFactory {
  constructor(linkLibraryAddresses: KreskoLibraryAddresses, signer?: Signer) {
    super(_abi, Kresko__factory.linkBytecode(linkLibraryAddresses), signer);
  }

  static linkBytecode(linkLibraryAddresses: KreskoLibraryAddresses): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$6580aa165d805f885508396ee1dd75b5bb\\$__", "g"),
      linkLibraryAddresses["__$6580aa165d805f885508396ee1dd75b5bb$__"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Kresko> {
    return super.deploy(overrides || {}) as Promise<Kresko>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Kresko {
    return super.attach(address) as Kresko;
  }
  connect(signer: Signer): Kresko__factory {
    return super.connect(signer) as Kresko__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Kresko {
    return new Contract(address, _abi, signerOrProvider) as Kresko;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "collateralLedgers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "collateralPercentOwnershipInfos",
    outputs: [
      {
        internalType: "uint256",
        name: "initialPercentageOwned",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ledgerIndex",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "kAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "depositCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "kAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getCollateralAmountOwned",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "kAsset",
        type: "address",
      },
    ],
    name: "getTotalCollateralAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "kAssetInfos",
    outputs: [
      {
        internalType: "address",
        name: "amm",
        type: "address",
      },
      {
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "kAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "amm",
        type: "address",
      },
      {
        internalType: "address",
        name: "reserve",
        type: "address",
      },
    ],
    name: "listKAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060006100216100c460201b60201c565b9050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3506100cc565b600033905090565b611eb1806100db6000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c8063981a77c911610066578063981a77c91461015c5780639b38546e1461018e578063a5d5db0c146101be578063b1f0f295146101da578063f2fde38b146101f65761009e565b80630169b2e1146100a357806354821c21146100d35780635833935114610103578063715018a6146101345780638da5cb5b1461013e575b600080fd5b6100bd60048036038101906100b891906115f1565b610212565b6040516100ca919061192e565b60405180910390f35b6100ed60048036038101906100e8919061159f565b610515565b6040516100fa919061192e565b60405180910390f35b61011d600480360381019061011891906115f1565b6107df565b60405161012b929190611949565b60405180910390f35b61013c610810565b005b61014661094a565b604051610153919061180a565b60405180910390f35b6101766004803603810190610171919061159f565b610973565b60405161018593929190611825565b60405180910390f35b6101a860048036038101906101a3919061167c565b6109ea565b6040516101b5919061192e565b60405180910390f35b6101d860048036038101906101d3919061167c565b610a1b565b005b6101f460048036038101906101ef919061162d565b610c46565b005b610210600480360381019061020b919061159f565b610e01565b005b600082600073ffffffffffffffffffffffffffffffffffffffff16600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156102e7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102de906118ee565b60405180910390fd5b6000600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060405180604001604052908160008201548152602001600182015481525050905060008160000151141561039d57600092505061050e565b6000600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020905060006104e36104d083856020015181548110610425577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200154846001600360008d73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805490506104809190611be0565b815481106104b7577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200154610faa90919063ffffffff16565b8460000151610fcf90919063ffffffff16565b90506105086105036104f489610515565b83610ff490919063ffffffff16565b611019565b94505050505b5092915050565b600081600073ffffffffffffffffffffffffffffffffffffffff16600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156105ea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105e1906118ee565b60405180910390fd5b60006105f461108b565b90508073ffffffffffffffffffffffffffffffffffffffff166370a08231600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040518263ffffffff1660e01b8152600401610691919061180a565b60206040518083038186803b1580156106a957600080fd5b505afa1580156106bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106e191906116e1565b8173ffffffffffffffffffffffffffffffffffffffff166370a08231600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040518263ffffffff1660e01b815260040161077c919061180a565b60206040518083038186803b15801561079457600080fd5b505afa1580156107a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107cc91906116e1565b6107d6919061198e565b92505050919050565b6002602052816000526040600020602052806000526040600020600091509150508060000154908060010154905082565b610818611141565b73ffffffffffffffffffffffffffffffffffffffff1661083661094a565b73ffffffffffffffffffffffffffffffffffffffff161461088c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108839061190e565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160149054906101000a900460ff16905083565b60036020528160005260406000208181548110610a0657600080fd5b90600052602060002001600091509150505481565b81600073ffffffffffffffffffffffffffffffffffffffff16600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610aee576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ae5906118ee565b60405180910390fd5b610af661108b565b73ffffffffffffffffffffffffffffffffffffffff166323b872dd33600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16856040518463ffffffff1660e01b8152600401610b949392919061185c565b602060405180830381600087803b158015610bae57600080fd5b505af1158015610bc2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610be691906116b8565b610c25576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c1c906118ae565b60405180910390fd5b6000610c318433610212565b9050610c408484836001611149565b50505050565b610c4e611141565b73ffffffffffffffffffffffffffffffffffffffff16610c6c61094a565b73ffffffffffffffffffffffffffffffffffffffff1614610cc2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cb99061190e565b60405180910390fd5b60405180606001604052808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200160011515815250600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160010160146101000a81548160ff021916908315150217905550905050505050565b610e09611141565b73ffffffffffffffffffffffffffffffffffffffff16610e2761094a565b73ffffffffffffffffffffffffffffffffffffffff1614610e7d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e749061190e565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610eed576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ee4906118ce565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000610fc78383601b60ff16600a610fc29190611a68565b611470565b905092915050565b6000610fec8383601b60ff16600a610fe79190611a68565b6114d3565b905092915050565b60006110118383601260ff16600a61100c9190611a68565b6114d3565b905092915050565b600080600a6012601b61102c9190611c14565b60ff16600a61103b9190611a68565b61104591906119e4565b8361105091906119e4565b90506005600a826110619190611ca7565b1061107657600a81611073919061198e565b90505b600a8161108391906119e4565b915050919050565b600061ce1073ffffffffffffffffffffffffffffffffffffffff1663dcf0aaed6040516020016110ba906117f5565b604051602081830303815290604052805190602001206040518263ffffffff1660e01b81526004016110ec9190611893565b60206040518083038186803b15801561110457600080fd5b505afa158015611118573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061113c91906115c8565b905090565b600033905090565b600061115485610515565b905060008261116e5784826111699190611be0565b61117b565b848261117a919061198e565b5b905060006111928284610faa90919063ffffffff16565b90506000846111ac5786866111a79190611be0565b6111b9565b86866111b8919061198e565b5b905060006111d08483610faa90919063ffffffff16565b90506000600360008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020905081600260008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001819055508080549050600260008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101819055506000818054905011156113c057806113958583600185805490506113459190611be0565b8154811061137c577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200154610fcf90919063ffffffff16565b9080600181540180825580915050600190039060005260206000200160009091909190915055611464565b8073__$6580aa165d805f885508396ee1dd75b5bb$__63d5e5e6e66040518163ffffffff1660e01b815260040160206040518083038186803b15801561140557600080fd5b505af4158015611419573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061143d91906116e1565b90806001815401808255809150506001900390600052602060002001600090919091909150555b50505050505050505050565b60008083600a84876114829190611b86565b61148c9190611b86565b61149691906119e4565b90506005600a826114a79190611ca7565b106114bc57600a816114b9919061198e565b90505b600a816114c991906119e4565b9150509392505050565b600080600a836114e391906119e4565b84866114ef9190611b86565b6114f991906119e4565b90506005600a8261150a9190611ca7565b1061151f57600a8161151c919061198e565b90505b600a8161152c91906119e4565b9150509392505050565b60008135905061154581611e36565b92915050565b60008151905061155a81611e36565b92915050565b60008151905061156f81611e4d565b92915050565b60008135905061158481611e64565b92915050565b60008151905061159981611e64565b92915050565b6000602082840312156115b157600080fd5b60006115bf84828501611536565b91505092915050565b6000602082840312156115da57600080fd5b60006115e88482850161154b565b91505092915050565b6000806040838503121561160457600080fd5b600061161285828601611536565b925050602061162385828601611536565b9150509250929050565b60008060006060848603121561164257600080fd5b600061165086828701611536565b935050602061166186828701611536565b925050604061167286828701611536565b9150509250925092565b6000806040838503121561168f57600080fd5b600061169d85828601611536565b92505060206116ae85828601611575565b9150509250929050565b6000602082840312156116ca57600080fd5b60006116d884828501611560565b91505092915050565b6000602082840312156116f357600080fd5b60006117018482850161158a565b91505092915050565b61171381611c48565b82525050565b61172281611c5a565b82525050565b61173181611c66565b82525050565b6000611744601f83611972565b915061174f82611d43565b602082019050919050565b6000611767602683611972565b915061177282611d6c565b604082019050919050565b600061178a601d83611972565b915061179582611dbb565b602082019050919050565b60006117ad602083611972565b91506117b882611de4565b602082019050919050565b60006117d0600b83611983565b91506117db82611e0d565b600b82019050919050565b6117ef81611c90565b82525050565b6000611800826117c3565b9150819050919050565b600060208201905061181f600083018461170a565b92915050565b600060608201905061183a600083018661170a565b611847602083018561170a565b6118546040830184611719565b949350505050565b6000606082019050611871600083018661170a565b61187e602083018561170a565b61188b60408301846117e6565b949350505050565b60006020820190506118a86000830184611728565b92915050565b600060208201905081810360008301526118c781611737565b9050919050565b600060208201905081810360008301526118e78161175a565b9050919050565b600060208201905081810360008301526119078161177d565b9050919050565b60006020820190508181036000830152611927816117a0565b9050919050565b600060208201905061194360008301846117e6565b92915050565b600060408201905061195e60008301856117e6565b61196b60208301846117e6565b9392505050565b600082825260208201905092915050565b600081905092915050565b600061199982611c90565b91506119a483611c90565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156119d9576119d8611cd8565b5b828201905092915050565b60006119ef82611c90565b91506119fa83611c90565b925082611a0a57611a09611d07565b5b828204905092915050565b6000808291508390505b6001851115611a5f57808604811115611a3b57611a3a611cd8565b5b6001851615611a4a5780820291505b8081029050611a5885611d36565b9450611a1f565b94509492505050565b6000611a7382611c90565b9150611a7e83611c90565b9250611aab7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484611ab3565b905092915050565b600082611ac35760019050611b7f565b81611ad15760009050611b7f565b8160018114611ae75760028114611af157611b20565b6001915050611b7f565b60ff841115611b0357611b02611cd8565b5b8360020a915084821115611b1a57611b19611cd8565b5b50611b7f565b5060208310610133831016604e8410600b8410161715611b555782820a905083811115611b5057611b4f611cd8565b5b611b7f565b611b628484846001611a15565b92509050818404811115611b7957611b78611cd8565b5b81810290505b9392505050565b6000611b9182611c90565b9150611b9c83611c90565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615611bd557611bd4611cd8565b5b828202905092915050565b6000611beb82611c90565b9150611bf683611c90565b925082821015611c0957611c08611cd8565b5b828203905092915050565b6000611c1f82611c9a565b9150611c2a83611c9a565b925082821015611c3d57611c3c611cd8565b5b828203905092915050565b6000611c5382611c70565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b6000611cb282611c90565b9150611cbd83611c90565b925082611ccd57611ccc611d07565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60008160011c9050919050565b7f4b7265736b6f3a2072657365727665207472616e73666572206661696c656400600082015250565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b7f4b7265736b6f3a206b417373657420646f6573206e6f74206578697374000000600082015250565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b7f537461626c65546f6b656e000000000000000000000000000000000000000000600082015250565b611e3f81611c48565b8114611e4a57600080fd5b50565b611e5681611c5a565b8114611e6157600080fd5b50565b611e6d81611c90565b8114611e7857600080fd5b5056fea2646970667358221220087a362023d58e636483eb92a7700f9ade89debe713cecef138484ee22ed5d1664736f6c63430008040033";

export interface KreskoLibraryAddresses {
  ["__$6580aa165d805f885508396ee1dd75b5bb$__"]: string;
}
