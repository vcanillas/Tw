import { aoe4worldGameLast, aoe4worldGamesOpponent } from '@/common/connector';
import { ref_civ } from '@/common/referentiel';
import { get_opponent, isCurrentPlayer } from '@/common/feature';
import { Player } from '@/common/type';
import type { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'react-string-format';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(await matchup());
}

const sentenceNotEligible: string = "Match non éligible"
const sentenceFirstGame: string = "Première rencontre contre {0}"
const sentence: string = "Résultat contre {0} - {1} / {2}. Dernier match : {3}"

async function matchup(): Promise<string> {

  let opponent1: Player | null = await get_opponent(aoe4worldGameLast());
  if (opponent1 == null) { return sentenceNotEligible; }

  let opponent: Player = opponent1!!;

  let data: Promise<string> = getServerSideProps(opponent).then((data) => {
    if (data.total_count == 1) { return format(sentenceFirstGame, opponent.name); }
    let lastGame: string = "";

    data = getServerSideProps(opponent).then((data) => {
      if (data.total_count < 2) return format(sentenceFirstGame, opponent.name);
      let win: number = 0, loss: number = 0;

      data.games.filter(is_rmsolo_and_notcurrent).forEach(function (game: any, idx: number, arr: any) {
        game.teams.forEach(function (team: any, idx2: number, arr2: any) {
          if (idx == 0) {
            lastGame += `${ref_civ(team[0].player.civilization)} ${!isCurrentPlayer(team[0].player.profile_id) ? `[${team[0].player.name}]` : ""}`
            if (idx2 == 0) { lastGame += " vs "; }
          }

          if (isCurrentPlayer(team[0].player.profile_id)) {
            if (team[0].player.result == "win") { win = win + 1; }
            if (team[0].player.result == "loss") { loss = loss + 1; }
          }
        });
      });

      return format(sentence,
        opponent.name,
        `${win} ${win > 1 ? "victoires" : "victoire"}`,
        `${loss} ${loss > 1 ? "défaites" : "défaite"}`,
        lastGame);
    });

    return data;
  });

  return data;
}

export async function getServerSideProps(opponent: Player): Promise<any> {
  return aoe4worldGamesOpponent(opponent.id);
}

function is_rmsolo_and_notcurrent(element: any, idx: number, arr: any) {
  return element.leaderboard == "rm_solo" && !element.ongoing
}