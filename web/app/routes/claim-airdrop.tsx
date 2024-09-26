import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react"
import useBlockchainActions from "../lib/airdrop/useActions"
import { ClientOnly } from "~/lib/react"
import { getAirdropsAvailableForClaim } from "~/actions"

function RouteComponent() {
  const { claimAirdrop } = useBlockchainActions()
  const address = useTonAddress()

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["claim-airdrop", address],
    queryFn: async () => {
      const res = await getAirdropsAvailableForClaim()
      return res
    },
  })
  console.log(data, "data")

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading airdrop data</div>

  return (
    <>
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center w-full mb-6">
          <h2 className="text-2xl font-bold ">Claim Airdrop</h2>
          <TonConnectButton />
        </div>
        <button
          onClick={() => {
            // claimAirdrop({ airdropAddress: airDropAddress, entries })
          }}
          className={`w-full px-4 py-2 text-white rounded transition-colors bg-blue-500 hover:bg-blue-600 `}
        >
          Claim Airdrop
        </button>
      </div>
    </>
  )
}

export const Route = createFileRoute("/claim-airdrop")({
  component: () => (
    <ClientOnly>
      <RouteComponent />
    </ClientOnly>
  ),
})
