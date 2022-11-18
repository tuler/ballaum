import Image from "next/image";
import { FC } from "react";
import { Box } from "@chakra-ui/react";

type FlagProps = {
    country: string;
    size?: number;
};

export const Flag: FC<FlagProps> = ({ country, size }) => {
    size = size ?? 100;
    return (
        <Box borderWidth={1}>
            <Image
                src={`/flag/${country}.svg`}
                alt={country}
                width={size}
                height={size}
            />
        </Box>
    );
};
