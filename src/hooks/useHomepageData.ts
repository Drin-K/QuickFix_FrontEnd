import { homeService } from "@/services/homeService";

export const useHomepageData = () => {
  const categories = homeService.getServiceCategories();
  const stats = homeService.getStats();
  const providers = homeService.getFeaturedProviders();

  return { categories, stats, providers };
};
