import AvailableGames from "../components/AvailableGames/AvailableGames"
import Footer from "../components/Footer/Footer"
import GamerReviews from "../components/GamerReviews/GamerReviews"
import HeroSection from "../components/HeroSection/HeroSection"
import HowItWorks from "../components/HowItWorks/HowItWorks"
import Navbar from "../components/Navbar/Navbar"
import StatsSection from "../components/StatsSection/StatsSection"

const HomePage=()=>{
    return (
        <>
            <Navbar/>
            <HeroSection/>
            <AvailableGames/>
            <HowItWorks/>
            <GamerReviews/>
            <StatsSection/>
            <Footer/>
        </>
    )
}
export default HomePage;