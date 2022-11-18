import { useEffect, useState } from "react";
import { Tournament } from "ballaum-common";

import { inspect } from "./inspect";

export const useTournament = (id: string): Tournament | undefined => {
    const [tournament, setTournament] = useState<Tournament>();

    useEffect(() => {
        inspect<Tournament>(`/tournaments/${id}`).then((tournament) => {
            if (tournament) {
                setTournament(tournament);
            }
        });
    }, [id]);

    return tournament;
};
