import {
  Link,
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start"
import * as React from "react"
import type { QueryClient } from "@tanstack/react-query"
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary"
import { NotFound } from "~/components/NotFound"
import appCss from "~/styles/app.css?url"
import { seo } from "~/utils/seo"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import { Toaster } from "react-hot-toast"
import { isProduction } from "~/lib/utils"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    ...seo({
      title: "TON",
      description: `TON utils and other code`,
    }),
  ],
  links: () => [
    { rel: "stylesheet", href: appCss },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
    { rel: "icon", href: "/favicon.ico" },
  ],
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <TonConnectUIProvider manifestUrl="https://gist.githubusercontent.com/nikitavoloboev/3a20b9deaa0c12e84f662776177aad52/raw/da68c1ae363a5b940f2f92bf997011332460e835/manifest.json">
        <Outlet />
      </TonConnectUIProvider>
      <Toaster />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          {" | "}
          <Link
            to="/new-airdrop-for-claim"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            New Airdrop for Claim
          </Link>
          {" | "}
          <Link
            to="/claim-airdrop"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Claim Airdrop
          </Link>
          {" | "}
          <Link
            to="/airdrop-dashboard"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Airdrop Dashboard
          </Link>
          {" | "}
          <Link
            to="/multi-wallet-transaction"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Multi Wallet Transaction
          </Link>
        </div>
        <hr />
        {children}
        <ScrollRestoration />
        {!isProduction && <TanStackRouterDevtools position="bottom-right" />}
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </Body>
    </Html>
  )
}
