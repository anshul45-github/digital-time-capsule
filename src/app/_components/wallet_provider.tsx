"use client"

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import type { ReactNode } from "react";

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AptosWalletAdapterProvider
      optInWallets={["Petra"]}
      autoConnect={true}
      dappConfig={{ network: Network.DEVNET }}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
