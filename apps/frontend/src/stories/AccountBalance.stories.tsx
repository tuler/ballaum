import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AccountBalance } from "../components/AccountBalance";
import { parseEther } from "@ethersproject/units";

export default {
    title: "Cartesi/AccountBalance",
    component: AccountBalance,
} as ComponentMeta<typeof AccountBalance>;

const Template: ComponentStory<typeof AccountBalance> = (args) => (
    <AccountBalance {...args} />
);

export const Simple = Template.bind({});
Simple.args = {
    address: "0x620Ae6e1daC65323485a0dfB5765A11Dac54BEfB",
    balance: parseEther("1.89"),
};

export const LongNumber = Template.bind({});
LongNumber.args = {
    address: "0x620Ae6e1daC65323485a0dfB5765A11Dac54BEfB",
    balance: parseEther("100000000.000000000000000001"),
};

export const Truncated = Template.bind({});
Truncated.args = {
    address: "0x620Ae6e1daC65323485a0dfB5765A11Dac54BEfB",
    balance: parseEther("100000000.123456789123456789"),
    digits: 4,
};

export const Commified = Template.bind({});
Commified.args = {
    address: "0x620Ae6e1daC65323485a0dfB5765A11Dac54BEfB",
    balance: parseEther("100000000.123456789123456789"),
    digits: 4,
    commify: true,
};
