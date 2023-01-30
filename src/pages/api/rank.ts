import { get_ranklevel } from '@/common/feature';
import { aoe4worldConnector } from '@/common/connector';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(await ranking("6492127"));
}

async function ranking(id: string) {
  let data: any = getServerSideProps(id).then((data) => {
    return `${data.name} est actuellement ${get_ranklevel(data.modes, "rm_solo", 0b110)} en solo et ${get_ranklevel(data.modes, "rm_team", 0b10)} en multi`
  });

  return data;
}

export async function getServerSideProps(id: string) {
  return await aoe4worldConnector(`https://aoe4world.com/api/v0/players/${id}`)
}