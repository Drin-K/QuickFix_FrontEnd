import { CallToActionSection } from "@/components/CallToActionSection";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ProvidersSection } from "@/components/ProvidersSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { MainLayout } from "@/layouts/MainLayout";
import { useHomepageData } from "@/hooks/useHomepageData";

export const HomePage = () => {
  const { categories, providers, stats } = useHomepageData();

  return (
    <MainLayout>
      <HeroSection stats={stats} />
      <ServicesSection categories={categories} />
      <HowItWorksSection />
      <ProvidersSection providers={providers} />
      <TestimonialsSection />
      <CallToActionSection />
    </MainLayout>
  );
};
