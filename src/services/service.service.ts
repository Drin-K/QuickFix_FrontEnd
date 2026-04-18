import type { ProviderHighlight, ServiceCategory, Statistic } from "@/types/service.types";

type ServiceDetail = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  provider: string;
  price: string;
  availability: string;
  location: string;
  responseTime: string;
  highlights: string[];
};

const serviceCategories: ServiceCategory[] = [
  {
    id: "electrical",
    title: "Electrical",
    description: "Troubleshooting, wiring, lighting and urgent electrical repairs.",
    icon: "⚡",
  },
  {
    id: "plumbing",
    title: "Plumbing",
    description: "Leaks, pipe repairs, installations and emergency water fixes.",
    icon: "🔧",
  },
  {
    id: "home-care",
    title: "Home Care",
    description: "Routine maintenance, painting, assembly and property upkeep.",
    icon: "🏠",
  },
];

const serviceDetails: ServiceDetail[] = [
  {
    id: "electrical",
    title: "Electrical Repairs and Installations",
    description:
      "Fast support for power faults, fixture installation, rewiring, and general electrical maintenance for homes and apartments.",
    icon: "⚡",
    category: "Electrical",
    provider: "Arber Kola",
    price: "Starting from EUR 25",
    availability: "Available today",
    location: "Prishtine",
    responseTime: "Usually replies in under 15 minutes",
    highlights: ["Fault diagnostics", "Lighting installation", "Socket and switch repairs"],
  },
  {
    id: "plumbing",
    title: "Plumbing Repairs and Emergency Fixes",
    description:
      "Book help for leaking pipes, blocked drains, bathroom fixtures, and urgent water issues with transparent pricing.",
    icon: "🔧",
    category: "Plumbing",
    provider: "Nora Plumbing Co.",
    price: "Starting from EUR 20",
    availability: "Emergency slots open",
    location: "Prizren",
    responseTime: "Usually replies in under 10 minutes",
    highlights: ["Pipe leak repair", "Drain unclogging", "Bathroom fixture replacement"],
  },
  {
    id: "home-care",
    title: "Home Maintenance and Care",
    description:
      "Reliable help for painting touch-ups, furniture assembly, home upkeep, and small repairs around the property.",
    icon: "🏠",
    category: "Home Care",
    provider: "Mira Home Services",
    price: "Starting from EUR 18",
    availability: "Next available tomorrow",
    location: "Ferizaj",
    responseTime: "Usually replies in under 30 minutes",
    highlights: ["Furniture assembly", "Minor wall repairs", "Seasonal maintenance"],
  },
];

export const homeService = {
  getServiceCategories(): ServiceCategory[] {
    return serviceCategories;
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

  getServiceById(id: string): ServiceDetail | undefined {
    return serviceDetails.find((service) => service.id === id);
  },
};
