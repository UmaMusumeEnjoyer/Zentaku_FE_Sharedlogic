var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';
export const useHomePagelogin = () => {
    // Gom tất cả các list vào một state object cho gọn
    const [animeLists, setAnimeLists] = useState({
        watching: [],
        completed: [],
        onHold: [],
        dropped: [],
        planning: []
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserData = () => __awaiter(void 0, void 0, void 0, function* () {
            setLoading(true);
            try {
                const username = localStorage.getItem('username');
                if (username) {
                    const response = yield userService.getUserAnimeList(username);
                    if (response.data) {
                        // Map dữ liệu từ API vào State
                        // Logic giữ nguyên từ file gốc: xử lý fallback (on_hold/paused, plan_to_watch/planning)
                        setAnimeLists({
                            watching: response.data.watching || [],
                            completed: response.data.completed || [],
                            onHold: response.data.on_hold || response.data.paused || [],
                            dropped: response.data.dropped || [],
                            planning: response.data.plan_to_watch || response.data.planning || []
                        });
                    }
                }
                else {
                    console.warn("No username found in localStorage");
                }
            }
            catch (error) {
                console.error("Error fetching user anime list:", error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchUserData();
    }, []);
    // Logic kiểm tra danh sách rỗng
    const allListsAreEmpty = animeLists.watching.length === 0 &&
        animeLists.planning.length === 0 &&
        animeLists.completed.length === 0 &&
        animeLists.onHold.length === 0 &&
        animeLists.dropped.length === 0;
    return {
        animeLists,
        loading,
        allListsAreEmpty
    };
};
//# sourceMappingURL=useHomePagelogin.js.map