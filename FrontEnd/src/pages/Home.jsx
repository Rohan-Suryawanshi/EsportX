import AvailableGames from "../components/AvailableGames/AvailableGames";
import Footer from "../components/Footer/Footer";
import GamerReviews from "../components/GamerReviews/GamerReviews";
import HeroSection from "../components/HeroSection/HeroSection";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import Navbar from "../components/Navbar/Navbar";
import StatsSection from "../components/StatsSection/StatsSection";
import Seo from "../components/Seo";

const HomePage = () => {
   
   return (
      <>
         <Seo
            title="Home"
            description="Esport-X — Competitive esports news, teams, tournaments and live match updates."
            url="/"
            image="https://esport-x-frontend.vercel.app/Gamer.png"
         />
         <Navbar/>
         <HeroSection />
         <AvailableGames />
         <HowItWorks />
         <GamerReviews />
         <StatsSection />
         <Footer />
      </>
   );
};
export default HomePage;
