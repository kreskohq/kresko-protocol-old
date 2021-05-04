/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { KAsset } from "../KAsset";

export class KAsset__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    kresko_: string,
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<KAsset> {
    return super.deploy(
      kresko_,
      name_,
      symbol_,
      overrides || {}
    ) as Promise<KAsset>;
  }
  getDeployTransaction(
    kresko_: string,
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(kresko_, name_, symbol_, overrides || {});
  }
  attach(address: string): KAsset {
    return super.attach(address) as KAsset;
  }
  connect(signer: Signer): KAsset__factory {
    return super.connect(signer) as KAsset__factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): KAsset {
    return new Contract(address, _abi, signerOrProvider) as KAsset;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "kresko_",
        type: "address",
      },
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "kresko",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001b9438038062001b948339818101604052810190620000379190620001f0565b8181816003908051906020019062000051929190620000b7565b5080600490805190602001906200006a929190620000b7565b50505082600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505062000436565b828054620000c59062000341565b90600052602060002090601f016020900481019282620000e9576000855562000135565b82601f106200010457805160ff191683800117855562000135565b8280016001018555821562000135579182015b828111156200013457825182559160200191906001019062000117565b5b50905062000144919062000148565b5090565b5b808211156200016357600081600090555060010162000149565b5090565b60006200017e6200017884620002a1565b62000278565b9050828152602081018484840111156200019757600080fd5b620001a48482856200030b565b509392505050565b600081519050620001bd816200041c565b92915050565b600082601f830112620001d557600080fd5b8151620001e784826020860162000167565b91505092915050565b6000806000606084860312156200020657600080fd5b60006200021686828701620001ac565b935050602084015167ffffffffffffffff8111156200023457600080fd5b6200024286828701620001c3565b925050604084015167ffffffffffffffff8111156200026057600080fd5b6200026e86828701620001c3565b9150509250925092565b60006200028462000297565b905062000292828262000377565b919050565b6000604051905090565b600067ffffffffffffffff821115620002bf57620002be620003dc565b5b620002ca826200040b565b9050602081019050919050565b6000620002e482620002eb565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60005b838110156200032b5780820151818401526020810190506200030e565b838111156200033b576000848401525b50505050565b600060028204905060018216806200035a57607f821691505b60208210811415620003715762000370620003ad565b5b50919050565b62000382826200040b565b810181811067ffffffffffffffff82111715620003a457620003a3620003dc565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b6200042781620002d7565b81146200043357600080fd5b50565b61174e80620004466000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c806340c10f191161008c578063a457c2d711610066578063a457c2d714610228578063a9059cbb14610258578063d77e128c14610288578063dd62ed3e146102a6576100cf565b806340c10f19146101be57806370a08231146101da57806395d89b411461020a576100cf565b806306fdde03146100d4578063095ea7b3146100f257806318160ddd1461012257806323b872dd14610140578063313ce56714610170578063395093511461018e575b600080fd5b6100dc6102d6565b6040516100e99190611128565b60405180910390f35b61010c60048036038101906101079190610f06565b610368565b604051610119919061110d565b60405180910390f35b61012a610386565b604051610137919061126a565b60405180910390f35b61015a60048036038101906101559190610eb7565b610390565b604051610167919061110d565b60405180910390f35b610178610491565b6040516101859190611285565b60405180910390f35b6101a860048036038101906101a39190610f06565b61049a565b6040516101b5919061110d565b60405180910390f35b6101d860048036038101906101d39190610f06565b610546565b005b6101f460048036038101906101ef9190610e52565b6105e4565b604051610201919061126a565b60405180910390f35b61021261062c565b60405161021f9190611128565b60405180910390f35b610242600480360381019061023d9190610f06565b6106be565b60405161024f919061110d565b60405180910390f35b610272600480360381019061026d9190610f06565b6107b2565b60405161027f919061110d565b60405180910390f35b6102906107d0565b60405161029d91906110f2565b60405180910390f35b6102c060048036038101906102bb9190610e7b565b6107f6565b6040516102cd919061126a565b60405180910390f35b6060600380546102e5906113ce565b80601f0160208091040260200160405190810160405280929190818152602001828054610311906113ce565b801561035e5780601f106103335761010080835404028352916020019161035e565b820191906000526020600020905b81548152906001019060200180831161034157829003601f168201915b5050505050905090565b600061037c61037561087d565b8484610885565b6001905092915050565b6000600254905090565b600061039d848484610a50565b6000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006103e861087d565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610468576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161045f906111ca565b60405180910390fd5b6104858561047461087d565b85846104809190611312565b610885565b60019150509392505050565b60006012905090565b600061053c6104a761087d565b8484600160006104b561087d565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461053791906112bc565b610885565b6001905092915050565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146105d6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105cd906111aa565b60405180910390fd5b6105e08282610ccf565b5050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461063b906113ce565b80601f0160208091040260200160405190810160405280929190818152602001828054610667906113ce565b80156106b45780601f10610689576101008083540402835291602001916106b4565b820191906000526020600020905b81548152906001019060200180831161069757829003601f168201915b5050505050905090565b600080600160006106cd61087d565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508281101561078a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107819061122a565b60405180910390fd5b6107a761079561087d565b8585846107a29190611312565b610885565b600191505092915050565b60006107c66107bf61087d565b8484610a50565b6001905092915050565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156108f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108ec9061120a565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610965576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161095c9061116a565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610a43919061126a565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610ac0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ab7906111ea565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610b30576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b279061114a565b60405180910390fd5b610b3b838383610e23565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610bc1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bb89061118a565b60405180910390fd5b8181610bcd9190611312565b6000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610c5d91906112bc565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610cc1919061126a565b60405180910390a350505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610d3f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d369061124a565b60405180910390fd5b610d4b60008383610e23565b8060026000828254610d5d91906112bc565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610db291906112bc565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e17919061126a565b60405180910390a35050565b505050565b600081359050610e37816116ea565b92915050565b600081359050610e4c81611701565b92915050565b600060208284031215610e6457600080fd5b6000610e7284828501610e28565b91505092915050565b60008060408385031215610e8e57600080fd5b6000610e9c85828601610e28565b9250506020610ead85828601610e28565b9150509250929050565b600080600060608486031215610ecc57600080fd5b6000610eda86828701610e28565b9350506020610eeb86828701610e28565b9250506040610efc86828701610e3d565b9150509250925092565b60008060408385031215610f1957600080fd5b6000610f2785828601610e28565b9250506020610f3885828601610e3d565b9150509250929050565b610f4b81611346565b82525050565b610f5a81611358565b82525050565b6000610f6b826112a0565b610f7581856112ab565b9350610f8581856020860161139b565b610f8e8161145e565b840191505092915050565b6000610fa66023836112ab565b9150610fb18261146f565b604082019050919050565b6000610fc96022836112ab565b9150610fd4826114be565b604082019050919050565b6000610fec6026836112ab565b9150610ff78261150d565b604082019050919050565b600061100f6011836112ab565b915061101a8261155c565b602082019050919050565b60006110326028836112ab565b915061103d82611585565b604082019050919050565b60006110556025836112ab565b9150611060826115d4565b604082019050919050565b60006110786024836112ab565b915061108382611623565b604082019050919050565b600061109b6025836112ab565b91506110a682611672565b604082019050919050565b60006110be601f836112ab565b91506110c9826116c1565b602082019050919050565b6110dd81611384565b82525050565b6110ec8161138e565b82525050565b60006020820190506111076000830184610f42565b92915050565b60006020820190506111226000830184610f51565b92915050565b600060208201905081810360008301526111428184610f60565b905092915050565b6000602082019050818103600083015261116381610f99565b9050919050565b6000602082019050818103600083015261118381610fbc565b9050919050565b600060208201905081810360008301526111a381610fdf565b9050919050565b600060208201905081810360008301526111c381611002565b9050919050565b600060208201905081810360008301526111e381611025565b9050919050565b6000602082019050818103600083015261120381611048565b9050919050565b600060208201905081810360008301526112238161106b565b9050919050565b600060208201905081810360008301526112438161108e565b9050919050565b60006020820190508181036000830152611263816110b1565b9050919050565b600060208201905061127f60008301846110d4565b92915050565b600060208201905061129a60008301846110e3565b92915050565b600081519050919050565b600082825260208201905092915050565b60006112c782611384565b91506112d283611384565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561130757611306611400565b5b828201905092915050565b600061131d82611384565b915061132883611384565b92508282101561133b5761133a611400565b5b828203905092915050565b600061135182611364565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b838110156113b957808201518184015260208101905061139e565b838111156113c8576000848401525b50505050565b600060028204905060018216806113e657607f821691505b602082108114156113fa576113f961142f565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b7f53656e646572206e6f74206b7265736b6f000000000000000000000000000000600082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206160008201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b6116f381611346565b81146116fe57600080fd5b50565b61170a81611384565b811461171557600080fd5b5056fea2646970667358221220033571b4b897ff75bf2ddf044243bd55fd67bf3ef8819fcac638f0a20604c09164736f6c63430008040033";