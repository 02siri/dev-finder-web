import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
    const navigate = useNavigate();
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const user = useSelector((store) => store.user);
    const firstName = user?.firstName;
    const userId = user?._id;
    
    const socketRef = useRef(null); // Reference to the persistent socket connection
    const chatContainerRef = useRef(null); // Reference to the chat scrollable area

//isAtBottom function to check if the user is actively at the bottom of the conversation:
    const isAtBottom = () => {
        const container = chatContainerRef.current;
        if (!container) return false;
        const threshold = 150; // px threshold from bottom
        return container.scrollHeight - container.clientHeight - container.scrollTop <= threshold;
    };

    // Scroll to the bottom instantly
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    // Fetch paginated messages
    const fetchChatMessages = async (pageNumber) => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const res = await axios.get(
                `${BASE_URL}chat/${targetUserId}?page=${pageNumber}&limit=10`, 
                { withCredentials: true }
            );

            const chatMessages = res?.data?.messages.map((msg) => {
                const { senderId, text } = msg;
                return {
                    firstName: senderId?.firstName, 
                    lastName: senderId?.lastName,
                    text,
                    createdAt: msg.createdAt
                };
            }) || [];

            const container = chatContainerRef.current;
            const previousScrollHeight = container ? container.scrollHeight : 0;
            const previousScrollTop = container ? container.scrollTop : 0;

            //Initial Load
            if (pageNumber === 1) {
                setMessages(chatMessages);
                // Snap to bottom on first page load
                setTimeout(() => {
                    scrollToBottom();
                }, 30);
            } else {
                //Prepend older messages when page >1
                setMessages((prev) => [...chatMessages, ...prev]);
                // Lock scroll position so it doesn't jump
                setTimeout(() => {
                    if (chatContainerRef.current) {
                        // Preserve the user's scroll position relative to the message they were viewing
                        const newScrollHeight = chatContainerRef.current.scrollHeight;
                        chatContainerRef.current.scrollTop = 
                            newScrollHeight - previousScrollHeight + previousScrollTop;
                    }
                }, 30);
            }

            setHasMore(res.data.hasMore);
            setPage(pageNumber);
        } catch (err) {
            if (err.response?.status === 403) {
                navigate("/");
            }
        } finally {
            setIsFetching(false);
        }
    };

    // Initial load when targetUserId changes
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setMessages([]);
        fetchChatMessages(1);
    }, [targetUserId]);

    // Handle scroll event for infinite pagination
    const handleScroll = () => {
        const container = chatContainerRef.current;
        if (!container || isFetching || !hasMore) return;

        //When a user scrolls to the top (within 50px of the top margin), we automatically request the next page:
        if (container.scrollTop <= 50) {
            fetchChatMessages(page + 1);
        }
    };

    // Setup Socket connection and listeners
    useEffect(() => {
        if (!userId) return;
        
        // Establish or retrieve the global socket connection
        const socket = createSocketConnection();
        socketRef.current = socket;

        // Join the chat room
        socket.emit("joinChat", { firstName, userId, targetUserId });

        // Listen for new incoming messages
        socket.on("messageReceived", ({ firstName, lastName, text }) => {
            const shouldScroll = isAtBottom();
            
            setMessages((prev) => [...prev, { text, firstName, lastName, createdAt: new Date() }]);

            // Only auto-scroll down if the user is already near the bottom
            if (shouldScroll) {
                setTimeout(() => {
                    scrollToBottom();
                }, 30);
            }
        });

        // Listen for error messages
        socket.on("error", (err) => {
            console.error("Socket error event:", err.message);
        });

        // Clean up listeners on unmount
        return () => {
            if (socket) {
                socket.off("messageReceived");
                socket.off("error");
            }
            socketRef.current = null;
        };
    }, [userId, targetUserId]);

    // Send message handler
    const sendMessage = () => {
        if (socketRef.current && newMessage.trim()) {
            socketRef.current.emit("sendMessage", {
                targetUserId,
                text: newMessage,
            });
            setNewMessage("");
            
            // Always scroll to bottom for sender's own new message
            setTimeout(() => {
                scrollToBottom();
            }, 30);
        }
    };

    return (
        <div className="w-full md:w-3/4 mx-auto border border-gray-700 m-5 h-[75vh] flex flex-col rounded-xl bg-base-100 shadow-2xl">
            <div className="p-5 border-b border-gray-700 flex justify-between items-center bg-base-200 rounded-t-xl">
                <h1 className="font-bold text-lg text-white">Chat Room</h1>
                {isFetching && (
                    <span className="loading loading-spinner loading-xs text-secondary"></span>
                )}
            </div>
            
            <div 
                ref={chatContainerRef}
                //listener when a user scrolls
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-5 space-y-4"
            >
                {hasMore && messages.length >= 10 && (
                    <div className="text-center py-2">
                        <span className="text-xs text-gray-500">Scroll up to load older messages</span>
                    </div>
                )}

                {messages.length === 0 && !isFetching && (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        No messages yet. Say hello!
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isSelf = user.firstName === msg.firstName;
                    return (
                        <div 
                            key={index} 
                            className={`chat ${isSelf ? "chat-end" : "chat-start"}`}
                        >
                            <div className="chat-header text-gray-400 text-xs mb-1">
                                {`${msg.firstName} ${msg.lastName || ""} `}
                                <span className="opacity-50 text-[10px] ml-1">
                                    {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>
                            </div>
                            <div 
                                className={`chat-bubble text-sm max-w-lg break-words ${
                                    isSelf 
                                        ? "chat-bubble-secondary text-white" 
                                        : "bg-base-300 text-gray-100"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-5 border-t border-gray-700 flex items-center gap-2 bg-base-200 rounded-b-xl">
                <input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 input input-bordered bg-base-300 text-white border-gray-600 focus:outline-none"
                />
                <button 
                    onClick={sendMessage}
                    className="btn btn-secondary px-6 font-semibold"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;