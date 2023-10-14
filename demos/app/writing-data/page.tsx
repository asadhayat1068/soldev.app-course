import React from "react";
import * as dotenv from "dotenv";
import WritingTransaction from "./WritingTransaction";
import { Keypair } from "@solana/web3.js";
dotenv.config();

function WritingData() {
  return <WritingTransaction secret={process.env.SECRET_KEY || ""} />;
}

export default WritingData;
