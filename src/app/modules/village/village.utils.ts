interface IVillage {
    unionId: string;
    wardId: string;
    title: string;
}

export function hasDuplicateUnionIdAndTitle(villages: IVillage[]): boolean {
    const map = new Map<string, number>();

    for (const village of villages) {
        const key = `${village.unionId}-${village.title}`;
        map.set(key, (map.get(key) || 0) + 1);
        if (map.get(key)! > 1) {
            return true;
        }
    }

    return false;
}
