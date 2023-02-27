import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

require("dotenv").config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];

  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const args = process.argv;

  const ballotAddress = args.slice(2, 3)[0];
  const voters = args.slice(3);
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

  for (let idx = 0; idx < voters.length; idx++) {
    const voterAddress = voters[idx];
    const tx = await ballotContract.giveRightToVote(voterAddress);
    console.log("tx for give voting", { tx });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
