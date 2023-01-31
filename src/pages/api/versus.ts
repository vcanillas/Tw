import { aoe4worldConnector } from '@/common/connector';
import type { NextApiRequest, NextApiResponse } from 'next'

type Player = {
  id: string;
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(await game("6492127"));
}

async function game(id: string): Promise<string> {

  let pOpponent: Promise<Player | null> = getServerSidePropsGame(id).then((data) => {
    let result: Player | null = null;
    // if (!data.ongoing) { return result; }
    if (data.teams.length != 2) { return result; }

    data.teams.forEach(function (team: any) {
      if (team.length != 1) { return ""; }
      team.forEach(function (opponent: any) {
        if (opponent.profile_id != id) {
          result = {
            id: opponent.profile_id,
            name: opponent.name
          };
        }
      });
    });
    return result;
  });

  let opponent: Player | null = await pOpponent;

  if (opponent == null) { return ""; }

  let data: Promise<string> = getServerSideProps(id, opponent).then((data) => {
    let win: number = 0;
    let loose: number = 0;
    let result: string = "";
    result += `Il s'agit de game ${data.total_count} contre ${opponent?.name}.`;

    if (data.total_count == 1) { return result; }

    data.games.forEach(function (game: any) {
      if (!game.ongoing) {
        game.teams.forEach(function (y: any) {
          if (y[0].player.profile_id == id) {
            y[0].player.result == "win" ? win++ : loose++;
          }
        });
      }
    });
    result += ` ${win} victoire pour ${loose} défaite.`;

    return result;
  });

  return data;
}

export async function getServerSideProps(id: string, opponent: Player): Promise<any> {
  return await aoe4worldConnector(`https://aoe4world.com/api/v0/players/6492127/games?opponent_profile_id=1225228&leaderboard=rm_solo`)
}

export async function getServerSidePropsGame(id: string): Promise<any> {
  return await aoe4worldConnector(`https://aoe4world.com/api/v0/players/${id}/games/last`)
}

