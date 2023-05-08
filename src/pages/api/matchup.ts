import { get_ranklevel } from '@/common/feature';
import { ref_civ } from '@/common/referentiel';
import { aoe4worldConnector } from '@/common/connector';
import type { NextApiRequest, NextApiResponse } from 'next'
import { resourceLimits } from 'worker_threads';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  res.status(200).send(await matchup("6492127"));
}

async function matchup(id: string) {
  let data: any = getServerSidePropsGame(id).then((dataGame) => {
    let idOpponent: string = "";
    let nameOpponent: string = "";
    let result: string = "";
    if (dataGame.leaderboard != "rm_solo") return "Match non éligible";

    dataGame.teams.forEach(function (team: any) {
      team.forEach(function (teammate: any) {
        if (teammate.profile_id != id) {
          idOpponent = teammate.profile_id;
          nameOpponent = teammate.name;
        }
      });
    });

    let lastGame: string = "";

    data = getServerSideProps(id, idOpponent).then((data) => {
      if (data.total_count < 2) return `Première rencontre contre ${nameOpponent}`;
      let win: number = 0, loss: number = 0;

      data.games.filter(is_rmsolo_and_notcurrent).forEach(function (game: any, idx: number, arr: any) {
        if (game.duration > 0) {
          game.teams.forEach(function (team: any, idx2: number, arr2: any) {
            if (idx == 0) {
              lastGame += `${ref_civ(team[0].player.civilization)} ${team[0].player.profile_id != id ? `[${team[0].player.name}]` : ""}`
              if (idx2 == 0) { lastGame += " vs "; }
            }

            if (team[0].player.profile_id == id) {
              if (team[0].player.result == "win") { win = win + 1; }
              if (team[0].player.result == "loss") { loss = loss + 1; }
            }
          });
        }
      });

      result += `Résultat contre ${nameOpponent} - ${win} ${win > 1 ? "victoires" : "victoire"} / ${loss} ${loss > 1 ? "défaites" : "défaite"}. `
      result += `Dernier match : ${lastGame}`;
      return result;
    });

    return data;
  });

  return data;
}

export async function getServerSideProps(id: string, idOpponent: string) {
  return await aoe4worldConnector(`https://aoe4world.com/api/v0/players/${id}/games?opponent_profile_id=${idOpponent}`)
}

export async function getServerSidePropsGame(id: string) {
  return await aoe4worldConnector(`https://aoe4world.com/api/v0/players/${id}/games/last`)
}

function is_rmsolo_and_notcurrent(element: any, idx: number, arr: any) {
  return element.leaderboard == "rm_solo" && !element.ongoing
}