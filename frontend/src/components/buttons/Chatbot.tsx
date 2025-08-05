import { useEffect, useRef, useState } from "react"
import { postData } from "../../services/api";
import { cn } from "../../utils/utils";
import { IconButton } from "@mui/material";
import { url } from "../../constants/url";

const ChatbotButton = () => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [isHide, setIsHide] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState([ { from: 'bot', content: 'Hi 👋 How can I help?' } ] );

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
        <div className="z-99 fixed bottom-5 right-5">
            <button className="flex gap-5 items-center px-5 py-3 text-white bg-black border border-gray-500 rounded-3xl w-full h-full cursor-pointer hover:scale-105 transition-all 0.3s ease-in" onClick={() => setIsHide(!isHide)}>
                <img className="w-4 h-4 sm:w-8 sm:h-8" src="/icons/chat-box.png" alt="chatbox" />
                <p className="text-xs sm:text-base">Chat with Teemo</p>
            </button>
            {!isHide && <form className="bg-white absolute z-99 flex flex-col animate-fade-in-scale border border-gray-300 rounded-xl w-[90vw] h-[70vh] sm:w-[400px] bottom-[calc(100%+10px)] right-1 sm:bottom-[calc(100%+20px)] sm:right-3" onSubmit={submitMessage}>
                <div className="rounded-t-xl p-5 bg-black">
                    <div className="flex gap-5 items-center mb-2">
                        <img className="w-12 h-12" src="/icons/chat-bot.png"/>
                        <h1 className="text-white text-xl md:text-2xl">Chat with Teemo</h1>
                    </div>
                    <p className="text-gray-400">Powered by Gemini AI</p>
                </div>
                <div className="bg-white p-3 flex-grow overflow-y-auto">
                    {messages.map((message, index) => (
                        <div  
                            ref={index === messages.length -1 ? bottomRef : undefined}  
                            className={cn("my-3 flex", message.from === 'bot' ? 'justify-start' : 'justify-end')}
                        >
                            <div className="flex gap-2 text-sm md:text-base">
                                {message.from === 'bot' && <img className="w-8 h-8" src="/icons/chat-bot.png"/>}
                                <div className={cn("whitespace-pre-line py-3 px-5 rounded-lg", message.from === 'bot' ? 'bg-black text-white' : 'bg-gray-100 border border-gray-300')}>
                                {message.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && <img className="mt-8 w-35 h-25 tranform -translate-6" src="/icons/typing.gif" alt="Typing..." />}
                </div>
                <div className="flex gap-3 px-2 py-5 border-t border-gray-300 rounded-b-xl">
                    <input 
                        placeholder="Type Text"
                        className="flex-1 rounded-lg bg-gray-200 outline-none px-3 py-1"
                        type="text"
                        onChange={(e) => setMessage(e.target.value)} 
                        value={message}
                    />
                    <IconButton type="submit" disabled={loading}>
                        <img className="w-6 h-6" src="/icons/send.png" alt="" />
                    </IconButton>
                </div>
            </form>}
        </div>
    )
}

export default ChatbotButton