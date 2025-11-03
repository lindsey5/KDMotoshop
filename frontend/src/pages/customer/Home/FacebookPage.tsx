import { useEffect } from "react";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn } from "../../../utils/utils";
import Card from "../../../components/Card";

declare global {
  interface Window {
    FB: any;
  }
}

const FacebookPage: React.FC = () => {
    const isDark = useDarkmode();

    useEffect(() => {
        if (!window.FB) {
        const script = document.createElement("script");
        script.src =
            "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
        script.async = true;
        document.body.appendChild(script);
        } else {
        window.FB.XFBML.parse();
        }
    }, []);

    return (
        <div
        className={cn(
            "min-h-screen py-16 px-4",
            isDark ? "bg-[#1e1e1e]" : "bg-gradient-to-br from-red-50 via-white to-red-50"
        )}
        >
        <div className="max-w-7xl mx-auto">
            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Facebook Timeline Section */}
            <Card className="overflow-hidden">
                <div className="p-6">
                <div className="mb-6">
                    <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>KD Motoshop</h2>
                    <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-600")}>Official Facebook Page</p>
                </div>

                <div className="rounded-lg overflow-hidden">
                    <div
                    className="fb-page w-full"
                    data-href="https://www.facebook.com/KDmotoshop"
                    data-tabs="timeline"
                    data-small-header="false"
                    data-adapt-container-width="true"
                    data-hide-cover="false"
                    data-show-facepile="true"
                    ></div>
                </div>
                </div>
            </Card>
            {/* Info Section */}
            <div className="space-y-6">
                <Card>
                <h3 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>Stay Connected</h3>
                <p className={cn("text-base leading-relaxed mb-6", isDark ? "text-gray-400" : "text-gray-600")}>
                    Stay up to date with our newest products, special promotions, and community events. Join thousands of satisfied customers in our Facebook community.
                </p>
                <ul className="space-y-3">
                    {[
                    "New arrivals and featured products",
                    "Exclusive promotions and deals",
                    "Customer testimonials and reviews",
                    "Community events and updates",
                    ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg
                            className="w-3.5 h-3.5 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                            />
                        </svg>
                        </div>
                        <span
                        className={cn(
                            "text-sm",
                            isDark ? "text-gray-300" : "text-gray-700"
                        )}
                        >
                        {item}
                        </span>
                    </li>
                    ))}
                </ul>
                </Card>

                <Card>
                <h3 className="text-xl font-bold mb-3">
                    Join Our Community
                </h3>
                <p className="text-gray-500 mb-6 text-sm">
                    Connect with us on Facebook for exclusive content and special offers!
                </p>
                <a
                    href="https://www.facebook.com/KDmotoshop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-400 transition-colors shadow-lg"
                >
                    <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Follow Us
                </a>
                </Card>
            </div>
            </div>
        </div>
        </div>
    );
};

export default FacebookPage;
