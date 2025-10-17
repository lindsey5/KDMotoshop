import React, { useState } from "react";
import useDarkmode from "../../hooks/useDarkmode";
import { 
  HelpCircle, ChevronDown, ShoppingBag, Package, 
  CreditCard, MapPin, Shield, FileText 
} from "lucide-react";

type Category = {
    id: string;
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type FAQItem = {
    category: string;
    question: string;
    answer: string;
};

const FAQ: React.FC = () => {
    const isDark = useDarkmode();
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

    const categories: Category[] = [
        { id: "all", name: "All FAQs", icon: HelpCircle },
        { id: "ordering", name: "Ordering", icon: ShoppingBag },
        { id: "delivery", name: "Delivery & Tracking", icon: Package },
        { id: "payment", name: "Payment", icon: CreditCard },
        { id: "store", name: "Store Info", icon: MapPin },
        { id: "products", name: "Products", icon: Package },
        { id: "privacy", name: "Privacy & Security", icon: Shield },
        { id: "returns", name: "Returns & Warranty", icon: FileText }
    ];

    const faqs: FAQItem[] = [
        // Ordering
        {
        category: "ordering",
        question: "How can I place an order through the KD Motoshop website?",
        answer: "Simply browse our products, add items to your cart, and proceed to checkout. Follow the instructions to complete your order."
        },
        {
        category: "ordering",
        question: "Do I need an account to place an order?",
        answer: "Yes. While browsing is open to all, placing an order and tracking it requires an account."
        },
        {
        category: "ordering",
        question: "How do I create an account?",
        answer: "To create an account just click the 'Create an Account' button on the Log In page and fill in your details. You can also sign up using your Google account or log in if you already have one."
        },
        {
        category: "ordering",
        question: "What should I do if I forgot my password?",
        answer: "Click the 'Forgot Password' link on the login page to reset your password."
        },
        {
        category: "ordering",
        question: "Can I cancel my order, and how?",
        answer: "Yes, you can cancel your order if it hasn't been processed or confirmed. Go to 'My Orders', select the product, click 'Track Order', then tap 'Cancel'. You can also contact us immediately to request a cancellation."
        },
        {
        category: "ordering",
        question: "Can I save items to buy later?",
        answer: "Yes, you can click 'Add to Cart' on any item and complete the purchase later."
        },
        {
        category: "ordering",
        question: "How will I know if my order was successful?",
        answer: "Check the 'My Orders' section under your profile. A successful order will be listed with its current status."
        },
        {
        category: "ordering",
        question: "Is there a minimum order requirement?",
        answer: "No. You can order a single item or as many as you like, based on availability."
        },
        {
        category: "ordering",
        question: "Can I order through social media?",
        answer: "For secure transactions, place orders via our website. However, you may message us on Facebook or Messenger for inquiries."
        },
        {
        category: "ordering",
        question: "Do you accept product reservations?",
        answer: "Yes! You may reserve an item by messaging us on Facebook or calling our shop."
        },
        // Delivery & Tracking
        {
        category: "delivery",
        question: "How can I track my order status?",
        answer: "Log in to your account and go to the 'My Orders' section to check your order status."
        },
        {
        category: "delivery",
        question: "How long does delivery take?",
        answer: "Delivery usually takes 3–5 business days, depending on your location."
        },
        {
        category: "delivery",
        question: "Can I track my order?",
        answer: "Yes. Go to 'My Orders', select the order, and click 'Track Order' for real-time updates."
        },
        {
        category: "delivery",
        question: "Do you offer delivery or store pickup?",
        answer: "Yes. We offer home delivery and also allow in-store pickup for added convenience."
        },
        {
        category: "delivery",
        question: "Do you offer delivery for parts or gear?",
        answer: "Yes, we offer local delivery for motorcycle parts and accessories. Delivery fees may vary by location."
        },
        {
        category: "delivery",
        question: "Can someone else pick up my reserved item?",
        answer: "Yes, just inform us in advance and provide the name of the person claiming the item."
        },
        // Payment
        {
        category: "payment",
        question: "What are the payment methods I can use at KD Motoshop?",
        answer: "We accept GCash, PayMaya and cash."
        },
        {
        category: "payment",
        question: "Do you offer installment or financing options?",
        answer: "No. KD Motoshop only accepts full payment. We do not offer Home Credit, layaway, or installment plans."
        },
        {
        category: "payment",
        question: "Can I use Home Credit or credit cards at KD Motoshop?",
        answer: "No. We do not accept Home Credit, credit cards, or any form of financing."
        },
        {
        category: "payment",
        question: "Do you offer Cash on Delivery (COD)?",
        answer: "Yes, we offer Cash on Delivery (COD) for select areas. You can check availability during checkout."
        },
        {
        category: "payment",
        question: "Do you issue official receipts?",
        answer: "Yes. All purchases come with an official receipt."
        },
        // Store Info
        {
        category: "store",
        question: "Where is KD Motoshop located?",
        answer: "KD Motoshop is located in Taguig City. We're easy to find and rider-friendly!"
        },
        {
        category: "store",
        question: "What are your store hours?",
        answer: "We are open from 8:00 AM to 6:00 PM, Monday to Saturday."
        },
        {
        category: "store",
        question: "Is walk-in shopping allowed?",
        answer: "Yes, walk-ins are welcome during our regular store hours."
        },
        {
        category: "store",
        question: "Do you have a physical store?",
        answer: "Yes, our main store is located in Taguig City. We also operate online and accept orders nationwide."
        },
        {
        category: "store",
        question: "How long has KD Motoshop been in business?",
        answer: "We have been operating since 2021 and continue to grow with the support of our loyal customer base."
        },
        {
        category: "store",
        question: "How do I contact the shop?",
        answer: "Use the 'Contact Us' section on our website or reach out via Facebook, Messenger, or TikTok."
        },
        // Products
        {
        category: "products",
        question: "What types of products do you sell?",
        answer: "We sell motorcycle parts, maintenance items, accessories, and riding gear."
        },
        {
        category: "products",
        question: "How can I check if a product is in stock?",
        answer: "Product availability is updated in real time. If an item is in stock, it will appear on the product page. You can also browse by categories such as Helmet, Monorack, Topbox, and more."
        },
        {
        category: "products",
        question: "Do you sell motorcycle parts?",
        answer: "Yes! We carry a wide selection of both genuine and aftermarket parts for various motorcycle brands."
        },
        {
        category: "products",
        question: "Do you sell helmets and riding gear?",
        answer: "Yes, KD Motoshop offers helmets, motowolf gloves, raincoats and other safety essentials."
        },
        {
        category: "products",
        question: "What types of helmets do you sell?",
        answer: "We offer a wide range of helmets including full-face, open-face, modular, and half helmets. All our helmets are DOT, ECE, or ICC certified for safety."
        },
        {
        category: "products",
        question: "Do you sell brand-new motorcycles?",
        answer: "No, KD Motoshop mainly focuses on motorcycle parts and accessories."
        },
        {
        category: "products",
        question: "Do you sell original and branded accessories?",
        answer: "Yes, we only sell 100% original and branded products such as seat covers, monoracks, top boxes, phone mounts, and more."
        },
        {
        category: "products",
        question: "Do you sell decals and accessories?",
        answer: "No, we only sell motorcycle accessories including helmets, top boxes and related items."
        },
        {
        category: "products",
        question: "Do you have promos or discounts?",
        answer: "Yes! KD Motoshop regularly offers special deals. Follow us on Facebook or visit our website to stay updated."
        },
        {
        category: "products",
        question: "Do you offer wholesale or bulk pricing?",
        answer: "No. KD Motoshop does not offer wholesale or bulk discounts. All prices are retail."
        },
        {
        category: "products",
        question: "Can I view your product catalog online?",
        answer: "Yes! You can view our catalog and prices on our official website or check updates on our Facebook page."
        },
        {
        category: "products",
        question: "Are your prices the same as in your physical store or Shopee/Lazada shop?",
        answer: "Prices may vary slightly due to platform fees and promos. However, we always aim to offer the best possible price on our official website and pages."
        },
        {
        category: "products",
        question: "Do you install the accessories you sell (e.g. phone holders, signal lights)?",
        answer: "Yes, if you choose pick-up at our shop, we offer free or low-cost installation services depending on the item."
        },
        {
        category: "products",
        question: "How can I stay updated on new products or prices?",
        answer: "Follow KD Motoshop on Facebook and visit our official website for the latest updates, product listings, and pricing."
        },
        // Privacy & Security
        {
        category: "privacy",
        question: "What personal information do you collect from customers?",
        answer: "We collect only essential information such as your name, contact details, and delivery address to process your orders."
        },
        {
        category: "privacy",
        question: "How is my data protected in your system?",
        answer: "Your data is encrypted and stored securely. We follow industry-standard security practices to ensure your information remains safe."
        },
        {
        category: "privacy",
        question: "Will my personal information be shared with third parties?",
        answer: "No, your personal information will not be shared with third parties without your consent."
        },
        {
        category: "privacy",
        question: "Do you store credit card or payment information?",
        answer: "No, we do not store any credit card or payment information. All transactions are handled through secure, third-party payment providers."
        },
        {
        category: "privacy",
        question: "How long do you retain customer information?",
        answer: "Customer information is retained only for as long as necessary to fulfill services and meet legal or regulatory requirements."
        },
        {
        category: "privacy",
        question: "Is it safe to make transactions on your website?",
        answer: "Yes, our website uses secure encryption and follows best practices to protect your personal and payment information during transactions."
        },
        // Returns & Warranty
        {
        category: "returns",
        question: "Do your products come with a warranty?",
        answer: "Most of our products come with a 7-day replacement warranty. Branded items may include extended warranty terms."
        },
        {
        category: "returns",
        question: "Can I return or exchange a product?",
        answer: "Yes. You can exchange unused items within 7 days if they are in original packaging and with a receipt."
        },
        {
        category: "returns",
        question: "What should I do if I received the wrong item or a damaged product?",
        answer: "Please contact us immediately within 48 hours of receiving your order. We'll assist with a replacement or refund, depending on the case."
        },
        {
        category: "returns",
        question: "Do you offer any product warranties?",
        answer: "Warranty terms vary by product. Refer to the product description or contact us for details."
        }
    ];

    const toggleItem = (index: number) => {
        setOpenItems(prev => ({
        ...prev,
        [index]: !prev[index]
        }));
    };

    const filteredFaqs = faqs.filter(faq => activeCategory === "all" || faq.category === activeCategory);

    return (
        <main className={`pt-20 min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-gradient-to-br from-red-50 via-red-100 to-red-200"}`}>
        
        {/* Hero Section */}
        <div className={`relative overflow-hidden ${isDark ? "bg-gradient-to-r from-red-900 to-red-800" : "bg-red-600"}`}>
            <div className="max-w-6xl mx-auto px-6 py-16 text-center">
            <HelpCircle className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
            <p className="text-red-100 text-lg mb-8">Find answers to common questions about KD Motoshop</p>
            </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === cat.id
                        ? isDark
                        ? "bg-red-600 text-white"
                        : "bg-red-600 text-white shadow-lg"
                        : isDark
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                </button>
                );
            })}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                <div
                    key={index}
                    className={`rounded-xl overflow-hidden transition-all ${
                    isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200 shadow-sm"
                    }`}
                >
                    <button
                    onClick={() => toggleItem(index)}
                    className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
                        isDark ? "hover:bg-gray-800" : "hover:bg-red-50"
                    }`}
                    >
                    <span className={`font-semibold pr-4 ${isDark ? "text-white" : "text-gray-900"}`}>{faq.question}</span>
                    <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${openItems[index] ? "rotate-180" : ""} ${isDark ? "text-red-400" : "text-red-600"}`}
                    />
                    </button>
                    {openItems[index] && (
                    <div className={`px-6 pb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        <p className="leading-relaxed">{faq.answer}</p>
                    </div>
                    )}
                </div>
                ))
            ) : (
                <div className={`text-center py-12 rounded-xl ${isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"}`}>
                <HelpCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`} />
                <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>No questions found.</p>
                </div>
            )}
            </div>

            {/* Still Have Questions */}
            <div className={`mt-12 rounded-2xl p-8 text-center ${isDark ? "bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-800/50" : "bg-gradient-to-r from-red-50 to-orange-50 border border-red-200"}`}>
            <h3 className={`text-2xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>Still have questions?</h3>
            <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Can't find the answer you're looking for? Feel free to reach out to our support team.</p>
            <a
                href="/contact"
                className={`inline-block px-6 py-3 rounded-lg font-medium transition-all ${
                isDark ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl"
                }`}
            >
                Contact Support
            </a>
            </div>

            {/* Footer */}
            <footer className={`text-center mt-12 pt-8 border-t ${isDark ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-500"}`}>
            <p>© {new Date().getFullYear()} KD Motoshop. All rights reserved.</p>
            </footer>
        </div>
        </main>
    );
};

export default FAQ;
