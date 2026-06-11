import { useState,useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Premium = () => {

  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {

    const verifyPremium = async () => {
      try {
        const res = await axios.get
          (BASE_URL + "/payment/premium/verify", 
            { withCredentials: true,});
        if (res.data.isPremium) {
          setIsUserPremium(true);
        }
      } catch (err) {
        console.error("Failed to verify premium status:", err);
      }
    };
    verifyPremium();
  }, []);

  const handleBuyClick = async (type) => {
    try {
      const res = await axios.post(
        BASE_URL + "payment/createProduct",
        { membershipType: type },
        { withCredentials: true }
      );

      // Redirect user to Stripe-hosted checkout page
      window.location.href = res.data.checkoutUrl;

    } catch (err) {
      console.error("Payment initiation failed:", err);
    }
  };

  return (
   isUserPremium? ("You're already a Premium User"):
   (<div>
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
  )
  );
};

export default Premium;