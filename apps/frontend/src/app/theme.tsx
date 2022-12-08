import { defineStyle, extendTheme } from "@chakra-ui/react";
import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import {
    createMultiStyleConfigHelpers,
    defineStyleConfig,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);

// customize modal border radius, to match rainbow wallet modal
const baseStyle = definePartsStyle({
    dialog: {
        borderRadius: "3xl",
    },
});

const modalTheme = defineMultiStyleConfig({
    baseStyle,
});

// customize button theme
const buttonTheme = defineStyleConfig({
    variants: { outline: defineStyle({ borderRadius: "xl" }) },
});

const theme = extendTheme({
    components: { Modal: modalTheme, Button: buttonTheme },
});

export default theme;
