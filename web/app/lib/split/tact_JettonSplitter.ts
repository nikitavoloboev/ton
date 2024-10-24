import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return {$$type: 'StateInit' as const, code: _code, data: _data};
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return {$$type: 'StateInit' as const, code: _code, data: _data};
}

function loadGetterTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return {$$type: 'StateInit' as const, code: _code, data: _data};
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(8);
    let _address = sc_0.loadUintBig(256);
    return {$$type: 'StdAddress' as const, workchain: _workchain, address: _address};
}

function loadTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return {$$type: 'StdAddress' as const, workchain: _workchain, address: _address};
}

function loadGetterTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return {$$type: 'StdAddress' as const, workchain: _workchain, address: _address};
}

function storeTupleStdAddress(source: StdAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(32);
    let _address = sc_0.loadRef().asSlice();
    return {$$type: 'VarAddress' as const, workchain: _workchain, address: _address};
}

function loadTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return {$$type: 'VarAddress' as const, workchain: _workchain, address: _address};
}

function loadGetterTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return {$$type: 'VarAddress' as const, workchain: _workchain, address: _address};
}

function storeTupleVarAddress(source: VarAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return {$$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw};
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return {$$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw};
}

function loadGetterTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return {$$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw};
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        } else {
            b_0.storeBit(false);
        }
        if (src.code !== null && src.code !== undefined) {
            b_0.storeBit(true).storeRef(src.code);
        } else {
            b_0.storeBit(false);
        }
        if (src.data !== null && src.data !== undefined) {
            b_0.storeBit(true).storeRef(src.data);
        } else {
            b_0.storeBit(false);
        }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return {
        $$type: 'SendParameters' as const,
        bounce: _bounce,
        to: _to,
        value: _value,
        mode: _mode,
        body: _body,
        code: _code,
        data: _data
    };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return {
        $$type: 'SendParameters' as const,
        bounce: _bounce,
        to: _to,
        value: _value,
        mode: _mode,
        body: _body,
        code: _code,
        data: _data
    };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return {
        $$type: 'SendParameters' as const,
        bounce: _bounce,
        to: _to,
        value: _value,
        mode: _mode,
        body: _body,
        code: _code,
        data: _data
    };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    return {$$type: 'Deploy' as const, queryId: _queryId};
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return {$$type: 'Deploy' as const, queryId: _queryId};
}

function loadGetterTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return {$$type: 'Deploy' as const, queryId: _queryId};
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    return {$$type: 'DeployOk' as const, queryId: _queryId};
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return {$$type: 'DeployOk' as const, queryId: _queryId};
}

function loadGetterTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return {$$type: 'DeployOk' as const, queryId: _queryId};
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return {$$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback};
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return {$$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback};
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return {$$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback};
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return {$$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner};
}

function loadTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return {$$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner};
}

function loadGetterTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return {$$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner};
}

function storeTupleChangeOwner(source: ChangeOwner) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return {$$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner};
}

function loadTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return {$$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner};
}

function loadGetterTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return {$$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner};
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type TokenNotification = {
    $$type: 'TokenNotification';
    queryId: bigint;
    amount: bigint;
    from: Address;
    forward_payload: Slice;
}

export function storeTokenNotification(src: TokenNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _forward_payload = sc_0;
    return {
        $$type: 'TokenNotification' as const,
        queryId: _queryId,
        amount: _amount,
        from: _from,
        forward_payload: _forward_payload
    };
}

function loadTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return {
        $$type: 'TokenNotification' as const,
        queryId: _queryId,
        amount: _amount,
        from: _from,
        forward_payload: _forward_payload
    };
}

function loadGetterTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return {
        $$type: 'TokenNotification' as const,
        queryId: _queryId,
        amount: _amount,
        from: _from,
        forward_payload: _forward_payload
    };
}

function storeTupleTokenNotification(source: TokenNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserTokenNotification(): DictionaryValue<TokenNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenNotification(src.loadRef().beginParse());
        }
    }
}

export type COINS = {
    $$type: 'COINS';
    amount: bigint;
}

export function storeCOINS(src: COINS) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.amount);
    };
}

export function loadCOINS(slice: Slice) {
    let sc_0 = slice;
    let _amount = sc_0.loadCoins();
    return {$$type: 'COINS' as const, amount: _amount};
}

function loadTupleCOINS(source: TupleReader) {
    let _amount = source.readBigNumber();
    return {$$type: 'COINS' as const, amount: _amount};
}

function loadGetterTupleCOINS(source: TupleReader) {
    let _amount = source.readBigNumber();
    return {$$type: 'COINS' as const, amount: _amount};
}

function storeTupleCOINS(source: COINS) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserCOINS(): DictionaryValue<COINS> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCOINS(src)).endCell());
        },
        parse: (src) => {
            return loadCOINS(src.loadRef().beginParse());
        }
    }
}

export type ForwardPayload = {
    $$type: 'ForwardPayload';
    to: Dictionary<Address, COINS>;
}

export function storeForwardPayload(src: ForwardPayload) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeDict(src.to, Dictionary.Keys.Address(), dictValueParserCOINS());
    };
}

export function loadForwardPayload(slice: Slice) {
    let sc_0 = slice;
    let _to = Dictionary.load(Dictionary.Keys.Address(), dictValueParserCOINS(), sc_0);
    return {$$type: 'ForwardPayload' as const, to: _to};
}

function loadTupleForwardPayload(source: TupleReader) {
    let _to = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserCOINS(), source.readCellOpt());
    return {$$type: 'ForwardPayload' as const, to: _to};
}

function loadGetterTupleForwardPayload(source: TupleReader) {
    let _to = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserCOINS(), source.readCellOpt());
    return {$$type: 'ForwardPayload' as const, to: _to};
}

function storeTupleForwardPayload(source: ForwardPayload) {
    let builder = new TupleBuilder();
    builder.writeCell(source.to.size > 0 ? beginCell().storeDictDirect(source.to, Dictionary.Keys.Address(), dictValueParserCOINS()).endCell() : null);
    return builder.build();
}

function dictValueParserForwardPayload(): DictionaryValue<ForwardPayload> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeForwardPayload(src)).endCell());
        },
        parse: (src) => {
            return loadForwardPayload(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    queryId: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Slice;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) {
            b_0.storeBit(true).storeRef(src.custom_payload);
        } else {
            b_0.storeBit(false);
        }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTokenTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0;
    return {
        $$type: 'TokenTransfer' as const,
        queryId: _queryId,
        amount: _amount,
        destination: _destination,
        response_destination: _response_destination,
        custom_payload: _custom_payload,
        forward_ton_amount: _forward_ton_amount,
        forward_payload: _forward_payload
    };
}

function loadTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return {
        $$type: 'TokenTransfer' as const,
        queryId: _queryId,
        amount: _amount,
        destination: _destination,
        response_destination: _response_destination,
        custom_payload: _custom_payload,
        forward_ton_amount: _forward_ton_amount,
        forward_payload: _forward_payload
    };
}

function loadGetterTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return {
        $$type: 'TokenTransfer' as const,
        queryId: _queryId,
        amount: _amount,
        destination: _destination,
        response_destination: _response_destination,
        custom_payload: _custom_payload,
        forward_ton_amount: _forward_ton_amount,
        forward_payload: _forward_payload
    };
}

function storeTupleTokenTransfer(source: TokenTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type JettonSplitter$Data = {
    $$type: 'JettonSplitter$Data';
    owner: Address;
}

export function storeJettonSplitter$Data(src: JettonSplitter$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
    };
}

export function loadJettonSplitter$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    return {$$type: 'JettonSplitter$Data' as const, owner: _owner};
}

function loadTupleJettonSplitter$Data(source: TupleReader) {
    let _owner = source.readAddress();
    return {$$type: 'JettonSplitter$Data' as const, owner: _owner};
}

function loadGetterTupleJettonSplitter$Data(source: TupleReader) {
    let _owner = source.readAddress();
    return {$$type: 'JettonSplitter$Data' as const, owner: _owner};
}

function storeTupleJettonSplitter$Data(source: JettonSplitter$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserJettonSplitter$Data(): DictionaryValue<JettonSplitter$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonSplitter$Data(src)).endCell());
        },
        parse: (src) => {
            return loadJettonSplitter$Data(src.loadRef().beginParse());
        }
    }
}

type JettonSplitter_init_args = {
    $$type: 'JettonSplitter_init_args';
    owner: Address;
    randomId: bigint;
}

function initJettonSplitter_init_args(src: JettonSplitter_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.randomId, 257);
    };
}

async function JettonSplitter_init(owner: Address, randomId: bigint) {
    const __code = Cell.fromBase64('te6ccgECEwEABA4AART/APSkE/S88sgLAQIBYgIDAs7QAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxZ2zzy4ILI+EMBzH8BygABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8Wye1UEAQCASAODwO07aLt+wGSMH/gcCHXScIflTAg1wsf3iCCEHNi0Jy64wIgghCUapi2uo6oMNMfAYIQlGqYtrry4IHTPwExyAGCEK/5D1dYyx/LP8n4QgFwbds8f+DAAJEw4w1wBQYHAeww0x8BghBzYtCcuvLggdM/+gD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIVBMDECNsFHAB9AQBAdEggQEL9INvpSCREpUxbTJtAeKQiugQNF8EMoIAuykBwv/y9IIAt8L4QW8kE18DWL7y9PgP8gB/CAKSbW0ibrOZWyBu8tCAbyIBkTLi+EFvJBNfA/gnbxABoYIImJaAuY6VggiYloBw+wIQJHADBIEAglAj2zww4BAkcAMEgEJQI9s8MAwMAoT5AYLwCVGQGUruYRzolcVQOt+F/YZN55BXRhQvYI0+svqtFOS6jxrbPPgnbxCCCJiWgKFSEHBZcG1tbds8MH/bMeALDAPKIG6SMG2X0PoAATFvAeIgbvLQgG8hUVWhA4IQCYloAKCI0MjJ+EKCEAjw0YBwcnEtUUkQTlE9SDMJyFVg2zzJXiFJkBAkECNtbds8MIEBCyICWfR0b6UglALUMFiVMW0ybQHiEEYJCgwAFgAAAABzcGxpdGVyAMiCEA+KfqVQCMsfFss/UAT6Algg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WIW6zlX8BygDMlHAyygDiAfoCAc8WABL4QlIQxwXy4IQByshxAcoBUAcBygBwAcoCUAUg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxZQA/oCcAHKaCNus5F/kyRus+KXMzMBcAHKAOMNIW6znH8BygABIG7y0IABzJUxcAHKAOLJAfsIDQCYfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzAIPviju2ebZ4YwQEQARvhX3aiaGkAAMAcbtRNDUAfhj0gABjiD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIMeD4KNcLCoMJuvLgifpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wBZAtEB2zwSAAIgAAIw');
    const __system = Cell.fromBase64('te6cckECFQEABBgAAQHAAQEFoWCRAgEU/wD0pBP0vPLICwMCAWIEDwLO0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8Wds88uCCyPhDAcx/AcoAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsntVBEFA7Ttou37AZIwf+BwIddJwh+VMCDXCx/eIIIQc2LQnLrjAiCCEJRqmLa6jqgw0x8BghCUapi2uvLggdM/ATHIAYIQr/kPV1jLH8s/yfhCAXBt2zx/4MAAkTDjDXAGCgsB7DDTHwGCEHNi0Jy68uCB0z/6APpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUEwMQI2wUcAH0BAEB0SCBAQv0g2+lIJESlTFtMm0B4pCK6BA0XwQyggC7KQHC//L0ggC3wvhBbyQTXwNYvvL0+A/yAH8HA8ogbpIwbZfQ+gABMW8B4iBu8tCAbyFRVaEDghAJiWgAoIjQyMn4QoIQCPDRgHBycS1RSRBOUT1IMwnIVWDbPMleIUmQECQQI21t2zwwgQELIgJZ9HRvpSCUAtQwWJUxbTJtAeIQRggJDQAWAAAAAHNwbGl0ZXIAyIIQD4p+pVAIyx8Wyz9QBPoCWCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYhbrOVfwHKAMyUcDLKAOIB+gIBzxYCkm1tIm6zmVsgbvLQgG8iAZEy4vhBbyQTXwP4J28QAaGCCJiWgLmOlYIImJaAcPsCECRwAwSBAIJQI9s8MOAQJHADBIBCUCPbPDANDQKE+QGC8AlRkBlK7mEc6JXFUDrfhf2GTeeQV0YUL2CNPrL6rRTkuo8a2zz4J28QggiYloChUhBwWXBtbW3bPDB/2zHgDA0AEvhCUhDHBfLghAHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wgOAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAgEgEBQCD74o7tnm2eGMERMBxu1E0NQB+GPSAAGOIPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4Igx4Pgo1wsKgwm68uCJ+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXAFkC0QHbPBIAAjAAAiAAEb4V92omhpAADJkx4mA=');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initJettonSplitter_init_args({$$type: 'JettonSplitter_init_args', owner, randomId})(builder);
    const __data = builder.endCell();
    return {code: __code, data: __data};
}

const JettonSplitter_errors: { [key: number]: { message: string } } = {
    2: {message: `Stack underflow`},
    3: {message: `Stack overflow`},
    4: {message: `Integer overflow`},
    5: {message: `Integer out of expected range`},
    6: {message: `Invalid opcode`},
    7: {message: `Type check error`},
    8: {message: `Cell overflow`},
    9: {message: `Cell underflow`},
    10: {message: `Dictionary error`},
    11: {message: `'Unknown' error`},
    12: {message: `Fatal error`},
    13: {message: `Out of gas error`},
    14: {message: `Virtualization error`},
    32: {message: `Action list is invalid`},
    33: {message: `Action list is too long`},
    34: {message: `Action is invalid or not supported`},
    35: {message: `Invalid source address in outbound message`},
    36: {message: `Invalid destination address in outbound message`},
    37: {message: `Not enough TON`},
    38: {message: `Not enough extra-currencies`},
    39: {message: `Outbound message does not fit into a cell after rewriting`},
    40: {message: `Cannot process a message`},
    41: {message: `Library reference is null`},
    42: {message: `Library change action error`},
    43: {message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree`},
    50: {message: `Account state size exceeded limits`},
    128: {message: `Null reference exception`},
    129: {message: `Invalid serialization prefix`},
    130: {message: `Invalid incoming message`},
    131: {message: `Constraints error`},
    132: {message: `Access denied`},
    133: {message: `Contract stopped`},
    134: {message: `Invalid argument`},
    135: {message: `Code of a contract was not found`},
    136: {message: `Invalid address`},
    137: {message: `Masterchain support is not enabled for this contract`},
    47042: {message: `Not enough tons sent`},
    47913: {message: `Not enough jettons sent`},
}

const JettonSplitter_types: ABIType[] = [
    {
        "name": "StateInit",
        "header": null,
        "fields": [{"name": "code", "type": {"kind": "simple", "type": "cell", "optional": false}}, {
            "name": "data",
            "type": {"kind": "simple", "type": "cell", "optional": false}
        }]
    },
    {
        "name": "StdAddress",
        "header": null,
        "fields": [{
            "name": "workchain",
            "type": {"kind": "simple", "type": "int", "optional": false, "format": 8}
        }, {"name": "address", "type": {"kind": "simple", "type": "uint", "optional": false, "format": 256}}]
    },
    {
        "name": "VarAddress",
        "header": null,
        "fields": [{
            "name": "workchain",
            "type": {"kind": "simple", "type": "int", "optional": false, "format": 32}
        }, {"name": "address", "type": {"kind": "simple", "type": "slice", "optional": false}}]
    },
    {
        "name": "Context",
        "header": null,
        "fields": [{
            "name": "bounced",
            "type": {"kind": "simple", "type": "bool", "optional": false}
        }, {"name": "sender", "type": {"kind": "simple", "type": "address", "optional": false}}, {
            "name": "value",
            "type": {"kind": "simple", "type": "int", "optional": false, "format": 257}
        }, {"name": "raw", "type": {"kind": "simple", "type": "slice", "optional": false}}]
    },
    {
        "name": "SendParameters",
        "header": null,
        "fields": [{"name": "bounce", "type": {"kind": "simple", "type": "bool", "optional": false}}, {
            "name": "to",
            "type": {"kind": "simple", "type": "address", "optional": false}
        }, {
            "name": "value",
            "type": {"kind": "simple", "type": "int", "optional": false, "format": 257}
        }, {
            "name": "mode",
            "type": {"kind": "simple", "type": "int", "optional": false, "format": 257}
        }, {"name": "body", "type": {"kind": "simple", "type": "cell", "optional": true}}, {
            "name": "code",
            "type": {"kind": "simple", "type": "cell", "optional": true}
        }, {"name": "data", "type": {"kind": "simple", "type": "cell", "optional": true}}]
    },
    {
        "name": "Deploy",
        "header": 2490013878,
        "fields": [{"name": "queryId", "type": {"kind": "simple", "type": "uint", "optional": false, "format": 64}}]
    },
    {
        "name": "DeployOk",
        "header": 2952335191,
        "fields": [{"name": "queryId", "type": {"kind": "simple", "type": "uint", "optional": false, "format": 64}}]
    },
    {
        "name": "FactoryDeploy",
        "header": 1829761339,
        "fields": [{
            "name": "queryId",
            "type": {"kind": "simple", "type": "uint", "optional": false, "format": 64}
        }, {"name": "cashback", "type": {"kind": "simple", "type": "address", "optional": false}}]
    },
    {
        "name": "ChangeOwner",
        "header": 2174598809,
        "fields": [{
            "name": "queryId",
            "type": {"kind": "simple", "type": "uint", "optional": false, "format": 64}
        }, {"name": "newOwner", "type": {"kind": "simple", "type": "address", "optional": false}}]
    },
    {
        "name": "ChangeOwnerOk",
        "header": 846932810,
        "fields": [{
            "name": "queryId",
            "type": {"kind": "simple", "type": "uint", "optional": false, "format": 64}
        }, {"name": "newOwner", "type": {"kind": "simple", "type": "address", "optional": false}}]
    },
    {
        "name": "TokenNotification",
        "header": 1935855772,
        "fields": [{
            "name": "queryId",
            "type": {"kind": "simple", "type": "uint", "optional": false, "format": 64}
        }, {
            "name": "amount",
            "type": {"kind": "simple", "type": "uint", "optional": false, "format": "coins"}
        }, {
            "name": "from",
            "type": {"kind": "simple", "type": "address", "optional": false}
        }, {
            "name": "forward_payload",
            "type": {"kind": "simple", "type": "slice", "optional": false, "format": "remainder"}
        }]
    },
    {
        "name": "COINS",
        "header": null,
        "fields": [{"name": "amount", "type": {"kind": "simple", "type": "uint", "optional": false, "format": "coins"}}]
    },
    {
        "name": "ForwardPayload",
        "header": null,
        "fields": [{"name": "to", "type": {"kind": "dict", "key": "address", "value": "COINS", "valueFormat": "ref"}}]
    },
    {
        "name": "TokenTransfer",
        "header": 260734629,
        "fields": [{
            "name": "queryId",
            "type": {"kind": "simple", "type": "uint", "optional": false, "format": 64}
        }, {
            "name": "amount",
            "type": {"kind": "simple", "type": "uint", "optional": false, "format": "coins"}
        }, {
            "name": "destination",
            "type": {"kind": "simple", "type": "address", "optional": false}
        }, {
            "name": "response_destination",
            "type": {"kind": "simple", "type": "address", "optional": false}
        }, {
            "name": "custom_payload",
            "type": {"kind": "simple", "type": "cell", "optional": true}
        }, {
            "name": "forward_ton_amount",
            "type": {"kind": "simple", "type": "uint", "optional": false, "format": "coins"}
        }, {
            "name": "forward_payload",
            "type": {"kind": "simple", "type": "slice", "optional": false, "format": "remainder"}
        }]
    },
    {
        "name": "JettonSplitter$Data",
        "header": null,
        "fields": [{"name": "owner", "type": {"kind": "simple", "type": "address", "optional": false}}]
    },
]

const JettonSplitter_getters: ABIGetter[] = [
    {"name": "owner", "arguments": [], "returnType": {"kind": "simple", "type": "address", "optional": false}},
]

export const JettonSplitter_getterMapping: { [key: string]: string } = {
    'owner': 'getOwner',
}

const JettonSplitter_receivers: ABIReceiver[] = [
    {"receiver": "internal", "message": {"kind": "typed", "type": "TokenNotification"}},
    {"receiver": "internal", "message": {"kind": "text", "text": "withdraw"}},
    {"receiver": "internal", "message": {"kind": "typed", "type": "Deploy"}},
]

export class JettonSplitter implements Contract {

    static async init(owner: Address, randomId: bigint) {
        return await JettonSplitter_init(owner, randomId);
    }

    static async fromInit(owner: Address, randomId: bigint) {
        const init = await JettonSplitter_init(owner, randomId);
        const address = contractAddress(0, init);
        return new JettonSplitter(address, init);
    }

    static fromAddress(address: Address) {
        return new JettonSplitter(address);
    }

    readonly address: Address;
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types: JettonSplitter_types,
        getters: JettonSplitter_getters,
        receivers: JettonSplitter_receivers,
        errors: JettonSplitter_errors,
    };

    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }

    async send(provider: ContractProvider, via: Sender, args: {
        value: bigint,
        bounce?: boolean | null | undefined
    }, message: TokenNotification | 'withdraw' | Deploy) {

        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenNotification') {
            body = beginCell().store(storeTokenNotification(message)).endCell();
        }
        if (message === 'withdraw') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) {
            throw new Error('Invalid message type');
        }

        await provider.internal(via, {...args, body: body});

    }

    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }

}