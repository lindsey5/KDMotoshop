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
    const [messages, setMessages] = useState([ { from: 'bot', content: 'Hi' } ] );

    const submitMessage = async (e :React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage('');
        if(message){
            setLoading(true)
            const thread_id = localStorage.getItem('thread_id')
            setMessages(prev => [...prev, { from: 'user', content: message }])
            const response = await postData(`${url}api/chat`, { message: message, thread_id });
            if(response.success){
                if(!thread_id) localStorage.setItem('thread_id', response.thread_id)
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
        <div className="w-20 h-20 fixed bottom-5 right-5">
            <button className="bg-black shadow-lg shadow-red-500/50 border border-gray-500 rounded-full w-full h-full cursor-pointer hover:scale-110 transition-all 0.3s ease-in" onClick={() => setIsHide(!isHide)}>
                <img className="" src="/icons/Live chatbot.gif" alt="chatbot"/>
            </button>
            {!isHide && <form className="bg-white absolute z-99 flex flex-col animate-fade-in-scale border border-gray-300 rounded-xl w-[90vw] h-[70vh] sm:w-[400px] bottom-[calc(100%+10px)] right-1 sm:bottom-[calc(100%+20px)] sm:right-3" onSubmit={submitMessage}>
                <div className="rounded-t-xl p-5 bg-black">
                    <h1 className="text-white text-2xl">Hi 👋 How can I help?</h1>
                </div>
                <div className="bg-white p-3 flex-grow overflow-y-auto">
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
                    {loading && <img className="mt-8 w-35 h-25 tranform -translate-6" src="/icons/typing.gif" alt="Typing..." />}
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