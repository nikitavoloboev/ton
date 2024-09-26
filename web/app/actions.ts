import { createServerFn } from "@tanstack/start"
import { batch, count, create, get } from "ronin"
import { appendToClipboard } from "./lib/utils"

export const createAirdropWalletToClaim = createServerFn(
  "POST",
  async (data: {
    airdropAddress: string
    startDate: number // unix
    endDate: number // unix
    jettonAddress: string
    airdropWalletsForClaim: {
      walletAddress: string
      tokenAmount: string
      index: number
    }[]
  }) => {
    appendToClipboard(data)
    const {
      airdropAddress,
      startDate,
      endDate,
      airdropWalletsForClaim,
      jettonAddress,
    } = data
    const airdropToClaim = await create.airdropToClaim.with({
      airdropAddress,
      jettonAddress,
      startDate: new Date(startDate * 1000),
      endDate: new Date(endDate * 1000),
    })
    if (!airdropToClaim) throw new Error("Failed to create airdrop to claim")
    airdropWalletsForClaim.forEach(async (entry) => {
      console.log(entry, "entry")
      const { walletAddress, tokenAmount, index } = entry
      await create.airdropWalletForClaim.with({
        airdropToClaim: airdropToClaim.id,
        walletAddress,
        tokenAmount,
        index,
      })
    })
    console.log(airdropToClaim)
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
