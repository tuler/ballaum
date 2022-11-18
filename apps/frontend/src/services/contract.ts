import { useSigner } from "wagmi";
import {
    ERC20PortalFacet,
    ERC20PortalFacet__factory,
    EtherPortalFacet,
    EtherPortalFacet__factory,
} from "@cartesi/rollups";
import { useEffect, useState } from "react";

export const useEtherPortal = (dapp: string) => {
    const { data: signer } = useSigner();
    const [contract, setContract] = useState<EtherPortalFacet>();
    useEffect(() => {
        if (signer) {
            setContract(EtherPortalFacet__factory.connect(dapp, signer));
        }
    }, [dapp, signer]);
    return contract;
};

export const useERC20Portal = (dapp: string) => {
    const { data: signer } = useSigner();
    const [contract, setContract] = useState<ERC20PortalFacet>();
    useEffect(() => {
        if (signer) {
            setContract(ERC20PortalFacet__factory.connect(dapp, signer));
        }
    }, [dapp, signer]);
    return contract;
};
