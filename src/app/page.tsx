import { AppSection } from "@/components/home/AppSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { Hero } from "@/components/home/Hero";
import { HowSection } from "@/components/home/HowSection";
import { NeedSection } from "@/components/home/NeedSection";
import { NewsSection } from "@/components/home/NewsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhySection } from "@/components/home/WhySection";

/**
 * Home page. Sections run top to bottom in the order below (the order of the Figma frame). Backgrounds alternate white
 * and alt (surface-section, a warm off-white), with the dark trust block as the exception; no two neighbours share a tone.
 *   hero (photo) | products (white) | getting covered (alt) | trust (dark) | testimonials (white) |
 *   app (alt) | news (white) | final call-to-action (alt, with the one maroon card)
 * The Figma frame shows testimonials on the alt tone, but with the FAQ gone it would sit next to the alt app section, so
 * testimonials are white to keep neighbours different.
 * Two sections are not on the page: "Know what you're getting" (CoverageSection) and the FAQ (FaqSection) were removed at
 * the designer's request. Their components and wording are kept, unused.
 * All wording is in src/content/home.ts. The header and footer come from the layout.
 */
export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <NeedSection />
      <HowSection />
      <WhySection />
      <TestimonialsSection />
      <AppSection />
      <NewsSection />
      <FinalCtaSection />
    </main>
  );
}
