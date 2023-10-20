"use client";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import React from "react";
import MovieReviewApp from "./MovieReviewApp";

function SerializeInstructionData() {
  const endpoint = clusterApiUrl("devnet");
  const wallet = new PhantomWalletAdapter();
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[wallet]}>
        {/* <WalletModalProvider>
          <WalletMultiButton /> */}
        <MovieReviewApp />
        {/* </WalletModalProvider> */}
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default SerializeInstructionData;
