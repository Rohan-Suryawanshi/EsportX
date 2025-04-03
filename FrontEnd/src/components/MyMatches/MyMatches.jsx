import { useState } from "react";

function MyMatches({ ongoingMatches, upcomingMatches, resultMatches }) {
  const [activeTab, setActiveTab] = useState("ongoing");

  const renderMatches = (matches) => {
    if (!matches?.length) {
      return <p className="text-gray-500 text-center py-4">No matches available</p>;
    }
    return matches.map((match, index) => (
      <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-3 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">{match.name}</h3>
        <p className="text-gray-500">Date: {match.date}</p>
        {match.result && (
          <p className={`text-sm font-semibold ${match.result === "Win" ? "text-green-500" : "text-red-500"}`}>
            Result: {match.result}
          </p>
        )}
      </div>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-around border-b mb-4">
        {["ongoing", "upcoming", "results"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-lg font-semibold ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "ongoing" && renderMatches(ongoingMatches)}
        {activeTab === "upcoming" && renderMatches(upcomingMatches)}
        {activeTab === "results" && renderMatches(resultMatches)}
      </div>
    </div>
  );
}

export default MyMatches;
