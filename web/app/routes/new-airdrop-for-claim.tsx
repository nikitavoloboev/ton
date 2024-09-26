import { useForm } from "@tanstack/react-form"
import { Address } from "@ton/core"
import { TonConnectButton } from "@tonconnect/ui-react"
import { Trash2 } from "lucide-react"
import { useEffect, useState, useSyncExternalStore } from "react"
import airdropJson from "../../../data/airdrop.json"
import useBlockchainActions from "../lib/airdrop/useActions"
import toast from "react-hot-toast"
import { createFileRoute } from "@tanstack/react-router"
import { createAirdropWalletToClaim } from "~/actions"

const airDropAddress = Address.parse(
  "EQAgFwb4RShopfPqGPg2MjJEAKBcBsrPYQ7RSFlii8W_EpUz",
)
const jettonAddress = Address.parse(import.meta.env.VITE_MASTER_ADDRESS)

function RouteComponent() {
  const [inputPairs, setInputPairs] = useState<
    Array<{ id: number; wallet: string; amount: string }>
  >([])
  const { createAirdrop, sendJettonsToAirdrop } = useBlockchainActions()
  const [submittedAirdropWalletEntries, setSubmittedAirdropWalletEntries] =
    useState<{ userWallet: string; tokenAmount: string }[]>([])

  const [parsedEntriesSubmitted, setParsedEntriesSubmitted] = useState<
    { address: Address; amount: bigint }[]
  >([])

  const form = useForm({
    defaultValues: {
      pairs: [{ userWallet: "", tokenAmount: "" }],
      startTime: "",
      endDate: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setSubmittedAirdropWalletEntries(value.pairs)
        const parsedEntries = value.pairs.map((entry) => ({
          address: Address.parse(entry.userWallet),
          amount: BigInt(entry.tokenAmount),
        }))
        const endTime = new Date(value.endDate).getTime() / 1000
        // const airdropAddress = await createAirdrop({
        //   jettonAddress,
        //   endTime,
        //   startTime: new Date(value.startTime).getTime() / 1000,
        //   entries: parsedEntries,
        // })
        // console.log(airdropAddress, "airdrop address")
        // console.log(airdropAddress.toString(), "string")
        // TODO: just for testing
        const airdropAddressAsString =
          "EQA7W9Zm7f1G1Nycex0fAvTBtJo3IJsKdvj3nMv9zKr8V1kV"
        // TODO: in theory no need for this as createAirdrop should throw?
        // if (!airdropAddress) return
        setParsedEntriesSubmitted(parsedEntries)

        await createAirdropWalletToClaim({
          // airdropAddress: airdropAddress.toString(),
          airdropAddress: airdropAddressAsString,
          startDate: new Date(value.startTime).getTime() / 1000,
          endDate: endTime,
          jettonAddress: jettonAddress.toString(),
          airdropWalletsForClaim: parsedEntries.map((entry, index) => ({
            walletAddress: entry.address.toString(),
            tokenAmount: entry.amount.toString(),
            index,
          })),
        })
        toast.success("Airdrop created successfully")
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred"

        if (errorMessage === "Airdrop already deployed") {
          toast.error(
            "This airdrop with these entries has already been deployed.",
            {
              icon: "🚫",
            },
          )
        } else {
          toast.error(`Error creating airdrop: ${errorMessage}`, {
            icon: "❌",
          })
        }
      }
    },
  })

  const addInputPair = () => {
    form.pushFieldValue("pairs", { userWallet: "", tokenAmount: "" })
    setInputPairs([
      ...inputPairs,
      { id: inputPairs.length, wallet: "", amount: "" },
    ])
  }

  const removeInputPair = (index: number) => {
    if (inputPairs.length > 1) {
      setInputPairs(inputPairs.filter((_, i) => i !== index))
    }
  }

  useEffect(() => {
    const currentStartTime = form.getFieldValue("startTime")
    if (!currentStartTime) {
      form.setFieldValue("startTime", new Date().toISOString().slice(0, 16))
    }
  }, [])

  // TODO: remove it as there should be no default date for end date
  useEffect(() => {
    const now = new Date()
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60000) // 2 hours in milliseconds

    // Set the start time to now
    form.setFieldValue("startTime", now.toISOString().slice(0, 16))

    // Set the end date to 2 hours from now
    form.setFieldValue("endDate", twoHoursLater.toISOString().slice(0, 16))
  }, [])

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-2xl font-bold ">New Airdrop for Claim</h2>
        <TonConnectButton />
      </div>
      <h3 className="text-xl font-semibold mb-4 w-full text-left">
        {/* TODO: add link to docs that opens and says what format the file must be in */}
        Load from file
      </h3>

      <div className="w-full mb-4">
        <label
          htmlFor="fileInput"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
        >
          Attach JSON file
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = (e) => {
                try {
                  const jsonData = JSON.parse(e.target?.result as string)
                  const newPairs = jsonData.map(
                    (
                      item: { wallet: string; amount: number },
                      index: number,
                    ) => ({
                      id: index,
                      wallet: item.wallet,
                      amount: item.amount.toString(),
                    }),
                  )
                  setInputPairs(newPairs)
                  const mappedPairs = newPairs.map(
                    (pair: { wallet: string; amount: number }) => ({
                      userWallet: pair.wallet,
                      tokenAmount: pair.amount,
                    }),
                  )
                  form.setFieldValue("pairs", mappedPairs)
                } catch (error) {
                  console.error("Error parsing JSON file:", error)
                }
              }
              reader.readAsText(file)
            }
          }}
        />
      </div>
      <div className="w-full mb-4 flex justify-start space-x-4">
        <label
          htmlFor="fileInputWithoutFilePicker"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
        >
          Attach JSON file (without file picker)
        </label>
        <input
          id="fileInputWithoutFilePicker"
          accept=".json"
          className="hidden"
          onClick={() => {
            try {
              const newPairs = airdropJson.map((pair, index) => ({
                id: index,
                wallet: pair.wallet,
                amount: pair.amount.toString(), // Convert amount to string
              }))
              setInputPairs(newPairs)
              const mappedPairs = newPairs.map((pair) => ({
                userWallet: pair.wallet,
                tokenAmount: pair.amount,
              }))
              form.setFieldValue("pairs", mappedPairs)
              console.log("airdropJson parsed successfully:", newPairs)
            } catch (error) {
              console.error("Error parsing airdropJson:", error)
            }
          }}
        />
      </div>

      <div className="w-full border-b border-gray-300 dark:border-gray-700 mb-6"></div>
      <h3 className="text-xl font-semibold mb-4 w-full text-left">
        Or add manually
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="flex flex-col gap-6 w-full"
      >
        <div className="flex gap-4">
          <form.Field name="startTime">
            {(field) => (
              <label className="flex flex-col flex-grow">
                <span className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
                  {/* TODO: hide the () if it was set by user in some way */}
                  Start Time
                </span>
                <input
                  type="datetime-local"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             placeholder-gray-500 dark:placeholder-gray-400"
                />
              </label>
            )}
          </form.Field>
          <form.Field name="endDate">
            {(field) => (
              <label className="flex flex-col flex-grow">
                <span className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
                  {/* TODO: hide the () if it was set by user in some way */}
                  End Date
                </span>
                <input
                  type="datetime-local"
                  // TODO: don't set default end date
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  placeholder-gray-500 dark:placeholder-gray-400"
                />
              </label>
            )}
          </form.Field>
        </div>
        {inputPairs.map((pair, index) => (
          <div key={pair.id} className="flex items-end gap-2 w-full">
            <form.Field name={`pairs[${index}].userWallet`}>
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
            <form.Field name={`pairs[${index}].tokenAmount`}>
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
                onClick={() => removeInputPair(index)}
                className="p-2 text-gray-500 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addInputPair}
            className="px-4 py-2 bg-neutral-500 hover:opacity-45 transition-opacity text-white text-sm rounded"
          >
            Add More
          </button>
        </div>

        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
            state.values.pairs.some(
              (pair) => pair.userWallet && pair.tokenAmount,
            ),
          ]}
        >
          {([canSubmit, isSubmitting, hasValidPair]) => (
            <button
              type="submit"
              disabled={!canSubmit || !hasValidPair}
              className={`w-full px-4 py-2 text-white rounded transition-colors ${
                canSubmit && hasValidPair
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Airdrop for Claim"}
            </button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-8 w-full">
        <button
          className={`w-full px-4 py-2 text-white rounded transition-colors ${
            parsedEntriesSubmitted.length > 0
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={parsedEntriesSubmitted.length === 0}
          onClick={() => {
            if (!submittedAirdropWalletEntries) return
            sendJettonsToAirdrop(
              airDropAddress,
              parsedEntriesSubmitted.reduce((a, b) => ({
                address: a.address,
                amount: a.amount + b.amount,
              })).amount,
              jettonAddress,
            )
          }}
        >
          Send Jettons to Airdrop
        </button>
      </div>
    </div>
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

export const Route = createFileRoute("/new-airdrop-for-claim")({
  component: () => (
    <ClientOnly>
      <RouteComponent />
    </ClientOnly>
  ),
})
