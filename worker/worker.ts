import "dotenv/config"
import { Address, OpenedContract, Transaction } from "@ton/core"
import {
  JettonDefaultWallet,
  loadTokenNotification,
  loadTokenRecievedMessage,
  loadTokenTransferInternal,
  storeTokenRecievedMessage,
} from "./lib/ton-child"
import { SampleJetton } from "./lib/ton-master"
import { tonClient } from "./lib/ton-sender"
import { create, get, set } from "ronin"
// @ts-ignore
import { fromNano } from "ton"
import { InvalidQueryError } from "ronin/utils"

// TODO: have a worker that checks that jetton split tx, actually worked, after that do ronin db call
// TODO: below is code that does similar to check whether token was burned or not succesfully

console.log("EWEFWEFW")
const ZeroAddress = "UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJKZ"
const MasterAddress = process.env.MASTER_ADDRESS!
type BurnTransactionFromUser = {
  amount: bigint
  from: Address
  tr_id: string
  id: string
}

async function parseTransaction(
  tr: Transaction,
  masterCTR: OpenedContract<SampleJetton>,
): Promise<BurnTransactionFromUser | null> {
  if (tr?.inMessage?.info?.type !== "internal") return null
  const cell = tr.inMessage.body
  const outMessages = tr.outMessages
  try {
    const transfer = loadTokenTransferInternal(cell.beginParse())
    const jettonWalletAddress = await masterCTR.getGetWalletAddress(
      transfer.from,
    )
    const fromWallet = tonClient.open(
      JettonDefaultWallet.fromAddress(jettonWalletAddress),
    )

    const { master, owner } = await fromWallet.getGetWalletData()
    if (!master.equals(Address.parse(MasterAddress))) {
      console.error("Not a master contract transfer")
      return null
    }
    const neededOutMessage = outMessages.values().find((e) => {
      try {
        loadTokenNotification(e.body.beginParse().clone())
        return true
      } catch (e) {
        return false
      }
    })

    if (!neededOutMessage) return null
    const { forward_payload } = loadTokenNotification(
      neededOutMessage.body.beginParse(),
    )
    const mayBecomment = forward_payload.beginParse()

    const ans = {
      amount: transfer.amount,
      from: owner,
      id: mayBecomment.loadStringTail(),
      tr_id: tr.hash().toString("base64"),
    }
    return ans
  } catch (e) {
    console.error("Not an internal transfer", e)
    return null
  }
}

async function checkForNewTransactions(
  childAddress: Address,
  master: OpenedContract<SampleJetton>,
) {
  let i = 20
  while (i >= 0) {
    let transactions: Transaction[]
    try {
      transactions = await tonClient.getTransactions(childAddress, {
        limit: i,
      })
    } catch (e) {
      i--
      await new Promise((r) => setTimeout(r, 500))
      continue
    }
    for (const tr of transactions) {
      //start worker in backend
      parseTransaction(tr, master)
        .then((e) => e && createNewTx(e))
        .catch(console.error)
      await new Promise((r) => setTimeout(r, 400))
    }
  }
}

async function createNewTx({
  id: airdropId,
  from: walletAddressOfSender,
  amount: amountTryingToBurn,
  tr_id: transactionId,
}: BurnTransactionFromUser) {
  try {
    // const newTx = await create.transaction.with({})
    const newTx = await create.transaction.with({
      walletAddressOfSender: walletAddressOfSender.toString(),
      amountTryingToBurn: fromNano(amountTryingToBurn),
      airdropId,
      transactionId,
    })
    console.log(
      {
        walletAddressOfSender: walletAddressOfSender.toString(),
        amountTryingToBurn: fromNano(amountTryingToBurn),
        airdropId,
        transactionId,
      },
      "new tx",
    )
    const airdrop = await get.airdrop.with({
      id: airdropId,
    })
    if (!airdrop) throw new Error("Airdrop not found")
    const newburnedtokens = airdrop.burnedTokens
      ? airdrop.burnedTokens + +fromNano(amountTryingToBurn)
      : +fromNano(amountTryingToBurn)
    console.log(newburnedtokens, `new burned tokens for ${airdropId}`)
    await set.airdrop({
      with: {
        id: airdropId,
      },
      to: {
        burnedTokens: newburnedtokens,
      },
    })
  } catch (e) {
    if (e instanceof InvalidQueryError && e.message.includes("unique")) {
      return
    }
    console.error(e)
    //already exists, not doing anything...
  }
}

async function main() {
  // const test = await createNewTx("0gasdgasdg", 130, "some-id", "123123")
  // console.log(test)
  const masterContract = tonClient.open(
    SampleJetton.fromAddress(Address.parse(MasterAddress)),
  )
  const childAddress = await masterContract.getGetWalletAddress(
    Address.parse(ZeroAddress),
  )

  while (true) {
    console.log("Checking for new transactions...")
    try {
      await checkForNewTransactions(childAddress, masterContract)
    } catch (error) {
      console.log(error, "error")
    }
    await new Promise((resolve) => setTimeout(resolve, 10000))
  }
}

main()

export {}
