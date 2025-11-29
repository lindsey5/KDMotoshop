import Card from "../../components/Card";
import useDarkmode from "../../hooks/useDarkmode";
import { FileText, ShoppingCart, Package, DollarSign, RefreshCw, Shield, AlertCircle, CheckCircle } from "lucide-react";

const TermsAndConditions = () => {
    const isDark = useDarkmode();

    const lastUpdated = "October 17, 2025";

    const sections = [
        { icon: FileText, title: "Acceptance of Terms", content: "By accessing and using KD Motoshop's website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services." },
        { icon: ShoppingCart, title: "Product Information", content: "We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free. All prices are in Philippine Peso (PHP) and are subject to change without notice." },
        { icon: DollarSign, title: "Orders and Payment", content: "All orders are subject to acceptance and availability. Payment must be made in full before order processing. We accept Credit / Debit Card, GCash, PayMaya, and Cash on Delivery (COD) in select areas." },
        { icon: Package, title: "Shipping and Delivery", content: "Delivery times are estimates and not guaranteed. We are not responsible for delays caused by courier services or circumstances beyond our control. Risk of loss passes to you upon delivery to the carrier." },
        { icon: RefreshCw, title: "Returns and Refunds", content: "Returns are accepted within 7 days of delivery for defective or incorrect items only. Products must be unused and in original packaging. Refunds will be processed within 14 business days after receiving the returned item. Shipping costs are non-refundable unless the error was on our part." },
        { icon: Shield, title: "Warranty", content: "All motorcycle parts come with manufacturer warranties where applicable. Warranty terms vary by product and manufacturer. We are not responsible for installation errors or misuse of products. Please retain all documentation for warranty claims." },
        { icon: CheckCircle, title: "Product Use", content: "Customers are responsible for ensuring products are compatible with their motorcycles. We recommend professional installation for all parts and accessories. Improper installation or use may void warranties and create safety hazards." },
        { icon: AlertCircle, title: "Limitation of Liability", content: "KD Motoshop shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the product in question." }
    ];

    const additionalTerms = [
        { title: "Intellectual Property", content: "All content on this website, including text, graphics, logos, and images, is the property of KD Motoshop and protected by copyright laws." },
        { title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility." },
        { title: "Prohibited Activities", content: "You may not use our website for any unlawful purpose or in any way that could damage, disable, or impair our services." },
        { title: "Modifications to Terms", content: "We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms." },
        { title: "Governing Law", content: "These terms shall be governed by the laws of the Republic of the Philippines. Any disputes shall be resolved in the courts of Metro Manila." },
        { title: "Contact Information", content: "For questions about these Terms and Conditions, please contact us through our Contact Page or social media channels." }
    ];

    return (
        <main className={`pt-20 min-h-screen transition-colors duration-300 ${isDark ? "bg-[#1e1e1e]" : "bg-gray-50"}`}>
        
        {/* Hero Section */}
        <div className={`relative overflow-hidden ${isDark ? "bg-gradient-to-r from-red-900 to-red-800" : "bg-red-600"}`}>
            <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <FileText className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms and Conditions</h1>
            <p className="text-red-100 text-md md:text-lg mb-2">
                Please read these terms carefully before using our services.
            </p>
            <span className="text-white">Updated: {lastUpdated}</span>
            </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                <Card
                    key={index}
                    className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDark ? "border border-gray-800 hover:border-red-500" : "border border-gray-200 hover:border-red-400 hover:shadow-red-100"}`}
                >
                    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8 ${isDark ? "text-red-400" : "text-red-500"}`}>
                    <Icon className="w-full h-full" />
                    </div>

                    <div>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${isDark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`}>
                        <Icon className="w-6 h-6" />
                    </div>

                    <h2 className={`text-lg md:text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                        {section.title}
                    </h2>

                    <p className={`text-sm md:text-md leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {section.content}
                    </p>
                    </div>
                </Card>
                );
            })}
            </div>

            {/* Additional Terms */}
            <Card className="p-10 mb-12">
            <h3 className={`text-xl md:text-2xl font-semibold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>Additional Terms</h3>
            <div className="space-y-6">
                {additionalTerms.map((term, index) => (
                <div key={index} className="text-md md:text-lg flex gap-4">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${isDark ? "bg-red-400" : "bg-red-500"}`}></div>
                    <div className="flex-1">
                    <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{term.title}</h4>
                    <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>{term.content}</p>
                    </div>
                </div>
                ))}
            </div>
            </Card>

            {/* Important Notice */}
            <div className={`rounded-2xl p-8 text-center ${isDark ? "bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-800/50" : "bg-gradient-to-r from-red-50 to-red-100 border border-red-200"}`}>
            <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-red-400" : "text-red-600"}`} />
            <h3 className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Important Notice</h3>
            <p className={`max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                By placing an order with KD Motoshop, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. We recommend saving or printing a copy for your records.
            </p>
            </div>

            {/* Footer */}
            <footer className={`text-center mt-12 pt-8 border-t ${isDark ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-500"}`}>
            <p>© {new Date().getFullYear()} KD Motoshop. All rights reserved.</p>
            </footer>
        </div>
        </main>
    );
};

export default TermsAndConditions;
