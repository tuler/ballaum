import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { WalletTabs } from "../components/WalletModal";
import { parseEther } from "@ethersproject/units";

export default {
    title: "Cartesi/WalletTabs",
    component: WalletTabs,
} as ComponentMeta<typeof WalletTabs>;

const Template: ComponentStory<typeof WalletTabs> = (args) => (
    <WalletTabs {...args} />
);

export const Default = Template.bind({});
Default.args = {
    user: {
        address: "0x620Ae6e1daC65323485a0dfB5765A11Dac54BEfB",
        balance: parseEther("11.711023072592350768"),
    },
    dapp: {
        address: "0xE8dc6065B256c14A4274498F75c57ba1b37e9659",
        balance: parseEther("5"),
    },
};
