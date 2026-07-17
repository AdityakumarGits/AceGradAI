import Navbar from "../Components/Common/Navbar";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Pricing from "./Pricing";
import FAQ from "./Faq";
import Footer from "../Components/Common/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <section id="home">
        <Hero />
      </section>

      <section id="features">
        <Features />
      </section>


      <section id="howItWork">
      <HowItWorks/>
      </section>

      <section  id="pricing">
       <Pricing/>
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <Footer />
    </>
  );
};

export default Home;