import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const verifyPremium = async () => {
      try {
        // Double check your BASE_URL value! It must point to https://dev-finder.online/api/ (or your actual backend)
        const res = await axios.get(BASE_URL + "premium/verify", {
          withCredentials: true,
        });
        
        if (res.data.isPremium) {
          setIsUserPremium(true);
        }
      } catch (err) {
        console.error("Failed to verify premium status:", err);
      } finally {
        setLoading(false); // Stop loading regardless of success/error
      }
    };
    verifyPremium();
  }, []);

  if (loading) {
    return <div className="text-center m-10">Checking membership status...</div>;
  }

  if (isUserPremium) {
    return <div className="text-center m-10 font-bold text-2xl">You're already a Premium User</div>;
  }

  return (
    <div>
      <div className="m-10">
        <div className="flex w-full">
          <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
            <h1 className="font-bold text-3xl">Silver Membership</h1>
            <ul>
              <li>• Chat with other people</li>
              <li>• 100 Connection Requests per day</li>
              <li>• Verified Account</li>
              <li>• 3 Months</li>
            </ul>
            <button
              onClick={() => handleBuyClick("Silver")}
              className="btn btn-secondary"
            >
              Buy Membership
            </button>
          </div>
          <div className="divider divider-horizontal">OR</div>
          <div className="card bg-base-300 rounded-box grid h-80 grow place-items-center">
            <h1 className="font-bold text-3xl">Gold Membership</h1>
            <ul>
              <li>• Chat with other people</li>
              <li>• Unlimited Connection Requests per day</li>
              <li>• Verified Account</li>
              <li>• 6 Months</li>
            </ul>
            <button
              onClick={() => handleBuyClick("Gold")}
              className="btn btn-primary"
            >
              Buy Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;