import { ABIInputCodec } from "./codec";

export * from "./codec";

// wallet codecs
export const EtherTransferCodec = new ABIInputCodec("Ether_Transfer", [
    "address",
    "uint256",
    "bytes",
]);
export const EtherWithdrawCodec = new ABIInputCodec("Ether_Withdraw", [
    "uint256",
]);
export const ERC20TransferCodec = new ABIInputCodec("ERC20_Transfer", [
    "address",
    "address",
    "uint256",
    "bytes",
]);
export const ERC20WithdrawCodec = new ABIInputCodec("ERC20_Withdraw", [
    "address",
    "uint256",
]);
