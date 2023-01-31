import { aoe4worldGameLast, aoe4worldGamesOpponent, aoe4worldPlayerProfile } from '@/common/connector';
import { get_opponent } from '@/common/feature';
import { ID_AOE } from '@/common/type';
import type { Player } from '@/common/type';
import type { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'react-string-format';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(await game());
}

const sentence: string = "Il s'agit de game {0} contre {1}."
const sentenceEnd: string = " {0} victoire pour {1} défaite."

async function game(): Promise<string> {

  let opponent1: Player | null = await get_opponent(aoe4worldGameLast());

  if (opponent1 == null) { return ""; }
  return opponent1.name;
  
  let opponent: Player = opponent1!!;

  let data: Promise<string> = getServerSideProps(opponent).then((data) => {
    let win: number = 0;
    let loose: number = 0;
    let result: string = "";

    result = format(sentence, data.total_count, opponent.name);

    if (data.total_count == 1) { return result; }

    data.games.forEach(function (game: any) {
      if (!game.ongoing) {
        game.teams.forEach(function (y: any) {
          if (y[0].player.profile_id == ID_AOE) {
            y[0].player.result == "win" ? win++ : loose++;
          }
        });
      }
    });
    result += format(sentenceEnd, win, loose);

    return result;
  });

  return data;
}

export async function getServerSideProps(opponent: Player): Promise<any> {
  return aoe4worldGamesOpponent(opponent.id);
}