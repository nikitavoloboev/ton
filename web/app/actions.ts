import {AirdropToClaim} from "@ronin/ton"
import {createServerFn} from "@tanstack/start"
import {Address} from "@ton/core"
import {create, get, set} from "ronin"
import {isProduction} from "./lib/utils"
import {TonClient} from "@ton/ton";
import {Airdrop, AirdropEntry, generateEntriesDictionary} from "~/lib/airdrop/wrappers/Airdrop";
import {AirdropHelper} from "~/lib/airdrop/wrappers/AirdropHelper";

export const createAirdropWalletToClaim = createServerFn(
    "POST",
    async (data: {
        airdropAddress: string
        startDate: number // unix
        endDate: number // unix
        jettonAddress: string
        mainnet: boolean
        airdropWalletsForClaim: {
            walletAddress: string
            tokenAmount: string
            index: number
        }[]
        metadata: {
            decimals: number
            image: string
            title: string
        }

        creatorAddress: string
    }) => {
        const {
            airdropAddress,
            startDate,
            endDate,
            airdropWalletsForClaim,
            jettonAddress,
            mainnet,
            creatorAddress
        } = data
        const airdropToClaim = await create.airdropToClaim.with({
            airdropAddress,
            jettonAddress,
            startDate: new Date(startDate * 1000),
            endDate: new Date(endDate * 1000),
            mainnet,
            fundsDrained: false,
            image: data.metadata.image,
            digits: data.metadata.decimals.toString(),
            jettonName: data.metadata.title,
            ownerAddress: creatorAddress
        })
        if (!airdropToClaim) throw new Error("Failed to create airdrop to claim")
        await Promise.all(
            airdropWalletsForClaim.map(async (entry) => {
                console.log(entry, "adding entry")
                const {walletAddress, tokenAmount, index} = entry
                await create.airdropWalletForClaim.with({
                    airdropToClaim: airdropToClaim.id,
                    walletAddress,
                    tokenAmount,
                    indexNumber: index,
                    claimed: false,
                })
            }),
        )
        console.log(airdropToClaim)
    },
)

export const getAirdropsAvailableForClaim = createServerFn(
    "POST",
    async (data: { address: string }) => {
        const {address} = data
        const currentDate = new Date()
        const properAddress = Address.parse(address).toString()
        const airdropWalletsForClaim = await get.airdropWalletsForClaim.with({
            walletAddress: properAddress,
            claimed: false,
        })
        let airdropsForClaim: (AirdropToClaim & { userAmount: string })[] = []
        await Promise.all(
            airdropWalletsForClaim.map(async (airdrop) => {
                const airdropToClaim = await get.airdropToClaim.with({
                    id: airdrop.airdropToClaim,
                })
                if (!airdropToClaim) return;
                airdropsForClaim.push({...airdropToClaim, userAmount: airdrop.tokenAmount})
            }),
        )
        return airdropsForClaim.filter(
            (airdrop) =>
                airdrop.mainnet === isProduction &&
                new Date(airdrop.endDate) > currentDate,
        )
    },
)

export const setAirdropWalletForClaimAsClaimed = createServerFn(
    "POST",
    async (data: {
        airdropAddress: string
        walletAddress: string
        entries: {
            address: string
            amount: string
        }[]
    }) => {
        try {
            const {airdropAddress, walletAddress, entries} = data
            if (
                await isUserClaimedAirdrop(
                    Address.parse(walletAddress),
                    Address.parse(airdropAddress),
                    entries.map((entry) => ({
                        address: Address.parse(entry.address),
                        amount: BigInt(entry.amount),
                    })),
                )
            ) {
                const airdrop = await get.airdropToClaim.with({
                    airdropAddress,
                });
                if(!airdrop) throw new Error("Airdrop not found")
                console.warn("Wallet address", walletAddress, "already claimed")
                await set.airdropWalletsForClaim({
                    with: {
                        airdropToClaim: airdrop.id,
                        walletAddress: Address.parse(walletAddress).toString(),
                    },
                    to: {
                        claimed: true,
                    },
                })
            }
            return {error: false}
        } catch (err) {
            console.log(err, "err")
            return {error: true}
        }
    },
)

export const getEntriesForAirdrop = createServerFn(
    "POST",
    async (data: { airdropAddress: string }) => {
        const {airdropAddress} = data
        const entries = await get.airdropWalletsForClaim.with({
            airdropToClaim: {
                airdropAddress,
            },
        })
        // Sort entries by indexNumber in ascending order
        return entries.sort((a, b) => a.indexNumber - b.indexNumber)
    },
)


export const getAidropsDashboard = createServerFn(
    "GET",
    async ({ownerAddress}: { ownerAddress: string }) => {
        let addresses = await get.airdropsToClaim.with({
            //TODO: add endDate < currentDate
            ownerAddress
        });
        addresses = addresses.filter(e => e.endDate.getTime() > new Date().getTime());
        console.log(addresses.length, "addresses", addresses[0].endDate)
        const data = await Promise.all(
            addresses.map(async airdrop => {
                const walletForCurrAirdrop = await get.airdropWalletsForClaim.with({
                    airdropToClaim: airdrop.id,
                });
                const sumAmount = walletForCurrAirdrop.map(e => e.tokenAmount).reduce(
                    (acc, curr) => BigInt(acc) + BigInt(curr),
                    BigInt(0)
                );
                return {
                    claimed: walletForCurrAirdrop.filter(e => e.claimed).length,
                    total: walletForCurrAirdrop.length,
                    totalAmount: sumAmount.toString(),
                    ...airdrop
                }
            })
        );
        return data;
    }
)



//TODO: move to other file
async function isUserClaimedAirdrop(
    owner: Address,
    airdropAddress: Address,
    airdropWallets: AirdropEntry[],
): Promise<boolean> {
    const dict = generateEntriesDictionary(airdropWallets)
    const index = airdropWallets.findIndex((e) =>
        e.address.equals(owner!),
    )
    if (index === -1) throw new Error("You are not in the airdrop list")
    const airdrop = tonClient.open(Airdrop.createFromAddress(airdropAddress))
    const { helperCode } = await airdrop.getContractData()
    const proof = dict.generateMerkleProof([BigInt(index)])
    const helper = tonClient.open(
        AirdropHelper.createFromConfig(
            {
                airdrop: airdropAddress,
                index: BigInt(index),
                proofHash: proof.hash(),
            },
            helperCode,
        ),
    );

    return await helper.getClaimed()
}
export const tonClient = new TonClient({
    // @ts-ignore
    endpoint: import.meta.env.VITE_ENDPOINT!,
    // @ts-ignore
    apiKey: import.meta.env.VITE_ENDPOINT_API_KEY!,
})
