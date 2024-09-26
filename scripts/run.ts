import { batch, count, create, get } from "ronin"

async function main() {
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
