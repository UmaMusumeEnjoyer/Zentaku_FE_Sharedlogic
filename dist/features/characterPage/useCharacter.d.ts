import { CharacterData, ExtraInfo } from './characterPage.types';
export declare const useCharacter: (characterId: string | undefined) => {
    character: CharacterData | null;
    loading: boolean;
    error: string | null;
    extraInfo: ExtraInfo;
    cleanDescription: string;
};
//# sourceMappingURL=useCharacter.d.ts.map