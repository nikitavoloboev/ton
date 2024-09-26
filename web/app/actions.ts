import { createServerFn } from "@tanstack/start"
import { batch, count, create, get } from "ronin"

export const createAirdropWalletToClaim = createServerFn(
  "POST",
  async (data: {
    airdropWalletAddress: string
    startDate: number // unix
    endDate: number // unix
    jettonAddress: string
    walletsForClaimEntries: {
      walletAddress: string
      tokenAmount: string
      index: number
    }[]
  }) => {
    const {
      airdropWalletAddress,
      startDate,
      endDate,
      walletsForClaimEntries,
      jettonAddress,
    } = data

    const res = await create.airdropToClaim.with({
      airdropAddress: airdropWalletAddress,
      startDate: new Date(startDate * 1000),
      endDate: new Date(endDate * 1000),
      jettonAddress,
    })
    if (!res) throw new Error("Failed to create airdrop to claim")
    walletsForClaimEntries.forEach(async (entry) => {
      const { walletAddress, tokenAmount, index } = entry
      await create.walletToClaimForAirdrop.with({
        walletAddress,
        tokenAmount,
        index,
        airdropToClaim: res.id,
      })
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
