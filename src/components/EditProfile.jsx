import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";


const EditProfile = ({user}) => {
    
    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [age, setAge] = useState(user.age || "");
    const [gender, setGender] = useState(user.gender || "");
    const [about, setAbout] = useState(user.about || "");
    const [photoURL, setPhotoURL] = useState(user.photoURL || "");

    const [toast, setToast] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const saveProfile = async () => {
        //Clear errors before saving profile
        setError("");
        try{
            const res = await axios.patch(BASE_URL + "profile/edit",{
                firstName,
                lastName,
                photoURL,
                age,
                gender,
                about,
            },{withCredentials: true,}
        );

        dispatch(addUser(res?.data?.data));
        setToast(true);
        setTimeout(()=>{
            setToast(false);
        },3000);
        
        }catch(err){
            setError(err.response.data);
        }
    };
    
    return (
        <div className="flex justify-center my-10">  
    <div className="flex justify-center  mx-10">
    <div className="card card-border bg-base-content w-96 text-base-200">
  <div className="card-body">
    <h2 className="card-title justify-center">Edit Profile</h2>
    
    <label className="input input-bordered flex items-center gap-2 my-4">
    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="white"
        stroke="currentColor"
        >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        </g>
    </svg>
    <input
        type="text"
        className="grow text-base-content"
        value={firstName}
        onChange={(e)=>setFirstName(e.target.value)}
        required
        placeholder="First Name"
        // pattern="[A-Za-z][A-Za-z0-9\-]*"
        // minlength="3"
        // maxlength="30"
        // title="Only letters, numbers or dash"
    />
    </label>

    <label className="input input-bordered flex items-center gap-2 my-4">
    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="white"
        stroke="currentColor"
        >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        </g>
    </svg>
    <input
        type="text"
        className="grow text-base-content"
        value={lastName}
        onChange={(e)=>setLastName(e.target.value)}
        required
        placeholder="Last Name"
        // pattern="[A-Za-z][A-Za-z0-9\-]*"
        // minlength="3"
        // maxlength="30"
        // title="Only letters, numbers or dash"
    />
    </label>
    
    <label className="input input-bordered flex items-center gap-2 my-4">
    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="white"
        stroke="currentColor"
        >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        </g>
    </svg>
    <input
        type="text"
        className="grow text-base-content"
        value={photoURL}
        onChange={(e)=>setPhotoURL(e.target.value)}
        required
        placeholder="Photo URL"
        // pattern="[A-Za-z][A-Za-z0-9\-]*"
        // minlength="3"
        // maxlength="30"
        // title="Only letters, numbers or dash"
    />
    </label>

    <label className="input input-bordered flex items-center gap-2 my-4">
    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="white"
        stroke="currentColor"
        >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        </g>
    </svg>
    <input
        type="number"
        className="grow text-base-content"
        value={age}
        onChange={(e)=>setAge(e.target.value)}
        required
        placeholder="Age"
        // pattern="[A-Za-z][A-Za-z0-9\-]*"
        // minlength="3"
        // maxlength="30"
        // title="Only letters, numbers or dash"
    />
    </label>

    <label className="input input-bordered flex items-center gap-2 my-4">
    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="white"
        stroke="currentColor"
        >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        </g>
    </svg>
    <input
        type="text"
        className="grow text-base-content"
        value={gender}
        onChange={(e)=>setGender(e.target.value)}
        required
        placeholder="Gender"
        // pattern="[A-Za-z][A-Za-z0-9\-]*"
        // minlength="3"
        // maxlength="30"
        // title="Only letters, numbers or dash"
    />
    </label>

    <label className="input input-bordered flex items-center gap-2 my-4">
    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2.5"
        fill="white"
        stroke="currentColor"
        >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        </g>
    </svg>
    <input
        type="text"
        className="grow text-base-content"
        value={about}
        onChange={(e)=>setAbout(e.target.value)}
        required
        placeholder="About"
        // pattern="[A-Za-z][A-Za-z0-9\-]*"
        // minlength="3"
        // maxlength="30"
        // title="Only letters, numbers or dash"
    />
    </label>

    {error && 
    (<p className="text-red-500">{error}</p>)
    }
    
    <div className="card-actions justify-center m-2">
      <button className="btn btn-primary" onClick={saveProfile}>Save</button>
   </div>

  </div>
  </div>
    </div>
    <UserCard user = {{firstName, lastName, photoURL, age, gender, about}}/>

    {toast && (
     <div className="toast toast-top toast-end mt-20 rounded-sm">
    <div className="alert alert-success">
        <span>Profile Updated Successfully!</span>
    </div>
    </div>
   )}

    </div>
);
};

export default EditProfile;