import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faFacebookF,
   faTwitter,
   faInstagram,
   faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
   return (
      <footer className="bg-gray-900 text-gray-300 py-10">
         <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo & Description */}
            <div>
               <h2 className="text-2xl font-bold text-white mb-3">EsportX</h2>
               <p className="text-sm">
                  Join tournaments, compete with players, and win real cash
                  prizes.
               </p>
            </div>

            {/* Quick Links */}
            <div>
               <h3 className="text-lg font-semibold text-white mb-3">
                  Quick Links
               </h3>
               <ul className="space-y-2">
                  <li>
                     <a href="#" className="hover:text-orange-400 transition">
                        Home
                     </a>
                  </li>
                  <li>
                     <a href="#" className="hover:text-orange-400 transition">
                        Tournaments
                     </a>
                  </li>
                  <li>
                     <a href="#" className="hover:text-orange-400 transition">
                        How It Works
                     </a>
                  </li>
                  <li>
                     <a href="#" className="hover:text-orange-400 transition">
                        Contact Us
                     </a>
                  </li>
               </ul>
            </div>

            {/* Social Media */}
            <div>
               <h3 className="text-lg font-semibold text-white mb-3">
                  Follow Us
               </h3>
               <div className="flex space-x-4">
                  <a href="#" className="hover:text-orange-400 transition">
                     <FontAwesomeIcon icon={faFacebookF} className="text-2xl" />
                  </a>
                  <a href="#" className="hover:text-orange-400 transition">
                     <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
                  </a>
                  <a href="#" className="hover:text-orange-400 transition">
                     <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                  </a>
                  <a href="#" className="hover:text-orange-400 transition">
                     <FontAwesomeIcon icon={faYoutube} className="text-2xl" />
                  </a>
               </div>
            </div>
         </div>

         {/* Copyright */}
         <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
            &copy; {new Date().getFullYear()} EsportX. All Rights Reserved.
         </div>
      </footer>
   );
};

export default Footer;
