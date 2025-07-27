import { useEffect, useRef, useState } from "react"
import SendIcon from '@mui/icons-material/Send';
import { postData } from "../../services/api";
import { url } from "../../constants/url";
import { cn } from "../../utils/utils";
import { IconButton } from "@mui/material";

const ChatbotButton = () => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [isHide, setIsHide] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState(
        [
            { from: 'bot', content: 'Hi' }
        ]
    );

    const submitMessage = async (e :React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage('');
        if(message){
            setLoading(true)
            setMessages(prev => [...prev, { from: 'user', content: message }])
            const response = await postData(`${url}/api/chat`, { message: message });
            if(response.success){
                setMessages(prev => [...prev, { from: 'bot', content: response.response }])
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        if (bottomRef.current && messages.length > 0) {
            bottomRef.current.scrollIntoView();
        }
    }, [messages]);

    return (
        <div className="bg-black shadow-lg shadow-red-500/50 border border-gray-500 rounded-full w-20 h-20 md:w-25 md:h-25 fixed bottom-5 right-5">
            <button className="w-full h-full cursor-pointer" onClick={() => setIsHide(!isHide)}>
                <img className="" src="/icons/Live chatbot.gif" alt="chatbot"/>
            </button>
            {!isHide && <form className="animate-fade-in-scale border border-gray-300 rounded-xl w-[400px] bg-white absolute bottom-[calc(100%+20px)] right-3" onSubmit={submitMessage}>
                <div className="rounded-t-xl p-5 bg-black">
                    <h1 className="text-white text-2xl">Hi 👋 How can we help?</h1>
                </div>
                <div className="bg-white p-3 h-[400px] overflow-y-auto">
                    {messages.map((message, index) => (
                        <div  
                            ref={index === messages.length -1 ? bottomRef : undefined}  
                            className={cn("my-3 flex", message.from === 'bot' ? 'justify-start' : 'justify-end')}
                        >
                            <div className={cn("whitespace-pre-line py-3 px-5 rounded-lg", message.from === 'bot' ? 'bg-black text-white' : 'bg-gray-100 border border-gray-300')}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {loading && <img className="mt-5 w-35 h-25 tranform -translate-5" src="/icons/typing.gif" alt="Typing..." />}
                </div>
                <div className="flex gap-5 px-2 py-5 border-t border-gray-300  rounded-b-xl">
                    <input 
                        className="flex-1 border rounded-lg border-gray-400 outline-none px-3 py-1"
                        type="text"
                        onChange={(e) => setMessage(e.target.value)} 
                        value={message}
                    />
                    <IconButton type="submit" disabled={loading}>
                        <SendIcon />
                    </IconButton>
                </div>
            </form>}
        </div>
    )
}

export default ChatbotButton