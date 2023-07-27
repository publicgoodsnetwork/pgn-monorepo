import { Token } from "../types";

export const ETH = {
  name: "ETH",
  symbol: "ETH",
  decimals: 18,
  description: "",
  website: "",
  twitter: "",
  tokens: {
    ethereum: { address: "" },
    homestead: { address: "" },
    sepolia: { address: "" },
    pgn: { address: "" },
    pgnTestnet: { address: "" },
  },
};

export const TestToken = {
  name: "TestToken",
  symbol: "TestToken",
  decimals: 18,
  description: "",
  website: "",
  twitter: "",
  tokens: {
    sepolia: {
      address: "0x10246FE5Bf3b06Fc688eD4AA1445FF52358CE3A9",
    },
    pgnTestnet: {
      address: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
    },
  },
};

export const ChainLink = {
  name: "ChainLink",
  symbol: "LINK",
  decimals: 18,
  tokens: {
    sepolia: {
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    },
    pgnTestnet: {
      address: "0x3390108E913824B8eaD638444cc52B9aBdF63798",
    },
  },
};
