import { AddressBook } from "./addressBook";
import { ABIInputCodec, ABIHeaderInputCodec } from "./codec";

export * from "./addressBook";
export * from "./codec";
export * from "./unpack";

// wallet codecs
export const EtherDepositCodec = new ABIInputCodec(
    ["address", "uint256", "bytes"],
    true,
    AddressBook.EtherPortal
);
export const EtherWithdrawCodec = new ABIHeaderInputCodec(
    ["uint256", "bytes"],
    true,
    "wallet",
    "Ether_Withdraw"
);
export const ERC20DepositCodec = new ABIInputCodec(
    ["bool", "address", "address", "uint256", "bytes"],
    true,
    AddressBook.ERC20Portal
);
export const ERC20WithdrawCodec = new ABIHeaderInputCodec(
    ["address", "uint256", "bytes"],
    true,
    "wallet",
    "ERC20_Withdraw"
);

// relay codecs
export const DAppAddressRelayCodec = new ABIInputCodec(
    ["address"],
    true,
    AddressBook.DAppAddressRelay
);
