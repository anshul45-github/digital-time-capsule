import React from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";


const Wallet = () => {
  return (
    <col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
      <WalletSelector />
    </col>
  );
};

export default Wallet;
