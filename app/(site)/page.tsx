import Container from "../components/Container";
import Contact from "./components/contact/Contact";
import Features from "./components/features/Features";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";
import Subscription from "./components/subscription/Subscription";

export default function Home() {
  return (
    <Container>
      <Navbar />
      <div className="flex flex-col space-y-[500px] pt-20">
        <Hero />
        <Features />
        <Subscription />
        <Contact />
        <Footer />
      </div>
    </Container>
  );
}
