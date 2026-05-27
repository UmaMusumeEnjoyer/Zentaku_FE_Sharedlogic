// src/pages/AnimeSearch/animeData.js

// 1. Dữ liệu cho Hero Section (Banner lớn đầu trang)
// Lưu ý: heroList sử dụng HeroSlide type riêng, không liên quan đến API anime data
export const heroList = [
  {
    id: 164212,
    title: "GIRLS BAND CRY",
    description: "Feeling out of place in the countryside, high school dropout Nina Iseri moves to Tokyo. After a rough first day and getting locked out of her apartment, she meets her favorite guitarist.",
    bannerUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/164212-yZcGovywtUm4.jpg"
  },
  {
    id: 21519,
    title: "Your Name",
    description: "Mitsuha Miyamizu, a high school girl, yearns to live the life of a boy in the bustling city of Tokyo—a dream that stands in stark contrast to her present life in the countryside. Meanwhile in the city, Taki Tachibana lives a busy life as a high school student.",
    bannerUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21519-1ayMXgNlmByb.jpg"
  },
  {
    id: 100178,
    title: "Liz and the Blue Bird",
    description: "Students and best friends Mizore Yoroizuka and Nozomi Kasaki prepare to play a complex musical duet, Liz and the Blue Bird, for oboe and flute. Though they play beautifully together and have been friends since childhood...",
    bannerUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/100178-pneDY2KoVnbz.jpg"
  },
  {
    id: 98658,
    title: "Revue Starlight",
    description: "The franchise centers on \"Starlight\" — the song and dance revue troupe loved throughout the world. Karen and Hikari make a promise with each other when they're young that one day they'll stand on that stage together.",
    bannerUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/98658-YifB5qgBgnGQ.jpg"
  },
  {
    id: 131912,
    title: "Fuuto PI",
    description: "In the ecologically-minded city of Fuuto, mysterious devices resembling USB flash drives called Gaia Memories are used by criminals and other interested parties to become monsters called Dopants, committing crimes with the police force powerless to stop them. ",
    bannerUrl: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/131912-YPKK1NQel4Yd.jpg"
  }
];

// Lưu ý: Các mảng trendingAnime, popularSeason, upcomingNext, allTimePopular
// đã được chuyển sang fetch từ API thực tế trong useAnimeSearchPage hook.
// Xem: useAnimeSearch.ts -> searchService.getTrending(), getCurrentSeasonal(), 
// getNextSeasonal(), getPopular()