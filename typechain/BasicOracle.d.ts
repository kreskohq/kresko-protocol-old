/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface BasicOracleInterface extends ethers.utils.Interface {
  functions: {
    "reporter()": FunctionFragment;
    "setReporter(address)": FunctionFragment;
    "setValue(uint256)": FunctionFragment;
    "value()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "reporter", values?: undefined): string;
  encodeFunctionData(functionFragment: "setReporter", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setValue",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "value", values?: undefined): string;

  decodeFunctionResult(functionFragment: "reporter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setReporter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setValue", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "value", data: BytesLike): Result;

  events: {
    "SetReporter(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "SetReporter"): EventFragment;
}

export class BasicOracle extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: BasicOracleInterface;

  functions: {
    reporter(overrides?: CallOverrides): Promise<[string]>;

    "reporter()"(overrides?: CallOverrides): Promise<[string]>;

    setReporter(
      newReporter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setReporter(address)"(
      newReporter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setValue(
      newValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "setValue(uint256)"(
      newValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    value(overrides?: CallOverrides): Promise<[BigNumber]>;

    "value()"(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  reporter(overrides?: CallOverrides): Promise<string>;

  "reporter()"(overrides?: CallOverrides): Promise<string>;

  setReporter(
    newReporter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setReporter(address)"(
    newReporter: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setValue(
    newValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "setValue(uint256)"(
    newValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  value(overrides?: CallOverrides): Promise<BigNumber>;

  "value()"(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    reporter(overrides?: CallOverrides): Promise<string>;

    "reporter()"(overrides?: CallOverrides): Promise<string>;

    setReporter(newReporter: string, overrides?: CallOverrides): Promise<void>;

    "setReporter(address)"(
      newReporter: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setValue(newValue: BigNumberish, overrides?: CallOverrides): Promise<void>;

    "setValue(uint256)"(
      newValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    value(overrides?: CallOverrides): Promise<BigNumber>;

    "value()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    SetReporter(oracle: null): TypedEventFilter<[string], { oracle: string }>;
  };

  estimateGas: {
    reporter(overrides?: CallOverrides): Promise<BigNumber>;

    "reporter()"(overrides?: CallOverrides): Promise<BigNumber>;

    setReporter(
      newReporter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setReporter(address)"(
      newReporter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setValue(
      newValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "setValue(uint256)"(
      newValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    value(overrides?: CallOverrides): Promise<BigNumber>;

    "value()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    reporter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "reporter()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setReporter(
      newReporter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setReporter(address)"(
      newReporter: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setValue(
      newValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "setValue(uint256)"(
      newValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    value(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "value()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
