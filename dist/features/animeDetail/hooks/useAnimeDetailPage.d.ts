import { AnimeDetailHook } from '../types/animeDetail.types';
import { StaffMember } from '../components/StaffSection/staffSection.types';
import { Character } from '../components/CharacterSection/characterSection.types';
import { AnimeStats } from '../components/mainContentArea/animeStats.types';
interface UseAnimeDetailReturn extends AnimeDetailHook {
    staffList: StaffMember[];
    characterList: Character[];
    stats: AnimeStats | null;
}
export declare const useAnimeDetail: (animeId: string | undefined) => UseAnimeDetailReturn;
export {};
//# sourceMappingURL=useAnimeDetailPage.d.ts.map