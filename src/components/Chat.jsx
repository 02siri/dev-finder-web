import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {createSocketConnection} from "../utils/socket"
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";


const Chat = () =>{
    const navigate = useNavigate();
    const {targetUserId} = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const user = useSelector(store=>store.user);
    const firstName = user?.firstName;
    const userId = user?._id;
    const socketRef = useRef(null); // Reference to the persistent socket connection


    const fetchChatMessages = async()=>{
        try{const chat = await axios.get(BASE_URL + "chat/" + targetUserId, 
            { withCredentials: true,});

        console.log(chat.data.messages);

        const chatMessages = chat?.data?.messages.map((msg)=>{
            const {senderId, text} = msg;
            return {
                firstName: msg?.senderId?.firstName, 
                lastName:msg?.senderId?.lastName,
                text,
        };
        });
        setMessages(chatMessages);
        }catch(err){
             if (err.response?.status === 403) {
            navigate("/");
            }
        }
    };

    useEffect(()=>{
        fetchChatMessages();
    },[]);

    //As soon as the page loads, the socket connection is made, 
    //and joinChat event is emitted
    useEffect(()=>{
        
        if(!userId){
            return;
        }

        // Establish socket connection and cache in ref
        const socket = createSocketConnection();
        socketRef.current = socket

                //event called    //data
        socket.emit("joinChat", {firstName, userId, targetUserId});

        //listening to the event (server sent message back to client)
        socket.on("messageReceived", ({firstName, lastName, text})=>{
            console.log(firstName + ": " + text);
            setMessages((messages)=>[...messages ,{text,firstName, lastName}]);
        });

        // Listen for connection or authentication errors
        socket.on("connect_error", (err) => {
            console.error("Socket authentication/connection error:", err.message);
        });

        //Fn called when component unmounts
        return () => {
            //Very imp to disconnect the socket
            socket.disconnect();
            socketRef.current = null;
        };
    },[userId, targetUserId]);

    const sendMessage = () => {
        const socket = createSocketConnection();
       // Send messages using the existing connection
    const sendMessage = () => {
        if (socketRef.current && newMessage.trim()) {
            socketRef.current.emit("sendMessage",{
                targetUserId,
                text: newMessage,
            });
            setNewMessage("");
        }
    };
    };


    return(
    <div className="w-3/4 mx-auto border border-gray-100 m-5 h-[70vh] flex flex-col">
        <h1 className="p-5 border-b border-gray-200">Chat</h1>
        
        <div className="flex-1 overflow-scroll p-5">
            {messages.map((msg, index) => {
            return (
                <div key={index} className={
                    "chat " + 
                    (user.firstName === msg.firstName ? "chat-end" : "chat-start")
                    }>
                    <div className="chat-header">
                        {`${msg.firstName} ${msg.lastName} `}
                        <time className="text-xs opacity-50">2 hours ago</time>
                    </div>
                    <div className="chat-bubble">{msg.text}</div>
                    <div className="chat-footer opacity-50">Seen</div>
                </div>
            );
            })}
        </div>

        <div className="p-5 border-t border-gray-200 flex items-center gap-2">
            <input 
            value = {newMessage}
            onChange={(e)=>setNewMessage(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    sendMessage();
                }
            }}
            className="flex-1 border border-gray-100 text-white rounded"></input>
            <button 
            onClick ={sendMessage}
            className="btn btn-secondary">Send</button>
        </div>
        </div>
    );
};

export default Chat;