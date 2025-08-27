import { useEffect, useRef, useState } from "react";
import { postData } from "../../services/api";
import { cn } from "../../utils/utils";
import { url } from "../../constants/url";
import useDarkmode from '../../hooks/useDarkmode';
import { Cpu } from "lucide-react";

const ChatbotButton = () => {
    const isDark = useDarkmode();
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [isHide, setIsHide] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState([{ from: 'bot', content: 'Hi 👋 How can I help?' }]);

    const submitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        const thread_id = localStorage.getItem('thread_id');
        setMessages(prev => [...prev, { from: 'user', content: message }]);
        setMessage('');

        const response = await postData(`${url}api/chat`, { message, thread_id });
        if (response.success) {
            if (!thread_id) localStorage.setItem('thread_id', response.thread_id);
            setMessages(prev => [...prev, { from: 'bot', content: response.response }]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (bottomRef.current && messages.length > 0) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="z-50 fixed bottom-6 right-6">
            {/* Floating Button */}
            <button
                className={cn(
                    "cursor-pointer group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-300 ease-out shadow-lg hover:shadow-xl transform hover:scale-105",
                    isDark
                        ? "bg-gradient-to-r from-red-700 to-red-600 text-white border border-red-500/20"
                        : "bg-gradient-to-r from-red-600 to-red-500 text-white border border-red-400/20",
                    "backdrop-blur-sm"
                )}
                onClick={() => setIsHide(!isHide)}
            >
                <div className="relative">
                    <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200",
                        isDark ? "bg-white/20" : "bg-white/30"
                    )}>
                        <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div className={cn(
                        "absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse",
                        "bg-green-500"
                    )}></div>
                </div>
                <span className="hidden sm:block">Chat with Echo</span>
                <div className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    isDark
                        ? "bg-gradient-to-r from-red-500/20 to-red-600/20"
                        : "bg-gradient-to-r from-red-400/20 to-red-500/20"
                )}></div>
            </button>

            {/* Chat Window */}
            {!isHide && (
                <div className={cn(
                    "absolute z-50 flex flex-col border rounded-3xl w-[90vw] h-[75vh] sm:w-[420px] sm:h-[600px] bottom-[calc(100%+16px)] right-0 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out animate-in slide-in-from-bottom-4 fade-in-0",
                    isDark
                        ? "bg-gray-900/95 border-gray-700/50"
                        : "bg-white/95 border-gray-200/50"
                )}>
                    {/* Header */}
                    <div className={cn(
                        "rounded-t-3xl p-6 relative overflow-hidden",
                        isDark ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-gradient-to-r from-gray-50 to-gray-100"
                    )}>
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/10"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "relative w-12 h-12 rounded-2xl flex items-center justify-center",
                                    isDark ? "bg-red-700/20" : "bg-red-500/10"
                                )}>
                                    <Cpu className={cn("w-6 h-6", isDark ? "text-red-400" : "text-red-600")} />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <h1 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>Echo AI</h1>
                                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Powered by Gemini</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsHide(true)}
                                className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-200",
                                    isDark
                                        ? "hover:bg-gray-700/50 text-gray-400 hover:text-gray-200"
                                        : "hover:bg-gray-200/50 text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className={cn("flex-1 overflow-y-auto p-4 space-y-4", isDark ? "bg-gray-900/50" : "bg-gray-50/30")}>
                        {messages.map((msg, index) => (
                            <div key={index} ref={index === messages.length - 1 ? bottomRef : undefined} className={cn("flex", msg.from === 'bot' ? 'justify-start' : 'justify-end')}>
                                <div className={cn("flex items-end gap-3 max-w-[85%]", msg.from === 'user' && "flex-row-reverse")}>
                                    {msg.from === 'bot' && (
                                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", isDark ? "bg-red-700/20" : "bg-red-500/10")}>
                                            <Cpu className={cn("w-4 h-4", isDark ? "text-red-400" : "text-red-600")} />
                                        </div>
                                    )}
                                    <div className={cn(
                                        "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line",
                                        msg.from === 'bot'
                                            ? isDark
                                                ? "bg-gray-800 text-gray-100 border border-gray-700/50"
                                                : "bg-white text-gray-800 border border-gray-200/50 shadow-lg"
                                            : isDark
                                                ? "bg-gradient-to-r from-red-700 to-red-600 text-white"
                                                : "bg-gradient-to-r from-red-600 to-red-500 text-white"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-end gap-3">
                                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", isDark ? "bg-red-700/20" : "bg-red-500/10")}>
                                        <Cpu className={cn("w-4 h-4", isDark ? "text-red-400" : "text-red-600")} />
                                    </div>
                                    <div className={cn("px-4 py-3 rounded-2xl", isDark ? "bg-gray-800 border border-gray-700/50" : "bg-white border border-gray-200/50 shadow-lg")}>
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0ms', backgroundColor: isDark ? '#9CA3AF' : '#6B7280' }}></div>
                                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '150ms', backgroundColor: isDark ? '#9CA3AF' : '#6B7280' }}></div>
                                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '300ms', backgroundColor: isDark ? '#9CA3AF' : '#6B7280' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={submitMessage} className="p-4">
                        <div className={cn(
                            "flex items-center gap-3 p-2 rounded-2xl border backdrop-blur-sm transition-colors duration-200",
                            isDark
                                ? "bg-gray-800/80 border-gray-600/50 focus-within:border-red-500/50"
                                : "bg-white/80 border-gray-200/50 focus-within:border-red-400/50 shadow-lg"
                        )}>
                            <input
                                type="text"
                                className={cn(
                                    "flex-1 px-4 py-3 bg-transparent outline-none text-sm placeholder:text-sm",
                                    isDark ? "text-gray-100 placeholder:text-gray-500" : "text-gray-800 placeholder:text-gray-500"
                                )}
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || loading}
                                className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    isDark
                                        ? "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white"
                                        : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white",
                                    "hover:scale-105 active:scale-95"
                                )}
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default ChatbotButton;
