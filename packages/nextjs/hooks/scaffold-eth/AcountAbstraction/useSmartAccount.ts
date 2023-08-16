import { useEffect, useState } from "react";
import { useEthersProvider, useEthersSigner } from "../Adapters";
import { type ClientConfig, SimpleAccountAPI, wrapProvider } from "@account-abstraction/sdk";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useLocalStorage } from "usehooks-ts";
import scaffoldConfig from "~~/scaffold.config";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const scwAddressStorageKey = "scaffoldEth2.scwAddress";
export const useSmartAccount = () => {
  const targetNetwork = getTargetNetwork();
  const signer = useEthersSigner();
  const provider = useEthersProvider();
  const [scwAddress, setSCWAddress] = useLocalStorage(scwAddressStorageKey, "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (provider && signer) {
        const walletAPI = new SimpleAccountAPI(
          provider,
          targetNetwork.entryPointAddress,
          signer,
          "0x9406cc6185a346906296840746125a0e44976454",
        );
        const config: ClientConfig = {
          entryPointAddress: targetNetwork.entryPointAddress,
          bundlerUrl: `${targetNetwork.rpcUrls.alchemy.http[0]}/${scaffoldConfig.alchemyApiKey}`,
        };

        const aaProvider = await wrapProvider(provider as JsonRpcProvider, config, signer);
        const address = await aaProvider?.getSigner().getAddress();
        setSCWAddress(address);
      }
    })();
  }, [provider, signer]);

  return { scwAddress, loading };
};
