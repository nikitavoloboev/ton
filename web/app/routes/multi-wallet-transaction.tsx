import { createFileRoute } from "@tanstack/react-router"
import { useSyncExternalStore } from "react"
import { PanelWithTonWallet } from "~/components/PanelWithTonWallet"

function RouteComponent() {
  return (
    <>
      <PanelWithTonWallet header="Multi Wallet Transaction" />
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
