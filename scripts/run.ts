import { batch, count, create, get } from "ronin"

async function main() {
  const address = "0QBg74IjuUYh2YiE87zzdHzf_E_XgscFKfmtZGFLOBkMNGgM"
  const airdropsForClaim = await get.airdropWalletsForClaim.with({
    walletAddress: address,
  })
  console.log(airdropsForClaim, "airdropsForClaim")
}

await main()
