"use client";

import { VStack } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import Header from "./Header";
import { Providers } from "./providers";

type Props = {
    children?: ReactNode;
};

const RootLayout: FC<Props> = ({ children }) => {
    return (
        <html lang="en">
            <head />
            <body>
                <Providers>
                    <VStack mt={5}>
                        <Header />
                        {children}
                    </VStack>
                </Providers>
            </body>
        </html>
    );
};

export default RootLayout;
