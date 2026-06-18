import { io } from "socket.io-client";
import { BASE_URL } from "../utils/constants";

//This function creates a connection and 
// returns us the scoket object, where we can send events, emit events, join a chat, send msgs etc.
export const createSocketConnection = () => {

    if(location.hostname==="localhost"){
        //give it a URL where you want it to connect -> BE
        return io(BASE_URL);
    }else{
        return io("/", {path:"/api/socket.io/"});
    }

    
};
