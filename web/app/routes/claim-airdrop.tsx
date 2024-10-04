import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Address } from "@ton/core"
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react"
import { formatDistanceToNow } from "date-fns"
import {
  getAirdropsAvailableForClaim,
  getEntriesForAirdrop,
  setAirdropWalletForClaimAsClaimed,
} from "~/actions"
import { ClientOnly } from "~/lib/react"
import useBlockchainActions from "../lib/airdrop/useActions"
import { set } from "ronin"

function RouteComponent() {
  const { claimAirdrop } = useBlockchainActions()
  const address = useTonAddress()

  const { data, error, isLoading } = useQuery({
    queryKey: ["claim-airdrop", address],
    queryFn: async () => {
      const res = await getAirdropsAvailableForClaim({ address })
      return res
    },
    enabled: !!address,
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
        <div className="space-y-4">
          {data?.map((airdrop) => (
            <div key={airdrop.id}>
              <p
                className={`
                relative overflow-hidden px-6 py-3 rounded-full
                bg-gradient-to-r from-purple-500 to-pink-500
                text-white font-bold text-lg
                transform transition-all duration-300 ease-in-out cursor-pointer
              `}
                onClick={async () => {
                  try {
                    const entries = await getEntriesForAirdrop({
                      airdropAddress: airdrop.airdropAddress,
                    })
                    console.log(entries, "entries")
                    // @ts-ignore
                    const parsedEntries = entries.map((entry) => ({
                      address: Address.parse(entry.walletAddress),
                      amount: BigInt(entry.tokenAmount),
                    }))
                    console.log(parsedEntries, "parsedEntries")
                    console.log(airdrop.airdropAddress, "testing..")
                    await claimAirdrop({
                      airdropAddress: Address.parse(airdrop.airdropAddress),
                      entries: parsedEntries,
                    })
                    await fetch(
                      "http://localhost:8787/set-airdrop-wallet-for-claim-as-claimed",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          airdropAddress: airdrop.airdropAddress,
                          walletAddress: address,
                          // @ts-ignore
                          entries: entries.map((entry) => ({
                            address: entry.walletAddress,
                            amount: entry.tokenAmount.toString(),
                          })),
                        }),
                      },
                    )
                    // await setAirdropWalletForClaimAsClaimed({
                    //   airdropAddress: airdrop.airdropAddress.toString(),
                    //   walletAddress: address,
                    //   // @ts-ignore
                    //   entries: entries?.map((entry) => ({
                    //     address: entry.walletAddress,
                    //     amount: entry.tokenAmount,
                    //   })),
                    // })
                  } catch (err) {
                    console.log(err, "err")
                  }
                }}
              >
                Claim before:{" "}
                <strong>
                  {/* @ts-ignore */}
                  {formatDistanceToNow(new Date(airdrop.endDate))}
                </strong>{" "}
                passes
              </p>
            </div>
          ))}
        </div>
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
  component: () => (
    <ClientOnly>
      <RouteComponent />
    </ClientOnly>
  ),
})
