import { batch, count, create, get } from "ronin"

async function main() {
  const res = await create.airdropWalletForClaim.with({
    walletAddress: "test",
  })
}

// TODO: how to not ts-ignore this..
// @ts-ignore
await main()
