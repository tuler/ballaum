import Image from "next/image";
import { FC } from "react";
import { Box } from "@chakra-ui/react";

type TeamProps = {
    id: string;
    size?: number;
};

export const Team: FC<TeamProps> = ({ id, size }) => {
    size = size ?? 100;
    return (
        <Image src={`/teams/${id}.png`} alt={id} width={size} height={size} />
    );
};
