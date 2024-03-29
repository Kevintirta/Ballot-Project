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
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );
  console.log("provider", provider);

  const mnemonic = process.env.MNEMONIC;

  if (!mnemonic) {
    throw Error("missing mnemonic");
  }
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);

  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log("balance ", balance);

  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS)
  );

  const transaction = await ballotContract.deployTransaction.wait();

  console.log("transaction ", { transaction });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
