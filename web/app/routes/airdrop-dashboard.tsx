import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react"
import { getAidropsDashboard } from "~/actions"

function RouteComponent() {
  const address = useTonAddress()
  const { data, error, isLoading } = useQuery({
    queryKey: ["airdrop-dashboard"],
    queryFn: async () => {
      const res = await getAidropsDashboard({ ownerAddress: address })
      console.log(res, "res")
      return res
    },
    enabled: !!address,
  })
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>
  return (
    <>
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center w-full mb-6">
          <div>
            <h2 className="text-2xl font-bold">Airdrop Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">See existing airdrops</p>
          </div>
          <TonConnectButton />
        </div>

        <ul className="w-full mt-6 space-y-4">
          <li className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Airdrop for 100 TON
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ends in 4 days, 2/5 claimed
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}

export const Route = createFileRoute("/airdrop-dashboard")({
  component: () => <RouteComponent />,
})
