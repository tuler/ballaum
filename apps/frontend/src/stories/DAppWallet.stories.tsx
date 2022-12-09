import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { parseEther } from "@ethersproject/units";

import { DAppWalletComponent } from "../app/DAppWallet";

export default {
    title: "Cartesi/DAppWalletComponent",
    component: DAppWalletComponent,
} as ComponentMeta<typeof DAppWalletComponent>;

const Template: ComponentStory<typeof DAppWalletComponent> = (args) => (
    <DAppWalletComponent {...args} />
);

export const Default = Template.bind({});
Default.args = {
    dapp: "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A",
    balance: parseEther("0.5"),
};

export const LongNumber = Template.bind({});
LongNumber.args = {
    dapp: "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A",
    balance: parseEther("100000000.123456789123456789"),
};
