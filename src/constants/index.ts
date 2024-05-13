// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import type { ApiState } from 'types';

export const LOCAL_STORAGE_KEY = {
  CUSTOM_ENDPOINT: 'contractsUiCustomEndpoint',
  PREFERRED_ENDPOINT: 'contractsUiPreferredEndpoint',
  THEME: 'theme',
} as const;

export type LocalStorageKey = (typeof LOCAL_STORAGE_KEY)[keyof typeof LOCAL_STORAGE_KEY];

export const ROCOCO_CONTRACTS = {
  relay: 'Rococo',
  name: 'Contracts (Rococo)',
  rpc: 'wss://rococo-contracts-rpc.polkadot.io',
};

const CUSTOM_ENDPOINT = localStorage.getItem(LOCAL_STORAGE_KEY.CUSTOM_ENDPOINT);
export const LOCAL = {
  relay: undefined,
  name: 'Local Node',
  rpc: CUSTOM_ENDPOINT ? (JSON.parse(CUSTOM_ENDPOINT) as string) : 'ws://127.0.0.1:9944',
};

const DBC_TESTNET = {
  relay: undefined,
  name: 'DBC Testnet',
  rpc: 'wss://infotest.dbcwallet.io:7777',
};

const DBC_MAINNET = {
  relay: undefined,
  name: 'DBC Mainnet',
  rpc: 'wss://info1.dbcwallet.io',
};

export const TESTNETS = [
  ...[
    // ROCOCO_CONTRACTS,
    DBC_TESTNET,
  ].sort((a, b) => a.name.localeCompare(b.name)),
  LOCAL,
];

export const MAINNETS = [DBC_MAINNET].sort((a, b) => a.name.localeCompare(b.name));

export const DEFAULT_DECIMALS = 12;

export const MAX_CALL_WEIGHT = new BN(2_000_000_000_000);

export const NULL_CHAIN_PROPERTIES = {
  systemName: null,
  systemVersion: null,
  tokenDecimals: DEFAULT_DECIMALS,
  tokenSymbol: 'Unit',
};

export const INIT_STATE: ApiState = {
  ...NULL_CHAIN_PROPERTIES,
  endpoint: LOCAL.rpc,
  keyringStatus: null,
  error: null,
  status: 'CONNECT_INIT',
} as unknown as ApiState;
