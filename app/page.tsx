import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Themes from "@/components/Themes";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Themes />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  );
}
