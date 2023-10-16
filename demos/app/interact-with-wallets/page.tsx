"use client";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { Inter } from "next/font/google";
import React from "react";
import InteractWithWallet from "./InteractWithWallet";

function InteractWithWalletPage() {
  const endpoint = clusterApiUrl("devnet");
  const wallet = new PhantomWalletAdapter();
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[wallet]}>
        {/* <WalletModalProvider>
          <WalletMultiButton /> */}
        <InteractWithWallet />
        {/* </WalletModalProvider> */}
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default InteractWithWalletPage;
