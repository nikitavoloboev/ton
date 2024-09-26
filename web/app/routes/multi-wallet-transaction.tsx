import { useForm } from "@tanstack/react-form"
import { createFileRoute } from "@tanstack/react-router"
import { useSyncExternalStore } from "react"
import { PanelWithTonWallet } from "~/components/PanelWithTonWallet"

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      wallets: [],
    },
    onSubmit: async ({ value }) => {
      try {
      } catch (error) {}
    },
  })

  return (
    <>
      <PanelWithTonWallet header="Multi Wallet Transaction">
        <div>..</div>
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
