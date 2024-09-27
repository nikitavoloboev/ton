import { useForm } from "@tanstack/react-form"
import { createFileRoute } from "@tanstack/react-router"
import { useState, useSyncExternalStore } from "react"
import { PanelWithTonWallet } from "~/components/PanelWithTonWallet"
import multiWalletTransactionJson from "../../../data/multi-wallet-transaction.json"
import useBlockchainActions from "~/lib/airdrop/useActions"

function RouteComponent() {
  // const { transactionIntoMultipleWallets } = useBlockchainActions()
  // TODO: add when `multi wallet tx` from button works
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

  return (
    <>
      <PanelWithTonWallet header="Multi Wallet Transaction">
        <button
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
          onClick={() => {
            const walletsForSplit = multiWalletTransactionJson.map((item) => {
              return {
                walletAddress: item.wallet,
                percentageSplit: item.percentage,
              }
            })
            // transactionIntoMultipleWallets(walletsForSplit, 0.01)
            console.log(walletsForSplit, "walletsForSplit")
          }}
        >
          Do Multi Wallet Transaction for 0.01 TON
        </button>
        {/* <div className="w-full mb-4 flex justify-start space-x-4">
          <label
            htmlFor="fileInputWithoutFilePicker"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
          >
            Pre Load Wallets with Percentages
          </label>
          <input
            id="fileInputWithoutFilePicker"
            accept=".json"
            className="hidden"
            onClick={() => {
              try {
                // const newPairs = multiWalletTransactionJson.map((pair, index) => ({
                //   id: index,
                //   wallet: pair.wallet,
                //   amount: pair.amount.toString(), // Convert amount to string
                // }))
                // setInputPairs(newPairs)
                // const mappedPairs = newPairs.map((pair) => ({
                //   userWallet: pair.wallet,
                //   tokenAmount: pair.amount,
                // }))
                // form.setFieldValue("pairs", mappedPairs)
                // console.log("airdropJson parsed successfully:", newPairs)
              } catch (error) {
                console.error("Error parsing airdropJson:", error)
              }
            }}
          />
        </div> */}
      </PanelWithTonWallet>
    </>
  )
}

function useHydrated() {
  return useSyncExternalStore(
    () => {
      return () => {}
    },
    () => true,
    () => false,
  )
}

const ClientOnly = ({ children }: React.PropsWithChildren) => {
  const hydrated = useHydrated()
  return hydrated ? <>{children}</> : null
}

export const Route = createFileRoute("/multi-wallet-transaction")({
  component: () => (
    <ClientOnly>
      <RouteComponent />
    </ClientOnly>
  ),
})
