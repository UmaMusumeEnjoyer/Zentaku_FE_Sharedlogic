// Export cấu hình để App khởi tạo
export { initSharedLogic, SharedConfig } from './api/config';

// Export các services
export * from './services/auth.service';
export * from './services/anime.service';
export * from './services/user.service';
export * from './services/list.service';
export * from './services/notification.service';

// Export features
export * from './features/home';
export * from './features/newsDetail';
export * from './features/animeDetail';
export * from './features/characterPage';
export * from './features/authPage';
export * from './features/staffPage';
export * from './features/animeSearch';
export * from './features/loginHomePage';
export * from './features/animeListSearch';
export * from './features/profilePage';
export * from './features/animeListPage';

// Export i18n configuration và translations
export * from './shared/i18n';
export { default as commonEn } from './shared/i18n/locales/en/common.json';
export { default as homePageEn } from './shared/i18n/locales/en/HomePage.json';
export { default as commonJp } from './shared/i18n/locales/jp/common.json';
export { default as homePageJp } from './shared/i18n/locales/jp/HomePage.json';

export { default as newsDetailPageEn } from './shared/i18n/locales/en/NewsDetailPage.json';
export { default as newsDetailPageJp } from './shared/i18n/locales/jp/NewsDetailPage.json';

export { default as characterPageJp } from './shared/i18n/locales/jp/CharacterPage.json';
export { default as characterPageEn } from './shared/i18n/locales/en/CharacterPage.json';

//////////////////AnimeDetailPage//////////////////////////////////////////////////////////
export { default as RankingSectionEn } from './shared/i18n/locales/en/AnimeDetailPage/RankingSection.json';
export { default as RankingSectionJp } from './shared/i18n/locales/jp/AnimeDetailPage/RankingSection.json';

export { default as charactersSectionJp } from './shared/i18n/locales/jp/AnimeDetailPage/CharactersSection.json';
export { default as charactersSectionEn } from './shared/i18n/locales/en/AnimeDetailPage/CharactersSection.json';

export { default as staffSectionJp } from './shared/i18n/locales/jp/AnimeDetailPage/StaffSection.json';
export { default as staffSectionEn } from './shared/i18n/locales/en/AnimeDetailPage/StaffSection.json';

export { default as statisticsSectionJp } from './shared/i18n/locales/jp/AnimeDetailPage/StatisticsSection.json';
export { default as statisticsSectionEn } from './shared/i18n/locales/en/AnimeDetailPage/StatisticsSection.json';

export { default as AnimeModalJp } from './shared/i18n/locales/jp/AnimeDetailPage/AnimeModal.json';
export { default as AnimeModalEn } from './shared/i18n/locales/en/AnimeDetailPage/AnimeModal.json';

export { default as MainContentAreaEn } from './shared/i18n/locales/en/AnimeDetailPage/MainContentArea.json';
export { default as MainContentAreaJp } from './shared/i18n/locales/jp/AnimeDetailPage/MainContentArea.json';

export { default as AnimeDetailEn } from './shared/i18n/locales/en/AnimeDetailPage/AnimeDetail.json';
export { default as AnimeDetailJp } from './shared/i18n/locales/jp/AnimeDetailPage/AnimeDetail.json';

/////////////AuthPage////////////////
export { default as AuthEn } from './shared/i18n/locales/en/Auth.json';
export { default as AuthJp } from './shared/i18n/locales/jp/Auth.json';

///////////////StaffPage
export { default as StaffPageEn } from './shared/i18n/locales/en/StaffPage.json';
export { default as StaffPageJp } from './shared/i18n/locales/jp/StaffPage.json';
///////////////Components/////////////
export { default as HeaderEn } from './shared/i18n/locales/en/Header.json';
export { default as HeaderJp } from './shared/i18n/locales/jp/Header.json';

export { default as GlobalSearchEn } from './shared/i18n/locales/en/GlobalSearch.json';
export { default as GlobalSearchJp } from './shared/i18n/locales/jp/GlobalSearch.json';

////////////AnimeSearch/////
export { default as AnimeSearchEN } from './shared/i18n/locales/en/AnimeSearch/AnimeSearch.json';
export { default as AnimeSearchJP } from './shared/i18n/locales/jp/AnimeSearch/AnimeSearch.json';

//////////////HomepageLogin////////
export { default as AnimeSectionEN} from './shared/i18n/locales/en/HomePageLogin/AnimeSection.json';
export { default as AnimeSectionJP} from './shared/i18n/locales/jp/HomePageLogin/AnimeSection.json';
export { default as HomePageLoginEN} from './shared/i18n/locales/en/HomePageLogin/HomePageLogin.json';
export { default as HomePageLoginJP} from './shared/i18n/locales/jp/HomePageLogin/HomePageLogin.json';

/////////////AnimeListSearch////
export {default as AnimeListSearchEN} from './shared/i18n/locales/en/AnimeListSearchPage/AnimeListSearchPage.json';
export {default as AnimeListSearchJP} from './shared/i18n/locales/jp/AnimeListSearchPage/AnimeListSearchPage.json';

//////Profile///////
export {default as ProfilePageEN} from './shared/i18n/locales/en/ProfilePage/ActivityFeed.json';
export {default as ProfilePageJP} from './shared/i18n/locales/jp/ProfilePage/ActivityFeed.json';

export {default as ActivityHistoryEN} from './shared/i18n/locales/en/ProfilePage/ActivityHistory.json';
export {default as ActivityHistoryJP} from './shared/i18n/locales/jp/ProfilePage/ActivityHistory.json';

export {default as EditProfileModalEN} from './shared/i18n/locales/en/ProfilePage/EditProfileModal.json';
export {default as EditProfileModalJP} from './shared/i18n/locales/jp/ProfilePage/EditProfileModal.json';

export {default as ProfilePagePageEN} from './shared/i18n/locales/en/ProfilePage/ProfilePage.json';
export {default as ProfilePagePageJP} from './shared/i18n/locales/jp/ProfilePage/ProfilePage.json';

export {default as ActivityFeedEN} from './shared/i18n/locales/en/ProfilePage/ActivityFeed.json';
export {default as ActivityFeedJP} from './shared/i18n/locales/jp/ProfilePage/ActivityFeed.json';

/////AnimeListpage/////
export {default as addAnimeModalEN} from './shared/i18n/locales/en/AnimeListPage/addAnimeModal.json';
export {default as addAnimeModalJP} from './shared/i18n/locales/jp/AnimeListPage/addAnimeModal.json';

export {default as editListModalEN} from './shared/i18n/locales/en/AnimeListPage/editListModal.json';
export {default as editListModalJP} from './shared/i18n/locales/jp/AnimeListPage/editListModal.json';

export {default as likersModalEN} from './shared/i18n/locales/en/AnimeListPage/likersModal.json';
export {default as likersModalJP} from './shared/i18n/locales/jp/AnimeListPage/likersModal.json';

export {default as listHeaderEN} from './shared/i18n/locales/en/AnimeListPage/listHeader.json';
export {default as listHeaderJP} from './shared/i18n/locales/jp/AnimeListPage/listHeader.json';

export {default as requestListEN} from './shared/i18n/locales/en/AnimeListPage/requestList.json';
export {default as requestListJP} from './shared/i18n/locales/jp/AnimeListPage/requestList.json';

export {default as requestModalEN} from './shared/i18n/locales/en/AnimeListPage/requestModal.json';
export {default as requestModalJP} from './shared/i18n/locales/jp/AnimeListPage/requestModal.json';

export {default as sidebarEN} from './shared/i18n/locales/en/AnimeListPage/sidebar.json';
export {default as sidebarJP} from './shared/i18n/locales/jp/AnimeListPage/sidebar.json';

export {default as userAnimeGroupEN} from './shared/i18n/locales/en/AnimeListPage/userAnimeGroup.json';
export {default as userAnimeGroupJP} from './shared/i18n/locales/jp/AnimeListPage/userAnimeGroup.json';

export {default as userItemEN} from './shared/i18n/locales/en/AnimeListPage/userItem.json';
export {default as userItemJP} from './shared/i18n/locales/jp/AnimeListPage/userItem.json';

export {default as userSearchModalEN} from './shared/i18n/locales/en/AnimeListPage/userSearchModal.json';
export {default as userSearchModalJP} from './shared/i18n/locales/jp/AnimeListPage/userSearchModal.json';

export {default as animeListPageEN} from './shared/i18n/locales/en/AnimeListPage/animeListPage.json';
export {default as animeListPageJP} from './shared/i18n/locales/jp/AnimeListPage/animeListPage.json';
/////////Components///////////////
export * from './components/AnimeCard';
export * from './components/GlobalSearch/GlobalSearch.types';
export * from './components/GlobalSearch/useGlobalSearch';
export * from './components/Header/userHeader';
// shared-logic/src/index.ts - Thêm vào file hiện tại
export * from './shared/types';
