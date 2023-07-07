import { defaultAbiCoder } from "@ethersproject/abi";
import { getAddress, isAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import { Zero } from "@ethersproject/constants";
import { formatEther } from "@ethersproject/units";
import { CartesiDApp__factory, IERC20__factory } from "@cartesi/rollups";
import {
    EtherDepositCodec,
    EtherWithdrawCodec,
    ERC20DepositCodec,
    ERC20WithdrawCodec,
    AddressBook,
} from "@deroll/codec";

import { Route } from "./router/abi";
import { RequestHandlerResult, VoucherRequest } from "./types";

export type Wallet = {
    ether: BigNumber;
    erc20: Record<string, BigNumber>;
};

export class WalletApp {
    private dappAddress: string | null;
    private wallets: Record<string, Wallet>;
    public readonly depositEtherRoute: Route;
    public readonly depositERC20Route: Route;
    public readonly withdrawEtherRoute: Route;
    public readonly withdrawERC20Route: Route;

    constructor() {
        this.dappAddress = null;
        this.wallets = {};
        this.depositEtherRoute = new Route(
            EtherDepositCodec,
            ([address, amount], { msg_sender }) => {
                console.log(`deposit ${formatEther(amount)} eth to ${address}`);
                if (getAddress(msg_sender) !== AddressBook.EtherPortal) {
                    // must come from portal
                    console.error("msg_sender is not the EtherPortal");
                    return "reject";
                }
                this.depositEther(address, amount);
                console.log(
                    `completed deposit of ${formatEther(
                        amount
                    )} eth to ${address}: current balance is ${
                        this.wallet(address).ether
                    }`
                );
                return "accept";
            },
            AddressBook.EtherPortal
        );

        this.withdrawEtherRoute = new Route(
            EtherWithdrawCodec,
            async (
                [amount],
                { msg_sender },
                _route,
                dapp
            ): Promise<RequestHandlerResult> => {
                try {
                    console.log(
                        `withdraw ${formatEther(amount)} eth from ${msg_sender}`
                    );
                    const voucher = this.withdrawEther(msg_sender, amount);
                    console.log(`creating voucher ${JSON.stringify(voucher)}`);
                    await dapp.createVoucher(voucher);
                    // XXX: keep track of voucher ids in the wallet?
                    return "accept";
                } catch (e) {
                    console.error(e);
                    return "reject";
                }
            }
        );

        this.depositERC20Route = new Route(
            ERC20DepositCodec,
            ([address, token, amount], { msg_sender }) => {
                console.log(
                    `deposit ${formatEther(amount)} ${token} to ${address}`
                );
                if (getAddress(msg_sender) !== AddressBook.ERC20Portal) {
                    // must come from portal
                    console.error("msg_sender is not the ERC20Portal");
                    return "reject";
                }
                this.depositERC20(token, address, amount);
                console.log(
                    `completed deposit of ${formatEther(
                        amount
                    )} ${token} to ${address}: current balance is ${
                        this.wallet(address).erc20[token]
                    }`
                );
                return "accept";
            },
            AddressBook.ERC20Portal
        );

        this.withdrawERC20Route = new Route(
            ERC20WithdrawCodec,
            ([token, amount], { msg_sender }, _route, dapp) => {
                console.log(
                    `withdraw ${formatEther(
                        amount
                    )} ${token} from ${msg_sender}`
                );
                try {
                    const voucher = this.withdrawERC20(
                        token,
                        msg_sender,
                        amount
                    );
                    console.debug(`creating voucher ${voucher}`);
                    dapp.createVoucher(voucher);
                    // XXX: keep track of voucher ids in the wallet?
                    return "accept";
                } catch (e) {
                    return "reject";
                }
            }
        );
    }

    wallet(address: string): Wallet {
        // normalize address
        if (isAddress(address)) {
            address = getAddress(address);
        }

        // create if doesn't exist
        this.wallets[address] = this.wallets[address] ?? {
            ether: Zero,
            erc20: {},
        };
        return this.wallets[address];
    }

    setDAppAddress(dappAddress: string) {
        this.dappAddress = dappAddress;
    }

    depositEther(to: string, amount: BigNumber): void {
        const wallet = this.wallet(to);
        wallet.ether = wallet.ether.add(amount);
    }

    depositERC20(token: string, to: string, amount: BigNumber): void {
        const wallet = this.wallet(to);
        wallet.erc20[token] = wallet.erc20[token]
            ? wallet.erc20[token].add(amount)
            : amount;
    }

    transferEther(from: string, to: string, amount: BigNumber) {
        const walletFrom = this.wallet(from);
        const walletTo = this.wallet(to);

        if (walletFrom.ether.lt(amount)) {
            throw new Error(`insufficient balance of user ${from}`);
        }

        walletFrom.ether = walletFrom.ether.sub(amount);
        walletTo.ether = walletTo.ether.add(amount);
    }

    transferERC20(token: string, from: string, to: string, amount: BigNumber) {
        const walletFrom = this.wallet(from);
        const walletTo = this.wallet(to);

        if (!walletFrom.erc20[token] || walletFrom.erc20[token].lt(amount)) {
            throw new Error(
                `insufficient balance of user ${from} of token ${token}`
            );
        }

        walletFrom.erc20[token] = walletFrom.erc20[token].sub(amount);
        walletTo.erc20[token] = walletTo.erc20[token]
            ? walletTo.erc20[token].add(amount)
            : amount;
    }

    withdrawEther(address: string, amount: BigNumber): VoucherRequest {
        const wallet = this.wallet(address);

        // check balance
        if (wallet.ether.lt(amount)) {
            throw new Error(
                `insufficient balance of user ${address}: ${amount.toString()} > ${wallet.ether.toString()}`
            );
        }

        if (!this.dappAddress) {
            throw new Error(`undefined rollup dapp address`);
        }

        // reduce balance right away
        wallet.ether = wallet.ether.sub(amount);

        // create voucher
        const call = CartesiDApp__factory.createInterface().encodeFunctionData(
            "withdrawEther",
            [address, amount]
        );
        return {
            address: this.dappAddress,
            payload: call,
        };
    }

    withdrawERC20(
        token: string,
        address: string,
        amount: BigNumber
    ): VoucherRequest {
        const wallet = this.wallet(address);

        // check balance
        if (!wallet.erc20[token] || wallet.erc20[token].lt(amount)) {
            throw new Error(
                `insufficient balance of user ${address} of token ${token}: ${amount.toString()} > ${
                    wallet.erc20[token]?.toString() ?? "0"
                }`
            );
        }

        // reduce balance right away
        wallet.erc20[token] = wallet.erc20[token].sub(amount);

        const call = IERC20__factory.createInterface().encodeFunctionData(
            "transfer",
            [address, amount]
        );

        // create voucher to the IERC20 transfer
        return {
            address: token,
            payload: call,
        };
    }
}
