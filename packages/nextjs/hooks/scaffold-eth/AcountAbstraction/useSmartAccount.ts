import { useEffect, useState } from "react";
import { useEthersProvider, useEthersSigner } from "../Adapters";
import { SimpleAccountAPI } from "@account-abstraction/sdk";
import { useLocalStorage } from "usehooks-ts";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

export const SCW_ADDRESS_STORAGE_KEY = "scaffoldEth2.scwAddress";

export const useSimpleAccount = () => {
  const targetNetwork = getTargetNetwork();
  const signer = useEthersSigner();
  const provider = useEthersProvider();
  const [scwAddress, setSCWAddress] = useLocalStorage(SCW_ADDRESS_STORAGE_KEY, "");
  const [simpleAccountAPI, setSimpleAccountAPI] = useState<SimpleAccountAPI | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Hack: default getUserOpReceipt does not include fromBlock which causes an error for some RPC providers.
  const getUserOpReceipt = async ({
    userOpHash,
    timeOut = 30000,
    interval = 5000,
  }: {
    userOpHash: string;
    timeOut?: number;
    interval?: number;
  }) => {
    if (!simpleAccountAPI) return undefined;
    const endTime = Date.now() + timeOut;
    const block = await simpleAccountAPI.provider.getBlock("latest");
    while (Date.now() < endTime) {
      // @ts-expect-error
      const events = await simpleAccountAPI?.entryPointView.queryFilter(
        // @ts-expect-error
        simpleAccountAPI.entryPointView.filters.UserOperationEvent(userOpHash),
        Math.max(0, block.number - 100),
      );
      if (events.length > 0) {
        return events[0].transactionHash;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    return undefined;
  };

  useEffect(() => {
    const getSmartAccountAddress = async () => {
      setLoading(true);
      try {
        if (provider && signer) {
          const walletAPI = new SimpleAccountAPI({
            provider,
            entryPointAddress: targetNetwork.entryPointAddress,
            owner: signer,
            factoryAddress: "0x9406cc6185a346906296840746125a0e44976454",
          });

          const address = await walletAPI.getAccountAddress();
          setSCWAddress(address);
          setSimpleAccountAPI(walletAPI);
        }
      } catch (e) {
        console.log("Error happend", e);
      } finally {
        setLoading(false);
      }
    };

    if (!scwAddress) {
      getSmartAccountAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  return { scwAddress, loading, simpleAccountAPI, getUserOpReceipt };
};
