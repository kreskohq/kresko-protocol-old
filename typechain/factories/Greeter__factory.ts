/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { Greeter } from "../Greeter";

export class Greeter__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _greeting: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Greeter> {
    return super.deploy(_greeting, overrides || {}) as Promise<Greeter>;
  }
  getDeployTransaction(
    _greeting: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_greeting, overrides || {});
  }
  attach(address: string): Greeter {
    return super.attach(address) as Greeter;
  }
  connect(signer: Signer): Greeter__factory {
    return super.connect(signer) as Greeter__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Greeter {
    return new Contract(address, _abi, signerOrProvider) as Greeter;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_greeting",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "greet",
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
    name: "greeting",
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
    inputs: [
      {
        internalType: "string",
        name: "_greeting",
        type: "string",
      },
    ],
    name: "setGreeting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000ce938038062000ce9833981810160405281019062000037919062000278565b6200006760405180606001604052806022815260200162000cc760229139826200008760201b620002851760201c565b80600090805190602001906200007f92919062000156565b5050620004c5565b620001298282604051602401620000a0929190620002fe565b6040516020818303038152906040527f4b5c4277000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506200012d60201b60201c565b5050565b60008151905060006a636f6e736f6c652e6c6f679050602083016000808483855afa5050505050565b8280546200016490620003ea565b90600052602060002090601f016020900481019282620001885760008555620001d4565b82601f10620001a357805160ff1916838001178555620001d4565b82800160010185558215620001d4579182015b82811115620001d3578251825591602001919060010190620001b6565b5b509050620001e39190620001e7565b5090565b5b8082111562000202576000816000905550600101620001e8565b5090565b60006200021d620002178462000362565b62000339565b9050828152602081018484840111156200023657600080fd5b62000243848285620003b4565b509392505050565b600082601f8301126200025d57600080fd5b81516200026f84826020860162000206565b91505092915050565b6000602082840312156200028b57600080fd5b600082015167ffffffffffffffff811115620002a657600080fd5b620002b4848285016200024b565b91505092915050565b6000620002ca8262000398565b620002d68185620003a3565b9350620002e8818560208601620003b4565b620002f381620004b4565b840191505092915050565b600060408201905081810360008301526200031a8185620002bd565b90508181036020830152620003308184620002bd565b90509392505050565b60006200034562000358565b905062000353828262000420565b919050565b6000604051905090565b600067ffffffffffffffff82111562000380576200037f62000485565b5b6200038b82620004b4565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b60005b83811015620003d4578082015181840152602081019050620003b7565b83811115620003e4576000848401525b50505050565b600060028204905060018216806200040357607f821691505b602082108114156200041a576200041962000456565b5b50919050565b6200042b82620004b4565b810181811067ffffffffffffffff821117156200044d576200044c62000485565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b6107f280620004d56000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063a413686214610046578063cfae321714610062578063ef690cc014610080575b600080fd5b610060600480360381019061005b91906104f4565b61009e565b005b61006a610165565b604051610077919061056e565b60405180910390f35b6100886101f7565b604051610095919061056e565b60405180910390f35b61014b60405180606001604052806023815260200161079a60239139600080546100c7906106c7565b80601f01602080910402602001604051908101604052809291908181526020018280546100f3906106c7565b80156101405780601f1061011557610100808354040283529160200191610140565b820191906000526020600020905b81548152906001019060200180831161012357829003601f168201915b505050505083610321565b80600090805190602001906101619291906103e9565b5050565b606060008054610174906106c7565b80601f01602080910402602001604051908101604052809291908181526020018280546101a0906106c7565b80156101ed5780601f106101c2576101008083540402835291602001916101ed565b820191906000526020600020905b8154815290600101906020018083116101d057829003601f168201915b5050505050905090565b60008054610204906106c7565b80601f0160208091040260200160405190810160405280929190818152602001828054610230906106c7565b801561027d5780601f106102525761010080835404028352916020019161027d565b820191906000526020600020905b81548152906001019060200180831161026057829003601f168201915b505050505081565b61031d828260405160240161029b929190610590565b6040516020818303038152906040527f4b5c4277000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506103c0565b5050565b6103bb838383604051602401610339939291906105c7565b6040516020818303038152906040527f2ced7cef000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506103c0565b505050565b60008151905060006a636f6e736f6c652e6c6f679050602083016000808483855afa5050505050565b8280546103f5906106c7565b90600052602060002090601f016020900481019282610417576000855561045e565b82601f1061043057805160ff191683800117855561045e565b8280016001018555821561045e579182015b8281111561045d578251825591602001919060010190610442565b5b50905061046b919061046f565b5090565b5b80821115610488576000816000905550600101610470565b5090565b600061049f61049a84610638565b610613565b9050828152602081018484840111156104b757600080fd5b6104c2848285610685565b509392505050565b600082601f8301126104db57600080fd5b81356104eb84826020860161048c565b91505092915050565b60006020828403121561050657600080fd5b600082013567ffffffffffffffff81111561052057600080fd5b61052c848285016104ca565b91505092915050565b600061054082610669565b61054a8185610674565b935061055a818560208601610694565b61056381610788565b840191505092915050565b600060208201905081810360008301526105888184610535565b905092915050565b600060408201905081810360008301526105aa8185610535565b905081810360208301526105be8184610535565b90509392505050565b600060608201905081810360008301526105e18186610535565b905081810360208301526105f58185610535565b905081810360408301526106098184610535565b9050949350505050565b600061061d61062e565b905061062982826106f9565b919050565b6000604051905090565b600067ffffffffffffffff82111561065357610652610759565b5b61065c82610788565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b82818337600083830152505050565b60005b838110156106b2578082015181840152602081019050610697565b838111156106c1576000848401525b50505050565b600060028204905060018216806106df57607f821691505b602082108114156106f3576106f261072a565b5b50919050565b61070282610788565b810181811067ffffffffffffffff8211171561072157610720610759565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f830116905091905056fe4368616e67696e67206772656574696e672066726f6d202725732720746f2027257327a2646970667358221220cc433ee71bbe0027af338bc6bdd096270bff65d055253f0316e817fa43e3c1a664736f6c634300080400334465706c6f79696e67206120477265657465722077697468206772656574696e673a";
