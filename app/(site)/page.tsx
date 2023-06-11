import getCurrentUser from "../actions/getCurrentUser";
import getStats from "../actions/getStats";
import Container from "../components/Container";
import ChangePasswordModal from "../components/modals/ChangePassword";
import Contact from "./components/contact/Contact";
import Features from "./components/features/Features";
import Hero from "./components/hero/Hero";
import CreateCompany from "./components/modals/CreateCompany";
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
      <CreateCompany />
      <LoginModal />
      <Container>
        <Navbar currentUser={currentUser} />
        <div className="flex flex-col">
          <Hero />
          <Features users={users} companies={companies} orders={orders} />
          <Subscription />
          <Contact />
        </div>
      </Container>
    </>
  );
};
export default Home;
