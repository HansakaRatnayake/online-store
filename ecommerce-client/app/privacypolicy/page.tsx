"use client"

import {Card} from '@/components/ui/card';
import {Shield, Eye, Lock, UserCheck, Database, Globe} from 'lucide-react';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: <Database className="h-6 w-6 text-indigo-600"/>,
            title: "Information We Collect",
            content: [
                "Personal information you provide (name, email, address, phone number)",
                "Payment information (processed securely through our payment processors)",
                "Order history and purchase preferences",
                "Account credentials and profile information",
                "Communication preferences and customer service interactions",
                "Device information and browsing patterns on our website",
                "Location information (with your permission) for shipping and delivery"
            ]
        },
        {
            icon: <Eye className="h-6 w-6 text-indigo-600"/>,
            title: "How We Use Your Information",
            content: [
                "Process and fulfill your orders and transactions",
                "Provide customer support and respond to your inquiries",
                "Send order confirmations, shipping updates, and important account notifications",
                "Improve our products, services, and website functionality",
                "Personalize your shopping experience and recommend relevant products",
                "Prevent fraud and enhance security measures",
                "Comply with legal obligations and protect our rights",
                "Send marketing communications (with your consent)"
            ]
        },
        {
            icon: <UserCheck className="h-6 w-6 text-indigo-600"/>,
            title: "Information Sharing",
            content: [
                "We do not sell, rent, or trade your personal information to third parties",
                "Service providers who help us operate our business (shipping, payment processing)",
                "Legal authorities when required by law or to protect our rights",
                "Business partners for joint marketing efforts (with your explicit consent)",
                "In case of merger, acquisition, or sale of our business assets",
                "Aggregate, anonymized data for research and analytics purposes"
            ]
        },
        {
            icon: <Lock className="h-6 w-6 text-indigo-600"/>,
            title: "Data Security",
            content: [
                "Industry-standard SSL encryption for all data transmission",
                "Secure servers protected by firewalls and intrusion detection systems",
                "Regular security audits and vulnerability assessments",
                "Employee access controls and confidentiality agreements",
                "Secure payment processing through PCI DSS compliant providers",
                "Regular data backups and disaster recovery procedures",
                "Immediate notification in case of any security breaches"
            ]
        },
        {
            icon: <Globe className="h-6 w-6 text-indigo-600"/>,
            title: "Cookies and Tracking",
            content: [
                "Essential cookies for website functionality and security",
                "Analytics cookies to understand website usage and improve performance",
                "Preference cookies to remember your settings and choices",
                "Marketing cookies for targeted advertising (with your consent)",
                "Third-party cookies from integrated services (social media, analytics)",
                "You can control cookie settings through your browser preferences",
                "Some features may not work properly if cookies are disabled"
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
                            <Shield className="h-16 w-16 mx-auto mb-6"/>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
                            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                                Your privacy is important to us. Learn how we collect, use, and protect your
                                information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="py-8 bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-gray-600">
                            <strong>Last Updated:</strong> December 1, 2024
                        </p>
                    </div>
                </div>

                {/* Introduction */}
                <div className="py-12 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    ShopHub ("we," "our," or "us") is committed to protecting your privacy and ensuring
                                    the security
                                    of your personal information. This Privacy Policy explains how we collect, use,
                                    disclose, and
                                    safeguard your information when you visit our website, mobile application, or use
                                    our services.
                                </p>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    By using our services, you agree to the collection and use of information in
                                    accordance with
                                    this Privacy Policy. If you do not agree with our policies and practices, please do
                                    not use our services.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    We may update this Privacy Policy from time to time. We will notify you of any
                                    changes by
                                    posting the new Privacy Policy on this page and updating the "Last Updated" date.
                                </p>
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

                {/* Your Rights */}
                <div className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights and Choices</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Access and Update</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        You can access and update your personal information through your account
                                        settings
                                        or by contacting our customer support team.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Deletion</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        You can request deletion of your personal data, subject to certain legal and
                                        operational requirements for record-keeping.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Marketing Preferences</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        You can opt out of marketing communications at any time by clicking the
                                        unsubscribe
                                        link in emails or updating your preferences.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Portability</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        You can request a copy of your personal data in a structured, commonly used,
                                        and machine-readable format.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="py-16 bg-indigo-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Questions About Privacy?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            If you have questions about this Privacy Policy or our data practices, please contact us.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Contact Us
                            </a>
                            <a
                                href="mailto:privacy@shophub.com"
                                className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
                            >
                                Email Privacy Team
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default PrivacyPolicy;
