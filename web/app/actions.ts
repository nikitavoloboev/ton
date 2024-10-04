import { createServerFn } from "@tanstack/start"
import { batch, count, create, get } from "ronin"
import { appendToClipboard, isProduction } from "./lib/utils"
import { Address } from "@ton/core"

export const createAirdropWalletToClaim = createServerFn(
  "POST",
  async (data: {
    airdropAddress: string
    startDate: number // unix
    endDate: number // unix
    jettonAddress: string
    mainnet: boolean
    airdropWalletsForClaim: {
      walletAddress: string
      tokenAmount: string
      index: number
    }[]
  }) => {
    // appendToClipboard(data)
    const {
      airdropAddress,
      startDate,
      endDate,
      airdropWalletsForClaim,
      jettonAddress,
      mainnet,
    } = data
    const airdropToClaim = await create.airdropToClaim.with({
      airdropAddress,
      jettonAddress,
      startDate: new Date(startDate * 1000),
      endDate: new Date(endDate * 1000),
      mainnet,
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
    const currentDate = new Date()
    const properAddress = Address.parse(address).toString()
    const airdropWalletsForClaim = await get.airdropWalletsForClaim.with({
      walletAddress: properAddress,
      claimed: false,
      // mainnet: isProduction,
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
    return airdropsForClaim.filter(
      (airdrop) => new Date(airdrop.endDate) > currentDate,
    )
  },
)

export const getEntriesForAirdrop = createServerFn(
  "POST",
  async (data: { airdropAddress: string }) => {
    const { airdropAddress } = data
    const entries = await get.airdropWalletsForClaim.with({
      airdropToClaim: {
        airdropAddress,
      },
    })
    // Sort entries by indexNumber in ascending order
    return entries.sort((a, b) => a.indexNumber - b.indexNumber)
  },
)
