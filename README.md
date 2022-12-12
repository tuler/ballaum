# ballaum

Ballaum (aka Bolão) is a decentralized betting system for sports tournaments. It's currently supporting the 2022 Qatar World Cup, but it's extensible to any kind of sporting event with scores.

It is implemented using [Cartesi](https://cartesi.io) technology, composed of a backend implemented in Typescript, and a frontend also implemented in Typescript using NextJS.

Ballaum is deployed to the Goerli testnet, and open to anyone to participate. To submit your first match prediction you must first deposit some amount of GoerliETH to the DApp wallet. The participation fee is set to 0.01 ETH, and is withdrawn from your DApp wallet on your first prediction submission.

The tournament results are managed by an certain ethereum account, in this case **me**, the developer. So any participant must trust me as I set the match results.

Participants send predictions for each match of the tournament any time before the match starts. The tournament manager then send the results of completed matches, and can add new matches (like finals). For each match participants score points like so:

Exact result: 25 points
Correct winner, score of winner: 18 points
Correct winner, correct difference of goals: 15 points
Correct winner, score of loser: 12 points
Correct winner, but none of the above: 10 points
Tie, but not correct score: 15 points
None of the above: 0 points

At the end of the tournament, the manager finalizes it. Whoever has the most points takes the tournament pot. If there is more than one winner the pot is divided between them. The pot is transferred to the winner's DApp Wallet, he can then withdrawn the funds back to L1.
