const deployedContracts = {
  "5": [
    {
      name: "goerli",
      chainId: "5",
      contracts: {
        SimpleAccountFactory: {
          address: "0x9406Cc6185a346906296840746125a0E44976454",
          abi: [
            {
              inputs: [
                {
                  internalType: "contract IEntryPoint",
                  name: "_entryPoint",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [],
              name: "accountImplementation",
              outputs: [
                {
                  internalType: "contract SimpleAccount",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "salt",
                  type: "uint256",
                },
              ],
              name: "createAccount",
              outputs: [
                {
                  internalType: "contract SimpleAccount",
                  name: "ret",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "salt",
                  type: "uint256",
                },
              ],
              name: "getAddress",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
        },
      },
    },
  ],
};

export default deployedContracts;
