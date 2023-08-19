import { useState } from "react";
import { HttpRpcClient } from "@account-abstraction/sdk";
import { providers } from "ethers";
import type { NextPage } from "next";
import { encodeFunctionData } from "viem";
import { usePublicClient } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { Address, Balance, InputBase } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useSimpleAccount } from "~~/hooks/scaffold-eth/AcountAbstraction";
import scaffoldConfig from "~~/scaffold.config";
import getGasFee from "~~/utils/account-abstraction/getGasFee";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { scwAddress, simpleAccountAPI, getUserOpReceipt } = useSimpleAccount();
  const [greetings, setGreetings] = useState("");
  const { data: YourContract } = useDeployedContractInfo("YourContract");
  const [loading, setLoading] = useState(false);
  const targetNetwork = getTargetNetwork();
  const publicClient = usePublicClient();

  const setGreeting = async () => {
    try {
      setLoading(true);
      if (simpleAccountAPI && YourContract && targetNetwork.rpcUrls.alchemy?.http[0]) {
        const bundlerUrl = `${targetNetwork.rpcUrls.alchemy?.http[0]}/${scaffoldConfig.alchemyApiKey}`;
        const callData = encodeFunctionData({
          abi: YourContract.abi,
          functionName: "setGreeting",
          args: [greetings],
        });
        const network = {
          chainId: publicClient.chain.id,
          name: publicClient.chain.name,
          ensAddress: publicClient.chain.contracts?.ensRegistry?.address,
        };
        const provider = new providers.JsonRpcProvider(bundlerUrl, network);
        const op = await simpleAccountAPI.createSignedUserOp({
          target: YourContract.address,
          data: callData,
          ...getGasFee(provider),
        });
        console.log("The final OP:", op);
        const chainId = publicClient.chain.id;
        const httpRpcClient = new HttpRpcClient(bundlerUrl, targetNetwork.entryPointAddress, chainId);

        const uoHash = await httpRpcClient.sendUserOpToBundler(op);
        console.log("UoHash", uoHash);

        const receipt = await getUserOpReceipt({ userOpHash: uoHash });
        console.log("Receipt is :", receipt);
      }
    } catch (error) {
      console.log("Error while setting grettings", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2 AA</span>
          </h1>
        </div>

        <div className="flex-grow flex-col bg-base-300 w-full space-y-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center mt-4">
              <p className="py-0 text-xl">Smart Account Address</p>
              <Address address={scwAddress} />
            </div>
            <div className="flex flex-col items-center mt-4">
              <p className="py-0 text-xl">Smart Account Balace</p>
              <Balance address={scwAddress} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="py-0 text-xl my-0">Make Smart Account Transaction</p>
            <InputBase
              name="set gretting"
              placeholder="Set Greetings"
              onChange={newValue => setGreetings(newValue)}
              value={greetings}
            />
            <button
              className={`btn btn-secondary btn-sm ${loading ? "loading" : ""}`}
              disabled={loading}
              onClick={setGreeting}
            >
              Set Greetings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
