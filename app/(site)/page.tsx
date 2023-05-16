import getCurrentUser from "../actions/getCurrentUser";
import Container from "../components/Container";
import ChangePasswordModal from "../components/modals/ChangePassword";
import Contact from "./components/contact/Contact";
import Features from "./components/features/Features";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import Navbar from "./components/navbar/Navbar";
import Subscription from "./components/subscription/Subscription";
const Home = async () => {
  const currentUser = await getCurrentUser();
  return (
    <>
      <ChangePasswordModal />
      <RegisterModal />
      <LoginModal />
      <Container>
        <Navbar currentUser={currentUser} />
        <div className="flex flex-col space-y-[500px] pt-20">
          <Hero />
          <Features />
          <Subscription />
          <Contact />
          <Footer />
        </div>
      </Container>
    </>
  );
};
export default Home;
