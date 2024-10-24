import { Address } from "@ton/core"
import { tonClient } from "./lib/ton-sender"
import { getEnvOrThrow } from "./lib/env"
import { SampleJetton } from "./lib/ton-master"

// TODO: have a worker that checks that jetton split tx, actually worked, after that do ronin db call
// worker.ts code is similar in that it checks whether token was burned or not succesfully

const masterAddress = process.env.MASTER_ADDRESS!

async function main() {
  try {
    const masterContract = tonClient.open(
      SampleJetton.fromAddress(Address.parse(getEnvOrThrow("MASTER_ADDRESS"))),
    )
  } catch (err) {
    console.log(err, "error")
  }
}

main()
