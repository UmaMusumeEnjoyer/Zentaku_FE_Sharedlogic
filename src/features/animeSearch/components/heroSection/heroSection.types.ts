export interface HeroSlide {
  id: number | string;
  bannerUrl: string;
  title: string;
  description: string;
}

export interface HeroSectionProps {
  slides: HeroSlide[];
}