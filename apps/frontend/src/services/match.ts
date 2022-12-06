import { useEffect, useState } from "react";
import { Tournament } from "ballaum-common";

import { inspect } from "./inspect";

export const useMatch = (
    tournamentId: string,
    matchId: string
): Tournament | undefined => {
    const [tournament, setTournament] = useState<Tournament>();

    useEffect(() => {
        inspect<Tournament>(
            `/tournaments/${tournamentId}/matches/${matchId}`
        ).then((tournament) => {
            if (tournament) {
                setTournament(tournament);
            }
        });
    }, [tournamentId, matchId]);

    return tournament;
};
