import { createServerFn } from "@tanstack/start"
import { batch, create, get, count } from "ronin"

export const createAirdropWalletToClaim = createServerFn(
  "POST",
  async (data: {
    airdropWalletAddress: string
    walletsForClaimEntries: { walletAddress: string }[]
  }) => {
    const { airdropWalletAddress } = data
    const res = await create.airdropWalletToClaim.with({
      // aird,
    })
    console.log(res)
  },
)

export const testAction = createServerFn(
  "POST",
  async (data: { something: string }) => {
    const { something } = data
    console.log(something, "something")
    throw new Error("broke")
  },
)

export const getAirdrops = createServerFn("GET", async () => {
  const [airdrops, userCount] = await batch(() => [
    get.airdrops.orderedBy.ascending(["orderNumber"]),
    count.users(),
  ])
  return {
    airdrops,
    userCount,
  }
})
