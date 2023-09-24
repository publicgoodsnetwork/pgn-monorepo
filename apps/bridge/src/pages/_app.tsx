import "../styles/globals.css";
import "@pgn/react/styles.css";

import { type AppType } from "next/dist/shared/lib/utils";

import { BridgeProvider, tokens, networks } from "@pgn/react";

import Head from "next/head";

const l1 = networks.supportedChains[process.env.NEXT_PUBLIC_L1 || "sepolia"];
const l2 = networks.supportedChains[process.env.NEXT_PUBLIC_L2 || "pgnTestnet"];

if (!(l1 && l2)) {
  throw new Error(
    "NEXT_PUBLIC_L1 and L2 must be configured in .env to supported networks"
  );
}
const config = {
  // Tokens to be shown in the UI
  tokens: [tokens.ETH, tokens.TestToken, tokens.GTC, tokens.DAI, tokens.USDT],
  // Configs with RPC url and chain IDs
  networks: { l1, l2 },
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo-circle-black.png" type="image/png" />
        <link rel="icon" href="/logo-circle-black.svg" type="image/svg+xml" />
      </Head>
      <BridgeProvider config={config}>
        <Component {...pageProps} />
      </BridgeProvider>
    </>
  );
};

export default MyApp;
