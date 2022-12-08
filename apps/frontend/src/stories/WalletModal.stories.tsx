import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { parseEther } from "@ethersproject/units";
import DAppWalletModal from "../app/DAppWalletModal";

export default {
    title: "Cartesi/WalletModal",
    component: DAppWalletModal,
} as ComponentMeta<typeof DAppWalletModal>;

const Template: ComponentStory<typeof DAppWalletModal> = (args) => (
    <DAppWalletModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
    user: {
        address: "0x620Ae6e1daC65323485a0dfB5765A11Dac54BEfB",
        balance: parseEther("1.89"),
    },
    dapp: {
        address: "0xE8dc6065B256c14A4274498F75c57ba1b37e9659",
        balance: parseEther("5"),
    },
};
