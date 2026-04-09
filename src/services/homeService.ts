import type { ProviderHighlight, ServiceCategory, Statistic } from "@/types/home";

export const homeService = {
  getServiceCategories(): ServiceCategory[] {
    return [
      {
        title: "Electrical",
        description: "Troubleshooting, wiring, lighting and urgent electrical repairs.",
        icon: "⚡",
      },
      {
        title: "Plumbing",
        description: "Leaks, pipe repairs, installations and emergency water fixes.",
        icon: "🔧",
      },
      {
        title: "Home Care",
        description: "Routine maintenance, painting, assembly and property upkeep.",
        icon: "🏠",
      },
    ];
  },

  getStats(): Statistic[] {
    return [
      { label: "Verified professionals", value: "250+" },
      { label: "Bookings completed", value: "4.8k" },
      { label: "Average rating", value: "4.9/5" },
    ];
  },

  getFeaturedProviders(): ProviderHighlight[] {
    return [
      { name: "Arber Kola", specialty: "Certified Electrician", rating: 4.9, city: "Prishtine" },
      { name: "Nora Plumbing Co.", specialty: "Emergency Plumbing", rating: 4.8, city: "Prizren" },
      { name: "Mira Home Services", specialty: "Maintenance & Repairs", rating: 5, city: "Ferizaj" },
    ];
  },
};
