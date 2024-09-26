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
        indexNumber: index,
      })
    })
    console.log(airdropToClaim)
  },
)

export const getAirdropsAvailableForClaim = createServerFn("GET", async () => {
  return [
    {
      airdropAddress: "EQA7W9Zm7f1G1Nycex0fAvTBtJo3IJsKdvj3nMv9zKr8V1kV",
      startDate: 1727344080,
      endDate: 1727351280,
      jettonAddress: "EQC6cYfMFYFur2IgJroc3wBxg-q4hOxsqGQwEYSEARxtOt3V",
    },
  ]
})
