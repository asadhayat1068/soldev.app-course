"use client";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import React from "react";
import PingWithApproval from "./InteractWithWallet";

function PingWithApprovalPage() {
  const endpoint = clusterApiUrl("devnet");
  const wallet = new PhantomWalletAdapter();
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[wallet]}>
        <PingWithApproval />
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default PingWithApprovalPage;
