import { ref_rank } from '@/common/referentiel';

export function get_ranklevel(modes: any, mode_select: string, detail: boolean) {
    if (modes == undefined) { return "unranked"; }

    let mode: any;

    switch (mode_select) {
        case 'rm_solo': mode = modes?.rm_solo; break;
        case 'rm_team': mode = modes?.rm_team; break;
    }

    if (mode == undefined) { return "unranked"; }
    if (mode.rank_level == undefined) { return "unranked"; }

    var rank = mode.rank_level.split('_')[0];
    var rankFr = ref_rank(rank);

    var lvl = (rank != "unranked" ? mode.rank_level.split('_')[1] : "");
    var result = `${rankFr} ${lvl}`

    if (detail) { result += ` (${mode.rating} points)` }

    return result;
}
