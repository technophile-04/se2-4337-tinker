import * as React from "react";
import { loadBurnerSK } from "../useBurnerWallet";
import { Wallet, providers } from "ethers";
import { type WalletClient, useAccount, useWalletClient } from "wagmi";

export function bunerWalletClientToSigner(walletClient: WalletClient) {
  const { chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = new Wallet(loadBurnerSK(), provider);
  return signer;
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  const accountState = useAccount();

  return React.useMemo(() => {
    if (!accountState.isConnected || !walletClient) return undefined;

    if (accountState.connector?.id === "burner-wallet") {
      return bunerWalletClientToSigner(walletClient);
    }

    return walletClientToSigner(walletClient);
  }, [walletClient, accountState.isConnected, accountState.connector?.id]);
}
