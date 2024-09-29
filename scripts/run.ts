import { batch, count, create, get } from "ronin"
import { Address } from "@ton/core"

async function main() {
  const airdropAddress = "EQDPni7dGHmUCm5iJXVNl31YWd5EVTDsRZ_Bhpi56hY8abBT"
  const entries = await get.airdropWalletsForClaim.with({
    airdropToClaim: {
      airdropAddress,
    },
  })
  console.log(entries, "entries")
}

async function getAirdrops() {
  const address = "0QBg74IjuUYh2YiE87zzdHzf_E_XgscFKfmtZGFLOBkMNGgM"
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
  console.log(airdropsForClaim, "airdropsForClaim")
}

async function createAirdrop() {
  const data = {
    airdropAddress: "EQA7W9Zm7f1G1Nycex0fAvTBtJo3IJsKdvj3nMv9zKr8V1kV",
    startDate: 1727344080,
    endDate: 1727351280,
    jettonAddress: "EQC6cYfMFYFur2IgJroc3wBxg-q4hOxsqGQwEYSEARxtOt3V",
    airdropWalletsForClaim: [
      {
        walletAddress: "EQBg74IjuUYh2YiE87zzdHzf_E_XgscFKfmtZGFLOBkMNI5D",
        tokenAmount: "12",
        index: 0,
      },
    ],
  }
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
    console.log(airdropToClaim.id, "id")
    const { walletAddress, tokenAmount, index } = entry
    await create.airdropWalletForClaim.with({
      airdropToClaim: airdropToClaim.id,
      walletAddress,
      tokenAmount,
      indexNumber: index,
    })
  })
  console.log(airdropToClaim)
}

await main()
