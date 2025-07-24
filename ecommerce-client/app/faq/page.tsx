"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {Card} from '@/components/ui/card';
import {HelpCircle, ShoppingCart, Truck, CreditCard, Shield, RefreshCw} from 'lucide-react';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const FAQ = () => {
    const categories = [
        {
            icon: <ShoppingCart className="h-6 w-6 text-indigo-600"/>,
            title: "Shopping & Orders",
            faqs: [
                {
                    question: "How do I place an order?",
                    answer: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide your shipping information and payment details to complete your purchase."
                },
                {
                    question: "Can I modify or cancel my order?",
                    answer: "You can modify or cancel your order within 1 hour of placing it, as long as it hasn't been processed for shipping. Contact our customer service team immediately for assistance."
                },
                {
                    question: "Do you offer bulk discounts?",
                    answer: "Yes, we offer bulk discounts for orders over certain quantities. Please contact our sales team for more information about volume pricing."
                }
            ]
        },
        {
            icon: <Truck className="h-6 w-6 text-indigo-600"/>,
            title: "Shipping & Delivery",
            faqs: [
                {
                    question: "What are your shipping options?",
                    answer: "We offer standard shipping (5-7 business days), expedited shipping (2-3 business days), and overnight shipping. Shipping costs vary based on your location and the shipping method selected."
                },
                {
                    question: "Do you ship internationally?",
                    answer: "Yes, we ship to over 50 countries worldwide. International shipping times and costs vary by destination. Additional customs fees may apply for international orders."
                },
                {
                    question: "How can I track my order?",
                    answer: "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our website or the carrier's website."
                }
            ]
        },
        {
            icon: <CreditCard className="h-6 w-6 text-indigo-600"/>,
            title: "Payment & Billing",
            faqs: [
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers for large orders."
                },
                {
                    question: "Is my payment information secure?",
                    answer: "Yes, we use industry-standard SSL encryption to protect your payment information. We are PCI DSS compliant and never store your complete credit card information on our servers."
                },
                {
                    question: "When will I be charged for my order?",
                    answer: "Your payment method will be charged immediately when you place your order. For pre-orders, you'll be charged when the item ships."
                }
            ]
        },
        {
            icon: <RefreshCw className="h-6 w-6 text-indigo-600"/>,
            title: "Returns & Refunds",
            faqs: [
                {
                    question: "What is your return policy?",
                    answer: "We offer a 30-day return policy for most items. Products must be in original condition with tags attached. Some items like personalized products or intimate apparel cannot be returned."
                },
                {
                    question: "How do I return an item?",
                    answer: "To return an item, log into your account, go to your order history, and select 'Return Item'. Print the prepaid return label and drop off the package at any authorized shipping location."
                },
                {
                    question: "When will I receive my refund?",
                    answer: "Refunds are processed within 3-5 business days after we receive your returned item. It may take an additional 5-10 business days for the refund to appear on your statement."
                }
            ]
        },
        {
            icon: <Shield className="h-6 w-6 text-indigo-600"/>,
            title: "Account & Security",
            faqs: [
                {
                    question: "How do I create an account?",
                    answer: "Click 'Sign Up' at the top of our website and provide your email address and create a password. You can also sign up using your Google or Facebook account for faster registration."
                },
                {
                    question: "I forgot my password. How can I reset it?",
                    answer: "Click 'Forgot Password' on the login page and enter your email address. We'll send you a password reset link. If you don't receive it within 15 minutes, check your spam folder."
                },
                {
                    question: "How do I update my account information?",
                    answer: "Log into your account and go to 'Account Settings' where you can update your personal information, shipping addresses, and payment methods."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header/>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <HelpCircle className="h-16 w-16 mx-auto mb-6"/>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
                            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                                Find answers to common questions about shopping, shipping, returns, and more
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Content */}
                <div className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-8">
                            {categories.map((category, categoryIndex) => (
                                <Card key={categoryIndex} className="p-6">
                                    <div className="flex items-center space-x-3 mb-6">
                                        {category.icon}
                                        <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                                    </div>
                                    <Accordion type="single" collapsible className="w-full">
                                        {category.faqs.map((faq, faqIndex) => (
                                            <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                                                <AccordionTrigger className="text-left hover:text-indigo-600">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Support Section */}
                <div className="py-16 bg-indigo-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Still Have Questions?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Can't find what you're looking for? Our customer support team is here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contactus"
                                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Contact Support
                            </a>
                            <a
                                href="mailto:support@shophub.com"
                                className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
                            >
                                Email Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default FAQ;
