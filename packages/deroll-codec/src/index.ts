import { AddressBook } from "./addressBook";
import { ABIInputCodec } from "./codec";

export * from "./addressBook";
export * from "./codec";
export * from "./unpack";

// wallet codecs
export const EtherDepositCodec = new ABIInputCodec(
    ["address", "uint256", "bytes"],
    true
);
export const EtherWithdrawCodec = new ABIInputCodec(
    ["uint256", "bytes"],
    true,
    ["wallet", "Ether_Withdraw"]
);
export const ERC20DepositCodec = new ABIInputCodec(
    ["bool", "address", "address", "uint256", "bytes"],
    true
);
export const ERC20WithdrawCodec = new ABIInputCodec(
    ["address", "uint256", "bytes"],
    true,
    ["wallet", "ERC20_Withdraw"]
);

// relay codecs
export const DAppAddressRelayCodec = new ABIInputCodec(["address"], true);
