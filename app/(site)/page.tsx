import getCurrentUser from "../actions/getCurrentUser";
import getStats from "../actions/getStats";
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
  const {users, companies, orders} = await getStats();
  const currentUser = await getCurrentUser();
  return (
    <>
      <ChangePasswordModal />
      <RegisterModal />
      <LoginModal />
      <Container>
        <Navbar currentUser={currentUser} />
        <div className="flex flex-col">
          <Hero />
          <Features users={users} companies={companies} orders={orders} />
          <Subscription />
          <Contact />
          <Footer />
        </div>
      </Container>
    </>
  );
};
export default Home;
