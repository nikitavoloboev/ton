import { useForm } from "@tanstack/react-form"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { PanelWithTonWallet } from "~/components/PanelWithTonWallet"
import multiWalletTransactionJson from "../../../data/multi-wallet-transaction.json"
import { Trash2 } from "lucide-react"
import { useProviderSender } from "~/lib/ton-sender"
import { Address, toNano } from "@ton/core"

function RouteComponent() {
  const sender = useProviderSender()
  const [walletsForSplit, setWalletsForSplit] = useState<
    {
      walletAddress: string
      percentageSplit: number
    }[]
  >([])
  const form = useForm({
    defaultValues: {
      walletsForSplit: [] as {
        walletAddress: string
        percentageSplit: string
      }[],
    },
    onSubmit: async ({ value }) => {
      try {
      } catch (error) {}
    },
  })

  const isButtonDisabled =
    walletsForSplit.length === 0 ||
    walletsForSplit.reduce((sum, wallet) => sum + wallet.percentageSplit, 0) !==
      100

  return (
    <>
      <PanelWithTonWallet header="Multi Wallet Transaction">
        <h3 className="text-xl font-semibold mb-4 w-full text-left">Helpers</h3>
        <button
          className="px-4 py-2 text-white rounded transition-colors bg-blue-500 hover:bg-blue-600 text-center w-[50%] cursor-pointer"
          onClick={() => {
            setWalletsForSplit([
              { walletAddress: "xgh", percentageSplit: 25 },
              { walletAddress: "xgh", percentageSplit: 25 },
              { walletAddress: "xgh", percentageSplit: 25 },
              { walletAddress: "xgh", percentageSplit: 25 },
            ])
          }}
        >
          Set 4 wallets with 25% each split
        </button>
        <div className="w-full border-b border-gray-300 dark:border-gray-700 my-6"></div>

        <div className="pb-6 flex flex-col gap-2">
          {walletsForSplit.map((pair, index) => (
            <div
              key={pair.walletAddress}
              className="flex items-end gap-2 w-full"
            >
              <form.Field name={`walletsForSplit[${index}].walletAddress`}>
                {(field) => (
                  <label className="flex flex-col flex-grow">
                    <span className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
                      User Wallet
                    </span>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </label>
                )}
              </form.Field>
              <form.Field name={`walletsForSplit[${index}].percentageSplit`}>
                {(field) => (
                  <label className="flex flex-col w-32">
                    <span className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
                      Token Amount
                    </span>
                    <input
                      type="number"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </label>
                )}
              </form.Field>

              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const newWalletsForSplit = walletsForSplit.filter(
                      (_, i) => i !== index,
                    )
                    setWalletsForSplit(newWalletsForSplit)
                  }}
                  className="p-2 text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          className={`inline-block px-4 py-2 text-white rounded transition-colors ${
            isButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={() => {
            const walletsForSplit = multiWalletTransactionJson.map((item) => {
              return {
                walletAddress: item.wallet,
                percentageSplit: item.percentage,
              }
            })
            console.log(walletsForSplit, "walletsForSplit")
          }}
        >
          Do Multi Wallet Transaction for 0.01 TON
        </button>
        <button
          className={`inline-block px-4 py-2 text-black rounded transition-colors`}
          onClick={async () => {
            const addresses = [
              "0QBg74IjuUYh2YiE87zzdHzf_E_XgscFKfmtZGFLOBkMNGgM",
              "0QCWmH6cEB1YgCSeMFZCBKEitaUWr3wwZt9OBLuGup0s8GnX",
              "0QCWmH6cEB1YgCSeMFZCBKEitaUWr3wwZt9OBLuGup0s8GnX",
              "0QCWmH6cEB1YgCSeMFZCBKEitaUWr3wwZt9OBLuGup0s8GnX",
              "0QCWmH6cEB1YgCSeMFZCBKEitaUWr3wwZt9OBLuGup0s8GnX",
            ]
            const res = await Promise.all(
              addresses.map((address) => {
                return sender.send({
                  to: Address.parse(address),
                  value: toNano(0.05),
                })
              }),
            )
            console.log(res)
          }}
        >
          Do Multi Wallet Transaction for 0.01 5$ USDT into 5 wallets
        </button>
      </PanelWithTonWallet>
    </>
  )
}

export const Route = createFileRoute("/multi-wallet-transaction")({
  component: () => <RouteComponent />,
})
