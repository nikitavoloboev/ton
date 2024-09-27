import { createServerFn } from "@tanstack/start"
import { batch, count, create, get } from "ronin"
import { appendToClipboard } from "./lib/utils"
import { Address } from "@ton/core"

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
        claimed: false,
      })
    })
    console.log(airdropToClaim)
  },
)

export const getAirdropsAvailableForClaim = createServerFn(
  "POST",
  async (data: { address: string }) => {
    const { address } = data
    const properAddress = Address.parse(address).toString()
    const airdropWalletsForClaim = await get.airdropWalletsForClaim.with({
      walletAddress: properAddress,
      claimed: false,
    })
    let airdropsForClaim: any[] = []
    await Promise.all(
      airdropWalletsForClaim.map(async (airdrop) => {
        const airdropToClaim = await get.airdropToClaim.with({
          id: airdrop.airdropToClaim,
        })
        airdropsForClaim.push(airdropToClaim)
      }),
    )
    return airdropsForClaim
  },
)

export const getEntriesForAirdrop = createServerFn(
  "POST",
  async (data: { airdropAddress: string }) => {
    const { airdropAddress } = data
    const entries = await get.airdropWalletsForClaim.with({
      airdropToClaim: airdropAddress,
    })
    return entries
  },
)
