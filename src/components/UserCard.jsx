import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";
import axios from "axios";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoURL, age, gender, about, skills } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, _id) => {
    try{
      const res = axios.post(`${BASE_URL}request/send/${status}/${_id}`,
        {},
        {withCredentials: true});
        dispatch(removeUserFromFeed(_id));
        
    }catch(err){
      //Err handling
    }

  };

  return (
    <div className="card bg-base-content text-base-300 w-96 shadow-sm my-4">
      <figure>
        <img
          src={photoURL}
          alt="ProfileImage"
          className="h-90 w-auto object-cover p-4"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>

                {(age || gender) && (
          <p>
            {age}
            {age && gender && ", "}
            {gender}
          </p>
        )}

        <p>{about}</p>

        <div className="card-actions justify-center my-4">
          <button 
          className="btn btn-primary"
          onClick={()=> handleSendRequest("ignored", _id)}
          >Ignore</button>
          <button 
          className="btn btn-secondary"
          onClick={()=> handleSendRequest("interested", _id)}
          >Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
