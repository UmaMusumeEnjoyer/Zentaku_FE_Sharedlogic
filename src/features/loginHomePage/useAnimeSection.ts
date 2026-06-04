import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { AnimeItem_AnimeSection, NotificationSettings } from './AnimeSection.types';
import { userService } from '../../services/user.service';

export const useAnimeSection = (animeList: AnimeItem_AnimeSection[], allowNotification: boolean = false) => {
  // --- STATE UI ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // --- STATE SETTINGS ---
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    notify_before_hours: 24,
    enabled: true,
    notify_by_email: true,
    notify_in_app: true
  });

  // --- EFFECT: FETCH SETTINGS ---
  useEffect(() => {
    if (showModal && allowNotification) {
      const fetchSettings = async () => {
        setIsLoadingSettings(true);
        try {
          const response = await userService.getMyProfile();
          const serverData = (response.data as any)?.notificationSettings;

          if (serverData) {
            setSettings({
              notify_before_hours: 24, // Default, not stored in user profile
              enabled: true,
              notify_by_email: serverData.email ?? true,
              notify_in_app: serverData.push ?? true
            });
          }
        } catch (error) {
          console.error("Failed to fetch notification settings:", error);
        } finally {
          setIsLoadingSettings(false);
        }
      };
      fetchSettings();
    }
  }, [showModal, allowNotification]);

  // --- HANDLERS: MODAL ---
  const handleNotifyClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // --- HANDLERS: FORM ---
  const handleSettingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...settings,
      notify_before_hours: typeof settings.notify_before_hours === 'string' 
        ? parseInt(settings.notify_before_hours, 10) 
        : settings.notify_before_hours,
    };

    try {
      await userService.updatePreferences({
        notificationSettings: {
          email: payload.notify_by_email,
          push: payload.notify_in_app,
        }
      });
      console.log("Settings saved successfully:", payload);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

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