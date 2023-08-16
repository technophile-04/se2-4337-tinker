import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

// import { Address } from "~~/components/scaffold-eth";
// import { useSmartAccount } from "~~/hooks/scaffold-eth/AcountAbstraction";

const Home: NextPage = () => {
  // const { scwAddress } = useSmartAccount();
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

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex flex-col">
            {/* <p>Smart Account Address</p> */}
            {/* <Address address={scwAddress} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
