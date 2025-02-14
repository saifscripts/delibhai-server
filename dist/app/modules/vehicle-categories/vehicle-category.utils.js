"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDuplicateUnionIdAndTitle = void 0;
function hasDuplicateUnionIdAndTitle(villages) {
    const map = new Map();
    for (const village of villages) {
        const key = `${village.unionId}-${village.title}`;
        map.set(key, (map.get(key) || 0) + 1);
        if (map.get(key) > 1) {
            return true;
        }
    }
    return false;
}
exports.hasDuplicateUnionIdAndTitle = hasDuplicateUnionIdAndTitle;
