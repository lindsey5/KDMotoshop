import { CreditCard, Truck, MapPin, Headphones, Shield, Clock } from "lucide-react";
import useDarkmode from "../../../hooks/useDarkmode";
import Card from "../../../components/Card";

const features = [
    {
        icon: CreditCard,
        title: "Multiple Payment Options",
        description: "Cash on Delivery, GCash, Maya, and Credit/Debit Cards accepted",
    },
    {
        icon: Truck,
        title: "Free Shipping",
        description: "Enjoy free delivery on all orders nationwide",
    },
    {
        icon: MapPin,
        title: "Nationwide Delivery",
        description: "We deliver anywhere in the Philippines",
    },
        {
        icon: Headphones,
        title: "24/7 AI Chat Support",
        description: "Get instant help anytime with our smart AI chatbot",
        },
    {
        icon: Shield,
        title: "Secure Transactions",
        description: "Safe and encrypted payment processing",
    },
    {
        icon: Clock,
        title: "Fast Processing",
        description: "Orders processed and shipped within 1-3 days",
    },
];

export default function PromoSection({ isParallax } : { isParallax : boolean }) {
    const isDark = useDarkmode();

    return (
        <section
        className={`py-16 transition-colors duration-300 ${
            isParallax && isDark ? "" : isDark ? "bg-gradient-to-r from-gray-900 via-black to-gray-800" : "bg-gray-50"
        }`}
        >
        <div className="max-w-6xl mx-auto px-6">
            <h2
            className={`text-3xl font-bold text-center mb-12 ${
                isDark ? "text-white" : "text-red-600"
            }`}
            >
            Why Shop With Us
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                <Card
                    key={index}
                    className="flex flex-col items-center text-center p-8"
                >
                    <div
                    className={`mb-5 p-4 rounded-xl ${
                        isDark ? "bg-gray-700/50" : "bg-red-50"
                    }`}
                    >
                    <Icon className="w-10 h-10 text-red-600" />
                    </div>
                    <h3
                    className={`text-lg font-semibold mb-2 ${
                        isDark ? "text-white" : "text-gray-900"
                    }`}
                    >
                    {feature.title}
                    </h3>
                    <p
                    className={`text-sm leading-relaxed ${
                        isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                    >
                    {feature.description}
                    </p>
                </Card>
                );
            })}
            </div>
        </div>
        </section>
    );
}
