import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import LoginPage from "./Login";

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", type: "", map: "" });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(`/api/matches?${queryParams}`);
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
    <Navbar/>
    <div className="min-h-screen bg-antiquewhite text-black p-4 sm:p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8">Available <span className="text-orange-500">Matches</span></h1>
      
      <div className="flex flex-wrap justify-center mb-6 gap-4">
        <select name="status" className="p-3 bg-white text-black rounded-lg w-full sm:w-auto" onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETE">Complete</option>
        </select>
        <select name="type" className="p-3 bg-white text-black rounded-lg w-full sm:w-auto" onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="Solo">Solo</option>
          <option value="Duo">Duo</option>
          <option value="Squad">Squad</option>
        </select>
        <input type="text" name="map" className="p-3 bg-white text-black rounded-lg w-full sm:w-auto" placeholder="Search by Map" onChange={handleFilterChange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match._id} className="shadow-xl rounded-2xl border border-gray-300 bg-white p-6">
              <h3 className="text-2xl font-semibold mb-2 text-blue-600">{match.gameId.name}</h3>
              <p className="text-gray-600">Start Time: {new Date(match.startTime).toLocaleString()}</p>
              <p className="text-gray-600">Entry Fee: {match.entryFee}</p>
              <p className="text-gray-600">Per Kill: {match.perKill}</p>
              <p className="text-gray-600">Type: {match.type}</p>
              <p className="text-gray-600">Map: {match.map}</p>
              <p className="text-gray-600">Max Players: {match.maxPlayers}</p>
              <p className="text-gray-600 font-bold">Status: {match.status}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No matches available.</p>
        )}
      </div>
    </div>
    </>
  );
}

export default MatchesPage;
