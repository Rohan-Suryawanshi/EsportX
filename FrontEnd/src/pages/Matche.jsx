import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", type: "", map: "" });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(
           `https://esport-x.vercel.app/api/v1/matches/all-matches?${queryParams}`
        );
        if (response.data.success) {
          setMatches(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="text-center text-lg mt-10">Loading matches...</div>;
  }

  return (
     <>
        <Navbar />
        <div className="min-h-screen bg-antiquewhite text-black p-4 sm:p-8">
           <h1 className="text-4xl font-extrabold text-center mb-8">
              Available <span className="text-orange-500">Matches</span>
           </h1>

           <div className="flex flex-wrap justify-center mb-6 gap-4">
              <select
                 name="status"
                 className="p-3 bg-white text-black rounded-lg w-full sm:w-auto"
                 onChange={handleFilterChange}
              >
                 <option value="">All Status</option>
                 <option value="UPCOMING">Upcoming</option>
                 <option value="ONGOING">Ongoing</option>
                 <option value="COMPLETE">Complete</option>
              </select>
              <select
                 name="type"
                 className="p-3 bg-white text-black rounded-lg w-full sm:w-auto"
                 onChange={handleFilterChange}
              >
                 <option value="">All Types</option>
                 <option value="Solo">Solo</option>
                 <option value="Duo">Duo</option>
                 <option value="Squad">Squad</option>
              </select>
              <input
                 type="text"
                 name="map"
                 className="p-3 bg-white text-black rounded-lg w-full sm:w-auto"
                 placeholder="Search by Map"
                 onChange={handleFilterChange}
              />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.length > 0 ? (
                 matches.map((match) => (
                    <div
                       key={match._id}
                       className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition duration-300"
                    >
                       <div>
                          <h3 className="text-2xl font-bold text-blue-700 mb-2">
                             {match.gameId?.name || "Unknown Game"}
                          </h3>
                          <p className="text-gray-600">
                             <strong>Start:</strong>{" "}
                             {new Date(match.startTime).toLocaleString()}
                          </p>
                          <p className="text-gray-600">
                             <strong>Entry Fee:</strong> ₹{match.entryFee}
                          </p>
                          <p className="text-gray-600">
                             <strong>Per Kill:</strong> ₹{match.perKill}
                          </p>
                          <p className="text-gray-600">
                             <strong>Type:</strong> {match.type}
                          </p>
                          <p className="text-gray-600">
                             <strong>Map:</strong> {match.map}
                          </p>
                          <p className="text-gray-600">
                             <strong>Max Players:</strong> {match.maxPlayers}
                          </p>
                          <p className="mt-2">
                             <span
                                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                                   match.status === "UPCOMING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : match.status === "ONGOING"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-200 text-gray-700"
                                }`}
                             >
                                {match.status}
                             </span>
                          </p>
                       </div>

                       <button
                          className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 rounded-lg hover:shadow-md transition duration-300"
                          onClick={() => alert(`Joining match: ${match._id}`)}
                       >
                          Join Match
                       </button>
                    </div>
                 ))
              ) : (
                 <p className="text-center text-gray-600 col-span-full">
                    No matches available.
                 </p>
              )}
           </div>
        </div>
     </>
  );
}

export default MatchesPage;
