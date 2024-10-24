import {Address, beginCell, Dictionary, Sender, toNano} from "@ton/core";
import {TonSplitter} from "~/lib/split/tact_TonSplitter";
import {tonClient} from "~/actions";
import {useProviderSender} from "~/lib/ton-sender";
import {JettonSplitter, storeForwardPayload} from "~/lib/split/tact_JettonSplitter";
import {SampleJetton} from "~/lib/ton-master";
import {JettonDefaultWallet, storeTokenTransfer} from "~/lib/ton-child";


export function useSplitterActions() {
    const sender = useProviderSender();
    return {
        splitTons: (recipients: ({ amount: bigint, address: Address })[]) => splitTons(sender, recipients),
        splitJettons: (jettonMaster: Address, receipts: ({
            amount: bigint,
            address: Address
        })[]) => splitJettons(sender, jettonMaster, receipts),
    }

}


export async function splitTons(sender: Sender, recipients: ({ amount: bigint, address: Address })[]) {

    const tonSplitter = tonClient.open(
        // await TonSplitter.fromInit(Address.parse('UQAvE-_RTX3_J6vb3WDCs_b4m6u2xLm6VyOdVtu6QshgJhZ2'), BigInt(Math.floor(Math.random() * 10)))
        TonSplitter.fromAddress(Address.parse('EQBRpKuA8zb91W1Q1Rz2ls57KqRdpNFD3zHH5isUUCtRSN-Y'))
    );
    const to = Dictionary.empty<bigint, Address>();
    recipients.forEach(recipient => to.set(recipient.amount, recipient.address));
    await tonSplitter.send(
        sender,
        {
            value: recipients.reduce((a, b) => a + b.amount + toNano('0.01'), 0n) + toNano('0.01'),
        },
        {
            $$type: 'SplitTons',
            to,
        },
    );
}

export async function splitJettons(sender: Sender, jettonMaster: Address, receipts: ({
    amount: bigint,
    address: Address
})[]) {
        const jettonSplitterAddress = Address.parse('EQB1n26A9vVc2OYtKSUjgE2OHbWpAql9gmnN5x-NqlCHkQ8Z');
    const master = tonClient.open(SampleJetton.fromAddress(jettonMaster));
    const childAddress = await master.getGetWalletAddress(sender.address!);
    const map: Dictionary<bigint, Address> = Dictionary.empty();
    receipts.forEach(recipient => map.set(recipient.amount, recipient.address));
    const childJetton = tonClient.open(JettonDefaultWallet.fromAddress(childAddress));
    const {balance} = await childJetton.getGetWalletData();
    if(balance < receipts.map(e => e.amount).reduce((a, b) => a + b, 0n)){
        throw new Error('Not enough funds');
    }
    await sender.send({
        to: childAddress,
        body: beginCell()
            .store(
                storeTokenTransfer({
                    $$type: 'TokenTransfer',
                    amount: receipts.map(e => e.amount).reduce((a, b) => a + b, 0n),
                    queryId: 0n,
                    custom_payload: null,
                    destination: jettonSplitterAddress,
                    forward_ton_amount: toNano('0.16') * BigInt(receipts.length),
                    forward_payload: beginCell()
                        .store(
                            storeForwardPayload({
                                $$type: 'ForwardPayload',
                                to: map,
                            }),
                        )
                        .endCell(),
                    response_destination: sender.address!,
                }),
            )
            .endCell(),
        value: toNano('0.16') * BigInt(receipts.length) + toNano('0.2'),
    });


}

