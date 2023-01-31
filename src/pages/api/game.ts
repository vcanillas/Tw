import { get_ranklevel } from '@/common/feature';
import { ref_civ } from '@/common/referentiel';
import { aoe4worldGameLast } from '@/common/connector';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(await game());
}

const sentenceNoGame: string = "Pas de match en cours"
const sentenceSur: string = "sur"

async function game(): Promise<string> {
  return getServerSideProps().then((data: any) => {
    let result: string = "";

    if (!data.ongoing) { return sentenceNoGame }

    data.teams.forEach(function (team: any, idx: number, arr: any) {
      team.forEach(function (teammate: any, idx: number, arr: any) {
        result += `${teammate.name} [${ref_civ(teammate.civilization)}] (${get_ranklevel(teammate.modes, data.leaderboard, 0b0)})`;
        if (idx !== arr.length - 1) { result += " - "; }
      });

      if (idx !== arr.length - 1) { result += " vs "; }
    });

    result += ` ${sentenceSur} ${data.map}`;

    return result;
  });
}

export async function getServerSideProps(): Promise<any> {
  return await aoe4worldGameLast();
}
