import { ref_winloss } from '@/common/referentiel';
import { aoe4worldConnector } from '@/common/connector';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(await last("6492127"));
}

async function last(id: string): Promise<string> {
  let data: any = getServerSideProps(id).then((data) => {
    for (var game of data.games) {
      if (!game.ongoing) {
        var player = game.teams.find((team: any) => team.find((x: any) => x.player.profile_id == id));

        let victory = ref_winloss(player[0].player.result);

        return `Le dernier match était une ${victory}`
      }
    }
  });

  return data;
}

export async function getServerSideProps(id: string): Promise<any> {
  return await aoe4worldConnector(`https://aoe4world.com/api/v0/players/${id}/games?limit=2`)
}