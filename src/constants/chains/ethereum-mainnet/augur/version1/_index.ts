import type { Contract, Version } from "@constants/chains/types";
import Augur from "./Augur.json";
import Controller from "./Controller.json";
import CancelOrder from "./CancelOrder.json";
import Cash from "./Cash.json";
import ClaimTradingProceeds from "./ClaimTradingProceeds.json";
import CompleteSets from "./CompleteSets.json";
import CreateOrder from "./CreateOrder.json";
import FillOrder from "./FillOrder.json";
import LegacyReputationToken from "./LegacyReputationToken.json";
import Order from "./Order.json";
import Orders from "./Orders.json";
import OrdersFetcher from "./OrdersFetcher.json";
import OrdersFinder from "./OrdersFinder.json";
import ShareToken from "./ShareToken.json";
import Trade from "./Trade.json";
import TradingEscapeHatch from "./TradingEscapeHatch.json";
import UniverseGenesis from "./UniverseGenesis.json";
import type { JsonFileContract } from "@constants/chains/jsonFileTypes";
import { convertJsonFilesContractToContracts } from "@constants/chains/convertJsonToABI";
const contracts: Contract[] = convertJsonFilesContractToContracts([
  Augur,
  Controller,
  CancelOrder,
  Cash,
  ClaimTradingProceeds,
  CompleteSets,
  CreateOrder,
  FillOrder,
  LegacyReputationToken,
  Order,
  Orders,
  OrdersFetcher,
  OrdersFinder,
  ShareToken,
  Trade,
  TradingEscapeHatch,
  UniverseGenesis,
] as JsonFileContract[]);

export const version: Version = {
  name: "version1",
  contracts: contracts,
};
