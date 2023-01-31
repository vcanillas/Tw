import { ID_AOE } from '@/common/type';

export async function aoe4worldGameLast(): Promise<any> {
    return connector(`https://aoe4world.com/api/v0/players/${ID_AOE}/games/last`)
}

export async function aoe4worldPlayerProfile(): Promise<any> {
    return connector(`https://aoe4world.com/api/v0/players/${ID_AOE}`)
}

export async function aoe4worldGamesLimit2(): Promise<any> {
    return connector(`https://aoe4world.com/api/v0/players/${ID_AOE}/games?limit=2`)
}

export async function aoe4worldGamesOpponent(idOpponent: string): Promise<any> {
    return connector(`https://aoe4world.com/api/v0/players/${ID_AOE}/games?opponent_profile_id=${idOpponent}&leaderboard=rm_solo`)
}

async function connector(url: string): Promise<any> {
    const res = await fetch(url)
    const data = res.json()

    // Pass data to the page via props
    return data
}