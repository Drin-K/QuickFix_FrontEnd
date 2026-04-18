import { CallToActionSection } from "@/components/public/CallToActionSection";
import { HeroSection } from "@/components/public/HeroSection";
import { HowItWorksSection } from "@/components/public/HowItWorksSection";
import { ProvidersSection } from "@/components/public/ProvidersSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { useHomepageData } from "@/hooks/useHomepageData";
import { PublicLayout } from "@/layouts/PublicLayout";

export const HomePage = () => {
  const { categories, providers, stats } = useHomepageData();

  return (
    <PublicLayout>
      <HeroSection stats={stats} />
      <ServicesSection categories={categories} />
      <HowItWorksSection />
      <ProvidersSection providers={providers} />
      <TestimonialsSection />
      <CallToActionSection />
    </PublicLayout>
  );
};
