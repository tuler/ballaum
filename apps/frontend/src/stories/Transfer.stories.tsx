import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { parseEther } from "viem";

import { Transfer } from "../components/WalletModal";

export default {
    title: "Cartesi/Transfer",
    component: Transfer,
} as ComponentMeta<typeof Transfer>;

const Template: ComponentStory<typeof Transfer> = (args) => (
    <Transfer {...args} />
);

export const Default = Template.bind({});
Default.args = {
    user: {
        address: "0x620Ae6e1daC65323485a0dfB5765A11Dac54BEfB",
        balance: parseEther("1.89"),
    },
    dapp: {
        address: "0xE8dc6065B256c14A4274498F75c57ba1b37e9659",
        balance: parseEther("0.5"),
    },
};

export const Unbalanced = Template.bind({});
Unbalanced.args = {
    user: {
        address: "0x620Ae6e1daC65323485a0dfB5765A11Dac54BEfB",
        balance: parseEther("1.89"),
    },
    dapp: {
        address: "0xE8dc6065B256c14A4274498F75c57ba1b37e9659",
        balance: 1n,
    },
};

export const Loading = Template.bind({});
Loading.args = {
    user: {
        address: "0x620Ae6e1daC65323485a0dfB5765A11Dac54BEfB",
        balance: parseEther("1.89"),
    },
    dapp: {
        address: "0xE8dc6065B256c14A4274498F75c57ba1b37e9659",
        balance: parseEther("0.5"),
    },
    isLoading: true,
};
