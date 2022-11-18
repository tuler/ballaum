import { useEffect, useState } from "react";
import { Match } from "ballaum-common";

import { inspect } from "./inspect";

export const useMatch = (
    tournamentId: string,
    matchId: string
): Match | undefined => {
    const [match, setMatch] = useState<Match>();

    useEffect(() => {
        inspect<Match>(`/tournaments/${tournamentId}/matches/${matchId}`).then(
            (match) => {
                if (match) {
                    setMatch(match);
                }
            }
        );
    }, [tournamentId, matchId]);

    return match;
};
