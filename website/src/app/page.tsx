import Navbar from "../app/Components/Navbar";
import Hero from "../app/Components/Hero";
import HowItWorks from "../app/Components/HowItWorks";
import PredictSection from "../app/Components/PredictSection";
import Footer from "../app/Components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <PredictSection />
      </main>
      <Footer />
    </>
  );
}
