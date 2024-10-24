import { Address, OpenedContract, Transaction } from "@ton/core"
import { tonClient } from "./lib/ton-sender"
import { getEnvOrThrow } from "./lib/env"
import { SampleJetton } from "./lib/ton-master"

// TODO: have a worker that checks that jetton split tx, actually worked, after that do ronin db call
// worker.ts code is similar in that it checks whether token was burned or not succesfully

async function main() {
  try {
    const masterContract = tonClient.open(
      SampleJetton.fromAddress(
        // usdt
        Address.parse(getEnvOrThrow("JETTON_MASTER_ADDRESS")),
      ),
    )
    const splitContractAddress = await masterContract.getGetWalletAddress(
      Address.parse(getEnvOrThrow("SPLIT_CONTRACT_MASTER_ADDRESS")),
    )
    while (true) {
      console.log("Checking for new transactions...")
      try {
        await checkForNewTransactions(splitContractAddress, masterContract)
      } catch (error) {
        console.log(error, "error")
      }
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  } catch (err) {
    console.log(err, "error")
  }
}

async function checkForNewTransactions(
  childAddress: Address,
  master: OpenedContract<SampleJetton>,
) {
  let i = 20
  while (i >= 0) {
    let transactions: Transaction[]
    try {
      transactions = await tonClient.getTransactions(childAddress, {
        limit: i,
      })
    } catch (e) {
      i--
      await new Promise((r) => setTimeout(r, 500))
      continue
    }
    for (const tr of transactions) {
    }
  }
}

main()
