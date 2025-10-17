import React, { useState } from "react";
import useDarkmode from "../../hooks/useDarkmode";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact: React.FC = () => {
    const isDark = useDarkmode();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you can handle form submission (e.g., API call)
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
    };

    return (
        <main className={`pt-20 pb-5 min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-gradient-to-br from-red-50 via-red-100 to-red-200"}`}>
        
        {/* Hero Section */}
        <div className={`relative overflow-hidden ${isDark ? "bg-gradient-to-r from-red-900 to-red-800" : "bg-red-600"}`}>
            <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-red-100 text-lg">
                We're here to help! Reach out to us through the form below or via our contact info.
            </p>
            </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div className={`space-y-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
            <p>Have questions or need assistance? Our team is ready to help.</p>
            <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-600" />
                <span>KDmotoshop@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-600" />
                <span>+63 912 345 6789</span>
            </div>
            <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <span>Taguig City, Philippines</span>
            </div>
            </div>

            {/* Contact Form */}
            <form 
            onSubmit={handleSubmit} 
            className={`space-y-4 rounded-2xl p-6 ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200 shadow-sm"}`}
            >
            {submitted && (
                <p className="text-green-500 font-semibold text-center">
                Your message has been sent!
                </p>
            )}
            <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all ${
                isDark ? "bg-gray-800 text-white placeholder-gray-400" : "bg-red-50 text-gray-900 placeholder-gray-500"
                }`}
            />
            <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all ${
                isDark ? "bg-gray-800 text-white placeholder-gray-400" : "bg-red-50 text-gray-900 placeholder-gray-500"
                }`}
            />
            <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all ${
                isDark ? "bg-gray-800 text-white placeholder-gray-400" : "bg-red-50 text-gray-900 placeholder-gray-500"
                }`}
            />
            <button
                type="submit"
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                isDark ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl"
                }`}
            >
                Send Message
            </button>
            </form>

        </div>

        {/* Footer */}
        <footer className={`text-center mt-12 pt-8 border-t ${isDark ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-500"}`}>
            <p>© {new Date().getFullYear()} KD Motoshop. All rights reserved.</p>
        </footer>
        </main>
    );
};

export default Contact;
