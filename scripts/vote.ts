import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";

require("dotenv").config();

async function main() {
  const args = process.argv;

  const ballotAddress = args.slice(2, 3)[0];
  const proposalToVoteNumber = args.slice(3)[0];
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
  console.log("balance ", balance);

  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(ballotAddress);
  const tx = await ballotContract.vote(proposalToVoteNumber);

  console.log(`tx voting for voting, proposal number ${proposalToVoteNumber}`, {
    tx,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
