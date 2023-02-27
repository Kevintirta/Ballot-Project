import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

require("dotenv").config();

async function main() {
  const args = process.argv;

  const ballotAddress = args.slice(2, 3)[0];
  // delegated vote to address
  const toAddress = args.slice(3)[0];
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );

  const mnemonic = process.env.MNEMONIC;

  if (!mnemonic) {
    throw Error("missing mnemonic");
  }
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();

  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(ballotAddress);

  const tx = await ballotContract.delegate(toAddress);
  console.log("trasnaction delegating vote ", { tx });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
