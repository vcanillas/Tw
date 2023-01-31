import { ref_winloss } from '@/common/referentiel';
import { aoe4worldGamesLimit2 } from '@/common/connector';
import { ID_AOE } from '@/common/type';
import type { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'react-string-format';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(await last());
}

const sentence: string = "Le dernier match était une {0}"

async function last(): Promise<string> {
  return getServerSideProps().then((data) => {
    for (var game of data.games) {
      if (!game.ongoing) {
        var player = game.teams.find((team: any) => team.find((x: any) => x.player.profile_id == ID_AOE));

        return format(sentence, ref_winloss(player[0].player.result));
      }
    }

    return "";
  });
}

export async function getServerSideProps(): Promise<any> {
  return aoe4worldGamesLimit2();
}