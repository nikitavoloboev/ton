import { createFileRoute } from "@tanstack/react-router"
import { TonConnectButton } from "@tonconnect/ui-react"

function RouteComponent() {
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
      </div>
    </>
  )
}

export const Route = createFileRoute("/airdrop-dashboard")({
  component: () => <RouteComponent />,
})
