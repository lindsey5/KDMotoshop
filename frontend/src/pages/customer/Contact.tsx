import React, { useState } from "react";
import useDarkmode from "../../hooks/useDarkmode";
import { Mail, Phone, MapPin } from "lucide-react";
import { RedTextField } from "../../components/Textfield";
import { RedButton } from "../../components/buttons/Button";
import Card from "../../components/Card";
import { cn } from "../../utils/utils";

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
        <main className={`pt-20 pb-5 min-h-screen transition-colors duration-300 ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}>
        
        {/* Hero Section */}
        <div className={cn(`relative overflow-hidden bg-red-600`, isDark && 'bg-gradient-to-r from-red-900 to-red-800')}>
            <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-red-100 text-md md:text-lg">
                We're here to help! Reach out to us through the form below or via our contact info.
            </p>
            </div>
        </div>

        {/* Contact Section */}
        <form 
            onSubmit={handleSubmit} 
            className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12"
        >
            
            {/* Contact Info */}
            <div className={`space-y-6 text-gray-300 ${isDark ? "text-white" : "text-gray-700"}`}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Get in Touch</h2>
            <p>Have questions or need assistance? Our team is ready to help.</p>
            <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-600" />
                <span className="text-sm md:text-md">KDmotoshop@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-600" />
                <span className="text-sm md:text-md">+63 912 345 6789</span>
            </div>
            <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="text-sm md:text-md">Taguig City, Philippines</span>
            </div>
            </div>

            {/* Contact Form */}
            <Card className="flex flex-col gap-4 p-10">
            {submitted && (
                <p className="text-green-500 font-semibold text-center">
                Your message has been sent!
                </p>
            )}
            <RedTextField 
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
            />
            <RedTextField 
                type="email"
                placeholder="Your Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                value={email}
            />
            <RedTextField 
                rows={5}
                placeholder="Your Message"
                onChange={(e) => setMessage(e.target.value)}
                required
                value={message}
            />
            <RedButton type="submit">Send Message</RedButton>
            </Card>

        </form>

        {/* Footer */}
        <footer className={`text-center mt-12 pt-8 border-t ${isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-500"}`}>
            <p>© {new Date().getFullYear()} KD Motoshop. All rights reserved.</p>
        </footer>
        </main>
    );
};

export default Contact;
