import { beforeEach, describe, expect, test } from "@jest/globals";
import { AddressZero, Zero } from "@ethersproject/constants";
import { parseEther } from "@ethersproject/units";

import { DAppOutput } from "../src/dapp";
import { WalletApp } from "../src/wallet";
import { RequestMetadata } from "../src/types";
import { AddressBook } from "@deroll/codec";

describe("Wallet", () => {
    let dapp: DAppOutput;
    let wallet: WalletApp;
    const dappAddress = "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A";
    const account1 = AddressZero;
    const account2 = "0x18930e8a66a1DbE21D00581216789AAB7460Afd0";
    const token = "0x9d2133302B0beB040d2E86D1fbC78Da1Dea9Fa3e";

    beforeEach(() => {
        dapp = {
            createNotice: jest.fn(),
            createReport: jest.fn(),
            createVoucher: jest.fn(),
        };
        wallet = new WalletApp();
    });

    test("init", () => {
        expect(wallet.wallet(account1).ether).toBe(Zero);
        expect(wallet.wallet(account2).ether).toBe(Zero);
    });

    test("deposit ETH", () => {
        const amount = parseEther("1");

        // deposit 1
        wallet.depositEther(account1, amount);
        expect(wallet.wallet(account1).ether).toEqual(amount);

        // deposit 1 more
        wallet.depositEther(account1, amount);
        expect(wallet.wallet(account1).ether).toEqual(amount.mul(2));
    });

    test("deposit ETH non normalized address", () => {
        const amount = parseEther("1");
        const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        const account2 = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

        // deposit 1
        wallet.depositEther(account, amount);
        expect(wallet.wallet(account2).ether).toEqual(amount);
    });

    test("deposit ERC20", () => {
        const amount = parseEther("1");

        // deposit 1
        wallet.depositERC20(token, account1, amount);
        expect(wallet.wallet(account1).erc20[token]).toEqual(amount);

        // deposit 1 more
        wallet.depositERC20(token, account1, amount);
        expect(wallet.wallet(account1).erc20[token]).toEqual(amount.mul(2));
    });

    test("transfer ETH without balance", () => {
        const amount = parseEther("1");
        expect(() =>
            wallet.transferEther(account1, account2, amount)
        ).toThrowError(`insufficient balance of user ${account1}`);
    });

    test("transfer ETH", () => {
        const amount = parseEther("1");
        wallet.depositEther(account1, amount);
        expect(wallet.wallet(account1).ether).toEqual(amount);

        // transfer 1/4
        wallet.transferEther(account1, account2, amount.div(4));

        // 3/4 left
        expect(wallet.wallet(account1).ether).toEqual(amount.div(4).mul(3));

        // 1/4
        expect(wallet.wallet(account2).ether).toEqual(amount.div(4));
    });

    test("transfer ERC20 without balance", () => {
        const amount = parseEther("1");
        expect(() =>
            wallet.transferERC20(token, account1, account2, amount)
        ).toThrowError(
            `insufficient balance of user ${account1} of token ${token}`
        );
    });

    test("transfer ERC20", () => {
        const amount = parseEther("1");
        wallet.depositERC20(token, account1, amount);
        expect(wallet.wallet(account1).erc20[token]).toEqual(amount);

        // transfer 1/4
        wallet.transferERC20(token, account1, account2, amount.div(4));

        // 3/4 left
        expect(wallet.wallet(account1).erc20[token]).toEqual(
            amount.div(4).mul(3)
        );

        // 1/4
        expect(wallet.wallet(account2).erc20[token]).toEqual(amount.div(4));
    });

    test("withdraw ETH with no balance", () => {
        const amount = parseEther("1");
        expect(() => wallet.withdrawEther(account1, amount)).toThrowError(
            `insufficient balance of user ${account1}`
        );
    });

    test("withdraw ETH with undefined dapp address", () => {
        const amount = parseEther("1");
        wallet.depositEther(account1, amount);
        expect(() =>
            wallet.withdrawEther(account1, amount.div(4))
        ).toThrowError("undefined rollup dapp address");
    });

    test("withdraw ETH", () => {
        wallet.setDAppAddress(dappAddress);
        const amount = parseEther("1");
        wallet.depositEther(account1, amount);
        const voucher =
            "0x522f6815000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003782dace9d90000";

        // withdraw 1/4
        expect(wallet.withdrawEther(account1, amount.div(4))).toEqual({
            address: dappAddress,
            payload: voucher,
        });

        // 3/4 left
        expect(wallet.wallet(account1).ether).toEqual(amount.div(4).mul(3));
    });

    test("withdraw ERC20", () => {
        const amount = parseEther("1");
        wallet.depositERC20(token, account1, amount);
        const voucher =
            "0xa9059cbb000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003782dace9d90000";

        // withdraw 1/4
        expect(wallet.withdrawERC20(token, account1, amount.div(4))).toEqual({
            address: token,
            payload: voucher,
        });

        // 3/4 left
        expect(wallet.wallet(account1).erc20[token]).toEqual(
            amount.div(4).mul(3)
        );
    });

    test("withdraw ERC20 with no balance", () => {
        const amount = parseEther("1");
        expect(() =>
            wallet.withdrawERC20(token, account1, amount)
        ).toThrowError(
            `insufficient balance of user ${account1} of token ${token}: ${amount.toString()} > ${
                wallet.wallet(account1).erc20[token]?.toString() ?? "0"
            }`
        );
    });

    test("depositEtherRoute reject", () => {
        const amount = parseEther("1");
        const metadata: RequestMetadata = {
            block_number: 0,
            epoch_index: 0,
            input_index: 0,
            msg_sender: account2,
            timestamp: 0,
        };
        expect(
            wallet.depositEtherRoute.handler(
                [account1, amount],
                metadata,
                wallet.depositEtherRoute,
                dapp
            )
        ).toEqual("reject");
        expect(wallet.wallet(account1).ether).toEqual(Zero);
    });

    test("depositEtherRoute", () => {
        const amount = parseEther("1");
        const metadata: RequestMetadata = {
            block_number: 0,
            epoch_index: 0,
            input_index: 0,
            msg_sender: AddressBook.EtherPortal,
            timestamp: 0,
        };
        expect(
            wallet.depositEtherRoute.handler(
                [account1, amount],
                metadata,
                wallet.depositEtherRoute,
                dapp
            )
        ).toEqual("accept");
        expect(wallet.wallet(account1).ether).toEqual(amount);
    });

    test("depositERC20Route reject", () => {
        const amount = parseEther("1");
        const metadata: RequestMetadata = {
            block_number: 0,
            epoch_index: 0,
            input_index: 0,
            msg_sender: account2,
            timestamp: 0,
        };
        expect(
            wallet.depositERC20Route.handler(
                [account1, token, amount],
                metadata,
                wallet.depositERC20Route,
                dapp
            )
        ).toEqual("reject");
        expect(wallet.wallet(account1).erc20[token]).toEqual(undefined);
    });

    test("depositERC20Route", () => {
        const amount = parseEther("1");
        const metadata: RequestMetadata = {
            block_number: 0,
            epoch_index: 0,
            input_index: 0,
            msg_sender: AddressBook.ERC20Portal,
            timestamp: 0,
        };
        expect(
            wallet.depositERC20Route.handler(
                [account1, token, amount],
                metadata,
                wallet.depositERC20Route,
                dapp
            )
        ).toEqual("accept");
        expect(wallet.wallet(account1).erc20[token]).toEqual(amount);
    });

    test("withdrawEtherRoute reject no balance", async () => {
        wallet.setDAppAddress(dappAddress);
        const amount = parseEther("1");
        const metadata: RequestMetadata = {
            block_number: 0,
            epoch_index: 0,
            input_index: 0,
            msg_sender: account1,
            timestamp: 0,
        };
        expect(
            await wallet.withdrawEtherRoute.handler(
                [amount],
                metadata,
                wallet.withdrawEtherRoute,
                dapp
            )
        ).toEqual("reject");
        expect(wallet.wallet(account1).ether).toEqual(Zero);
    });

    test("withdrawEtherRoute", async () => {
        wallet.setDAppAddress(dappAddress);
        const amount = parseEther("1");
        wallet.depositEther(account1, amount);
        const metadata: RequestMetadata = {
            block_number: 0,
            epoch_index: 0,
            input_index: 0,
            msg_sender: account1,
            timestamp: 0,
        };
        expect(
            await wallet.withdrawEtherRoute.handler(
                [amount],
                metadata,
                wallet.withdrawEtherRoute,
                dapp
            )
        ).toEqual("accept");
        expect(wallet.wallet(account1).ether).toEqual(Zero);
    });

    test("withdrawERC20Route reject no balance", async () => {
        wallet.setDAppAddress(dappAddress);
        const amount = parseEther("1");
        const metadata: RequestMetadata = {
            block_number: 0,
            epoch_index: 0,
            input_index: 0,
            msg_sender: account1,
            timestamp: 0,
        };
        expect(
            await wallet.withdrawERC20Route.handler(
                [token, amount],
                metadata,
                wallet.withdrawERC20Route,
                dapp
            )
        ).toEqual("reject");
        expect(wallet.wallet(account1).erc20[token]).toEqual(undefined);
    });

    test("withdrawERC20Route", async () => {
        const amount = parseEther("1");
        wallet.depositERC20(token, account1, amount);
        const metadata: RequestMetadata = {
            block_number: 0,
            epoch_index: 0,
            input_index: 0,
            msg_sender: account1,
            timestamp: 0,
        };
        expect(
            await wallet.withdrawERC20Route.handler(
                [token, amount],
                metadata,
                wallet.withdrawERC20Route,
                dapp
            )
        ).toEqual("accept");
        expect(wallet.wallet(account1).erc20[token]).toEqual(Zero);
    });
});
