import { ABIInputCodec, ABIHeaderInputCodec } from "./codec";

export * from "./codec";

// wallet codecs
export const EtherDepositCodec = new ABIInputCodec(
    ["address", "uint256", "bytes"],
    "0xA89A3216F46F66486C9B794C1e28d3c44D59591e" // TODO: get address from rollups package
);
export const EtherWithdrawCodec = new ABIHeaderInputCodec(
    ["uint256", "bytes"],
    "wallet",
    "Ether_Withdraw"
);
export const ERC20DepositCodec = new ABIInputCodec(
    ["bool", "address", "address", "uint256", "bytes"],
    "0x4340ac4FcdFC5eF8d34930C96BBac2Af1301DF40" // TODO: get address from rollups package
);
export const ERC20WithdrawCodec = new ABIHeaderInputCodec(
    ["address", "uint256", "bytes"],
    "wallet",
    "ERC20_Withdraw"
);

// relay codecs
export const DAppAddressRelayCodec = new ABIInputCodec(
    ["address"],
    "0x8Bbc0e6daB541DF0A9f0bDdA5D41B3B08B081d55" // TODO: get address from rollups package
);
