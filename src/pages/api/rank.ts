import { get_ranklevel } from '@/common/feature';
import { aoe4worldPlayerProfile } from '@/common/connector';
import type { NextApiRequest, NextApiResponse } from 'next'
import { format } from 'react-string-format';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(await ranking());
}

const sentence: string = "{0} est actuellement {1} en solo et {2} en multi"

async function ranking(): Promise<string> {
  return getServerSideProps().then((data: any) => {
    return format(sentence, data.name, get_ranklevel(data.modes, "rm_solo", 0b110), get_ranklevel(data.modes, "rm_team", 0b10));
  });
}

export async function getServerSideProps(): Promise<any> {
  return await aoe4worldPlayerProfile();
}