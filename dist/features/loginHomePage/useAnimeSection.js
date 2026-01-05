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
import { notificationService } from '../../services/notification.service';
export const useAnimeSection = (animeList, allowNotification = false) => {
    // --- STATE UI ---
    const [isExpanded, setIsExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    // --- STATE SETTINGS ---
    const [isLoadingSettings, setIsLoadingSettings] = useState(false);
    const [settings, setSettings] = useState({
        notify_before_hours: 24,
        enabled: true,
        notify_by_email: true,
        notify_in_app: true
    });
    // --- EFFECT: FETCH SETTINGS ---
    useEffect(() => {
        if (showModal && allowNotification) {
            const fetchSettings = () => __awaiter(void 0, void 0, void 0, function* () {
                setIsLoadingSettings(true);
                try {
                    const response = yield notificationService.getPreferences();
                    const serverData = response.data;
                    if (serverData) {
                        setSettings({
                            notify_before_hours: serverData.notify_before_hours,
                            enabled: serverData.enabled,
                            notify_by_email: serverData.notify_by_email,
                            notify_in_app: serverData.notify_in_app
                        });
                    }
                }
                catch (error) {
                    console.error("Failed to fetch notification settings:", error);
                }
                finally {
                    setIsLoadingSettings(false);
                }
            });
            fetchSettings();
        }
    }, [showModal, allowNotification]);
    // --- HANDLERS: MODAL ---
    const handleNotifyClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const toggleExpand = () => setIsExpanded(!isExpanded);
    // --- HANDLERS: FORM ---
    const handleSettingChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => (Object.assign(Object.assign({}, prev), { [name]: type === 'checkbox' ? checked : value })));
    };
    const handleSaveSettings = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const payload = Object.assign(Object.assign({}, settings), { notify_before_hours: typeof settings.notify_before_hours === 'string'
                ? parseInt(settings.notify_before_hours, 10)
                : settings.notify_before_hours });
        try {
            yield notificationService.updatePreferences(payload);
            console.log("Settings saved successfully:", payload);
            setShowModal(false);
        }
        catch (error) {
            console.error("Failed to save settings:", error);
            alert("Failed to save settings. Please try again.");
        }
    });
    // --- LOGIC HIỂN THỊ DANH SÁCH ---
    const hasData = Array.isArray(animeList) && animeList.length > 0;
    const displayedAnime = hasData
        ? (isExpanded ? animeList : animeList.slice(0, 6))
        : [];
    const showViewAllButton = hasData && animeList.length > 6;
    return {
        // State
        isExpanded,
        showModal,
        isLoadingSettings,
        settings,
        hasData,
        // Computed Values
        displayedAnime,
        showViewAllButton,
        // Handlers
        handleNotifyClick,
        handleCloseModal,
        toggleExpand,
        handleSettingChange,
        handleSaveSettings
    };
};
//# sourceMappingURL=useAnimeSection.js.map