import theme from "../src/app/theme";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    chakra: {
        theme,
    },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
