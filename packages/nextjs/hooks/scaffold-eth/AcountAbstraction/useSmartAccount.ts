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

  return { scwAddress, loading, simpleAccountAPI };
};
