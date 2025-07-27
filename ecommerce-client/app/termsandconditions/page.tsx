"use client"

import {Card} from '@/components/ui/card';

import {FileText, ShoppingCart, Shield, AlertTriangle, Scale, RefreshCw} from 'lucide-react';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const TermsAndConditions = () => {
    const sections = [
        {
            icon: <ShoppingCart className="h-6 w-6 text-indigo-600"/>,
            title: "Use of Services",
            content: [
                "You must be at least 18 years old to use our services or have parental consent",
                "You are responsible for maintaining the confidentiality of your account credentials",
                "You agree to provide accurate and current information when creating an account",
                "You may not use our services for any illegal or unauthorized purpose",
                "You are prohibited from violating any laws in your jurisdiction while using our services",
                "You may not transmit any worms, viruses, or any code of a destructive nature",
                "We reserve the right to refuse service to anyone for any reason at any time"
            ]
        },
        {
            icon: <FileText className="h-6 w-6 text-indigo-600"/>,
            title: "Orders and Payments",
            content: [
                "All prices are subject to change without notice until payment is processed",
                "We reserve the right to refuse or cancel any order at our sole discretion",
                "Payment must be received before order processing and shipment",
                "We accept major credit cards, PayPal, and other approved payment methods",
                "You are responsible for any applicable taxes, duties, or fees",
                "Billing disputes must be reported within 60 days of the charge date",
                "We may verify payment information before processing orders"
            ]
        },
        {
            icon: <RefreshCw className="h-6 w-6 text-indigo-600"/>,
            title: "Returns and Refunds",
            content: [
                "Returns must be initiated within 30 days of purchase",
                "Items must be in original condition with all packaging and tags",
                "Personalized or customized items cannot be returned unless defective",
                "Return shipping costs are the responsibility of the customer unless item is defective",
                "Refunds will be processed to the original payment method within 5-10 business days",
                "Exchanges are subject to product availability",
                "Sale items may have different return policies as indicated at time of purchase"
            ]
        },
        {
            icon: <Shield className="h-6 w-6 text-indigo-600"/>,
            title: "Intellectual Property",
            content: [
                "All content on our website is owned by ShopHub or its licensors",
                "You may not reproduce, distribute, or create derivative works without permission",
                "Our trademarks, service marks, and logos are protected intellectual property",
                "User-generated content remains owned by you but you grant us license to use it",
                "We respect intellectual property rights and respond to valid takedown notices",
                "Unauthorized use of our intellectual property may result in legal action",
                "Third-party trademarks are the property of their respective owners"
            ]
        },
        {
            icon: <AlertTriangle className="h-6 w-6 text-indigo-600"/>,
            title: "Disclaimers and Limitations",
            content: [
                "Our services are provided 'as is' without warranties of any kind",
                "We do not guarantee continuous, uninterrupted access to our services",
                "Product descriptions and images are for informational purposes only",
                "We are not liable for indirect, incidental, or consequential damages",
                "Our total liability is limited to the amount you paid for the specific transaction",
                "Some jurisdictions do not allow certain limitations, so these may not apply to you",
                "We are not responsible for third-party content or services linked from our site"
            ]
        },
        {
            icon: <Scale className="h-6 w-6 text-indigo-600"/>,
            title: "Governing Law and Disputes",
            content: [
                "These terms are governed by the laws of the State of New York",
                "Any disputes will be resolved through binding arbitration in New York",
                "You waive your right to participate in class action lawsuits",
                "Small claims court disputes under $5,000 may be filed in your local jurisdiction",
                "The arbitration will be conducted by the American Arbitration Association",
                "The prevailing party may be entitled to attorney's fees and costs",
                "These terms survive termination of your account or use of our services"
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
                            <FileText className="h-16 w-16 mx-auto mb-6"/>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms & Conditions</h1>
                            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                                Please read these terms carefully before using our services
                            </p>
                        </div>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="py-8 bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-gray-600">
                            <strong>Last Updated:</strong> December 1, 2024 | <strong>Effective Date:</strong> December
                            1, 2024
                        </p>
                    </div>
                </div>

                {/* Introduction */}
                <div className="py-12 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    These Terms and Conditions ("Terms") govern your use of ShopHub's website, mobile
                                    application,
                                    and related services (collectively, the "Services") operated by ShopHub Inc. ("we,"
                                    "us," or "our").
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    By accessing or using our Services, you agree to be bound by these Terms. If you
                                    disagree with
                                    any part of these terms, then you may not access the Services. These Terms apply to
                                    all visitors,
                                    users, and others who access or use the Services.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We reserve the right to update, change, or replace any part of these Terms by
                                    posting updates
                                    and/or changes to our website. It is your responsibility to check this page
                                    periodically for changes.
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"/>
                                        <div>
                                            <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                Your continued use of the Services following the posting of any changes
                                                constitutes
                                                acceptance of those changes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Main Sections */}
                <div className="py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-8">
                            {sections.map((section, index) => (
                                <Card key={index} className="p-8">
                                    <div className="flex items-center space-x-3 mb-6">
                                        {section.icon}
                                        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                    </div>
                                    <ul className="space-y-3">
                                        {section.content.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"/>
                                                <span className="text-gray-600 leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional Important Terms */}
                <div className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Account Termination</h3>
                                <p className="text-gray-600 leading-relaxed mb-3">
                                    We may terminate or suspend your account immediately, without prior notice or
                                    liability,
                                    for any reason whatsoever, including without limitation if you breach the Terms.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Upon termination, your right to use the Services will cease immediately.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Changes to Services</h3>
                                <p className="text-gray-600 leading-relaxed mb-3">
                                    We reserve the right to withdraw or amend our Services, and any service or material
                                    we provide via the Services, in our sole discretion without notice.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    We will not be liable if for any reason all or any part of the Services is
                                    unavailable.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Severability</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    If any provision of these Terms is held to be unenforceable or invalid, such
                                    provision
                                    will be changed and interpreted to accomplish the objectives of such provision to
                                    the
                                    greatest extent possible under applicable law.
                                </p>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Entire Agreement</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    These Terms constitute the entire agreement between us regarding our Services, and
                                    supersede and replace any prior agreements we might have between us regarding the
                                    Services.
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="py-16 bg-indigo-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Questions About These Terms?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            If you have any questions about these Terms and Conditions, please contact our legal team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Contact Us
                            </a>
                            <a
                                href="mailto:legal@shophub.com"
                                className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
                            >
                                Email Legal Team
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default TermsAndConditions;
