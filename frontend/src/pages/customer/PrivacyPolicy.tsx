import Card from "../../components/Card";
import useDarkmode from "../../hooks/useDarkmode";
import { Shield, Lock, Users, FileText, CreditCard, Clock, Mail } from "lucide-react";

const PrivacyPolicy = () => {
    const isDark = useDarkmode();
    const lastUpdated = "October 17, 2025";

    const sections = [
        {
            icon: FileText,
            title: "Information We Collect",
            content: "We collect only essential information necessary to process your orders and provide better service, including your name, contact details, delivery address, and account login information. We do not collect credit card or banking information."
        },
        {
            icon: Users,
            title: "How We Use Your Information",
            content: "Your information is used to process orders, provide support, improve services, and optionally send promotional offers if you opt in."
        },
        {
            icon: Lock,
            title: "Data Security",
            content: "Customer data is encrypted and securely stored. Sensitive data transfers occur only over HTTPS. We follow best practices to prevent unauthorized access."
        },
        {
            icon: Shield,
            title: "Sharing of Information",
            content: "We do not share your personal information with third parties without your consent, except as required by law or to fulfill essential services."
        },
        {
            icon: CreditCard,
            title: "Payment Information",
            content: "We do not store payment information. All transactions are handled securely through third-party providers such as PayMongo, GCash, or PayMaya. Cash on Delivery (COD) is also available in select areas."
        },
        {
            icon: Clock,
            title: "Data Retention",
            content: "We retain customer information only as long as necessary to fulfill services and meet legal requirements."
        },
        {
            icon: Mail,
            title: "Contact Us",
            content: "For questions regarding this Privacy Policy, contact us via our",
            link: true
        }
    ];

    return (
        <main className={`pt-20 min-h-screen transition-colors duration-300 ${isDark ? "bg-[#1e1e1e]" : "bg-gray-50"}`}>
            {/* Hero Section */}
            <div className={`relative overflow-hidden ${isDark ? "bg-gradient-to-r from-red-900 to-red-800" : "bg-red-600"}`}>
                <div className="max-w-6xl mx-auto px-6 py-16 text-center">
                    <Shield className="w-16 h-16 text-white mx-auto mb-4" />
                    <h1 className="text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-red-100 text-lg mb-2">Your privacy matters to us. Learn how we protect your data.</p>
                    <span className="text-white">Last Updated: {lastUpdated}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <Card key={index} className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDark ? "border border-gray-800 hover:border-red-500" : "border border-gray-200 hover:border-red-400 hover:shadow-red-100"}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8 text-red-500">
                                    <Icon className="w-full h-full" />
                                </div>

                                <div>
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <h2 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                                        {section.title}
                                    </h2>

                                    <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                                        {section.content}
                                        {section.link && (
                                            <>
                                                {" "}
                                                <a href="/contact" className="text-red-500 hover:text-red-600 underline decoration-2 underline-offset-2 font-medium">
                                                    Contact Page
                                                </a>
                                                {" "}or on social media.
                                            </>
                                        )}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Trust Badges */}
                <Card className="text-center mt-12">
                    <h3 className={`text-2xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Your Data is Safe With Us</h3>
                    <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        We are committed to protecting your privacy and ensuring the security of your personal information.
                    </p>
                </Card>

                {/* Footer */}
                <footer className={`text-center mt-12 pt-8 border-t ${isDark ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-500"}`}>
                    <p>© {new Date().getFullYear()} KD Motoshop. All rights reserved.</p>
                </footer>
            </div>
        </main>
    );
};

export default PrivacyPolicy;
