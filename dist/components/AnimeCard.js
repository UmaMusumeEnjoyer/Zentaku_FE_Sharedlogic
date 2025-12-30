// src/utils/animeLogic.ts
// 2. Logic lấy tiêu đề
export const getAnimeTitle = (anime) => {
    return anime.title_romaji || anime.name_romaji || "Unknown Title";
};
// 3. Logic lấy ID cho Link
export const getAnimeLinkId = (anime) => {
    return anime.anilist_id || anime.id || "";
};
// 4. Logic tính toán thông tin hiển thị (Watched hoặc Airing)
export const getAnimeDisplayInfo = (anime) => {
    // Case A: Đang xem dở (Watched progress)
    if (anime.episode_progress !== undefined) {
        const currentEp = anime.episode_progress;
        const totalEp = anime.episodes || '?';
        return `Watched: ${currentEp} / ${totalEp}`;
    }
    // Case B: Chuẩn bị chiếu tập mới (Next Airing)
    if (anime.next_airing_ep) {
        const { episode, timeUntilAiring } = anime.next_airing_ep;
        const days = Math.floor(timeUntilAiring / 86400);
        const hours = Math.floor((timeUntilAiring % 86400) / 3600);
        const minutes = Math.floor(((timeUntilAiring % 86400) % 3600) / 60);
        let timeString = `${days}d ${hours}h ${minutes}m`;
        if (days === 0) {
            timeString = `${hours}h ${minutes}m`;
        }
        return `Ep ${episode} - ${timeString}`;
    }
    // Case C: Không có thông tin
    return null;
};
//# sourceMappingURL=AnimeCard.js.map