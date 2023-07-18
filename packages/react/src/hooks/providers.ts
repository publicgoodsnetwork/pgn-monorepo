import { providers } from "ethers";
import { useMemo } from "react";
import { HttpTransport } from "viem";
import {
  type PublicClient,
  usePublicClient,
  useWalletClient,
  WalletClient,
} from "wagmi";

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const client = useWalletClient({ chainId }).data;

  return useMemo(
    () => (client ? walletClientToSigner(client) : undefined),
    [client]
  );
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return useMemo(() => publicClientToProvider(publicClient), [publicClient]);
}

function walletClientToSigner({ account, chain, transport }: WalletClient) {
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

function publicClientToProvider({ chain, transport }: PublicClient) {
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );

  return new providers.JsonRpcProvider(transport.url, network);
}
