export function ref_winloss(win: string) {
  switch (win) {
    case 'loss': return "défaite";
    case 'win': return "victoire";
    default: return "…";
  }
}

export function ref_rank(rank: string) {
  switch (rank) {
    case 'bronze': return "Bronze"
    case 'silver': return "Argent"
    case 'gold': return "Or"
    case 'platinum': return "Platine"
    case 'diamond': return "Diamant"
    case 'conqueror': return "Conquerant"
    default: return "Unranked"
  }
}

export function ref_civ(civ: string) {
  switch (civ) {
    case 'abbasid_dynasty': return "Abbasides"
    case 'chinese': return "Chinois"
    case 'delhi_sultanate': return "Delhi"
    case 'french': return "Français"
    case 'english': return "Anglais"
    case 'holy_roman_empire': return "HRE"
    case 'mongols': return "Mongols"
    case 'rus': return "Rus'"
    case 'ottomans': return "Ottomans"
    case 'malians': return "Maliens"
    default: return "";
  }
}