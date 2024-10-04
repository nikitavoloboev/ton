import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react"
import useBlockchainActions from "../lib/airdrop/useActions"
import { ClientOnly } from "~/lib/react"
import { getAirdropsAvailableForClaim, getEntriesForAirdrop } from "~/actions"
import { Address } from "@ton/core"
import { formatDistanceToNow } from "date-fns"

function RouteComponent() {
  const { claimAirdrop } = useBlockchainActions()
  const address = useTonAddress()

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["claim-airdrop", address],
    queryFn: async () => {
      const res = await getAirdropsAvailableForClaim({ address })
      return res
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading airdrop data</div>

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center w-full mb-6">
          <h2 className="text-2xl font-bold ">Claim Airdrop</h2>
          <TonConnectButton />
        </div>
        <h1 className="mb-4">Airdrops available for claim</h1>
        {data.map((airdrop) => (
          <div key={airdrop.id}>
            <p
              className="cursor-pointer"
              onClick={async () => {
                const entries = await getEntriesForAirdrop({
                  airdropAddress: airdrop.airdropAddress,
                })
                console.log(entries, "entries")
                // @ts-ignore
                const parsedEntries = entries.map((entry) => ({
                  address: Address.parse(entry.walletAddress),
                  // address: entry.walletAddress,
                  amount: BigInt(entry.tokenAmount),
                }))
                console.log(parsedEntries, "parsedEntries")
                console.log(airdrop.airdropAddress, "testing..")
                await claimAirdrop({
                  airdropAddress: Address.parse(airdrop.airdropAddress),
                  entries: parsedEntries,
                })
                // here for ref of what `entries` should look like
                // const entries = [
                //   {
                //     address: Address.parse("0QBg74IjuUYh2YiE87zzdHzf_E_XgscFKfmtZGFLOBkMNGgM"),
                //     amount: 200000n,
                //   },
                // ]
              }}
            >
              Claim before:{" "}
              <strong>{formatDistanceToNow(new Date(airdrop.endDate))}</strong>{" "}
              passes
            </p>
          </div>
        ))}
        {/* <button
          onClick={() => {
            // claimAirdrop({ airdropAddress: airDropAddress, entries })
          }}
          className={`w-full px-4 py-2 text-white rounded transition-colors bg-blue-500 hover:bg-blue-600 `}
        >
          Claim Airdrop
        </button> */}
      </div>
    </>
  )
}

export const Route = createFileRoute("/claim-airdrop")({
  component: () => <RouteComponent />,
  ssr: false,
})
