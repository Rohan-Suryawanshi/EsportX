import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faWallet, faGamepad } from "@fortawesome/free-solid-svg-icons";

function ProfileCard({ user }) {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Account Information</h3>
      <div className="space-y-3 text-gray-600">
        <p className="flex items-center gap-2"><FontAwesomeIcon icon={faEnvelope} /> <span>Email: {user?.email}</span></p>
        <p className="flex items-center gap-2"><FontAwesomeIcon icon={faWallet} /> <span>Wallet Balance: ${user?.walletBalance}</span></p>
        <p className="flex items-center gap-2"><FontAwesomeIcon icon={faGamepad} /> <span>Kills: {user?.kills || 0}</span></p>
      </div>
    </div>
  );
}

export default ProfileCard;
