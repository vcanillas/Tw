import { ref_rank } from '@/common/referentiel';

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
