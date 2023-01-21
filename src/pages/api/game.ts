import { get_ranklevel } from '@/common/feature';
import { ref_civ } from '@/common/referentiel';
import { aoe4worldConnector } from '@/common/connector';
import type { NextApiRequest, NextApiResponse } from 'next'
import { resourceLimits } from 'worker_threads';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.setHeader("Content-Type", "text/plain; charset=UTF-8");
  res.status(200).send(await game("6492127"));
}

async function game(id: string) {
  let data: any = getServerSideProps(id).then((data) => {
    let result: string = "";
    if (data.ongoing) {
      data.teams.forEach(function (team: any, idx: number, arr: any) {
        team.forEach(function (teammate: any, idx: number, arr: any) {
          result += `${teammate.name} [${ref_civ(teammate.civilization)}] (${get_ranklevel(teammate.modes, data.leaderboard, false)})`;
          if (idx !== arr.length - 1) { result += " - "; }
        });

        if (idx !== arr.length - 1) { result += " vs "; }
      });

      result += ` sur ${data.map}`;
    }
    else { result = "Pas de match en cours"; }

    return result;
  });

  return data;
}

export async function getServerSideProps(id: string) {
  return await aoe4worldConnector(`https://aoe4world.com/api/v0/players/${id}/games/last`)
}
