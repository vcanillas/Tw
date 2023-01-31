import { ref_rank } from '@/common/referentiel';
import { ID_AOE } from '@/common/type';
import type { Player } from '@/common/type';

export function get_ranklevel(modes: any, mode_select: string, detail: number): string {
    if (modes == undefined) { return "unranked"; }

    var result: string = "";
    let mode: any;

    switch (mode_select) {
        case 'rm_solo': mode = modes?.rm_solo; detail = detail | 0b100; break;
        case 'rm_team': mode = modes?.rm_team; break;
        default: return result;
    }

    if (mode == undefined) { return "unranked"; }
    if (mode.rank_level == undefined) { return "unranked"; }

    var rank = mode.rank_level.split('_')[0];
    var rankFr = ref_rank(rank);

    var lvl: string = (rank != "unranked" ? mode.rank_level.split('_')[1] : "");
    result = `${rankFr} ${lvl}`

    if (detail & 0b10) { result += ` (${mode.rating} points)` }
    if (detail & 0b100) { result += ` - #${mode.rank}` }

    return result;
}

export function get_opponent(data: Promise<any>): Promise<Player | null> {
    return data.then((data) => {
        let result: Player | null = null;

        if (!data.ongoing) { return result; }
        if (data.teams.length != 2) { return result; }

        data.teams.forEach(function (team: any) {
            if (team.length != 1) { return result; }
            team.forEach(function (opponent: any) {
                if (opponent.profile_id != ID_AOE) {
                    result = {
                        id: opponent.profile_id,
                        name: opponent.name
                    };
                }
            });
        });
        return result;
    });
}