import { homeService } from "@/services/service.service";

export const useHomepageData = () => {
  const categories = homeService.getServiceCategories();
  const stats = homeService.getStats();
  const providers = homeService.getFeaturedProviders();

  return { categories, stats, providers };
};
