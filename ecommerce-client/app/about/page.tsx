"use client"

import {Card} from '@/components/ui/card';
import {Users, Target, Award, Heart} from 'lucide-react';
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

const AboutUs = () => {
    const values = [
        {
            icon: <Users className="h-8 w-8 text-indigo-600"/>,
            title: "Customer First",
            description: "We prioritize our customers' needs and satisfaction above everything else."
        },
        {
            icon: <Target className="h-8 w-8 text-indigo-600"/>,
            title: "Quality Focus",
            description: "We carefully curate every product to ensure the highest quality standards."
        },
        {
            icon: <Award className="h-8 w-8 text-indigo-600"/>,
            title: "Excellence",
            description: "We strive for excellence in every aspect of our business operations."
        },
        {
            icon: <Heart className="h-8 w-8 text-indigo-600"/>,
            title: "Passion",
            description: "We're passionate about delivering exceptional shopping experiences."
        }
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
        },
        {
            name: "Michael Chen",
            role: "CTO",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
        },
        {
            name: "Emily Davis",
            role: "Head of Marketing",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
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
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">About SmartCart</h1>
                            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                                Connecting customers with quality products and exceptional service since 2015
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Story */}
                <div className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                                <div className="space-y-4 text-gray-600 leading-relaxed">
                                    <p>
                                        Founded in 2015, SmartCart began as a small startup with a big vision: to create
                                        an e-commerce platform that truly puts customers first. What started as a team
                                        of five passionate individuals has grown into a trusted marketplace serving
                                        millions of customers worldwide.
                                    </p>
                                    <p>
                                        Our journey has been driven by innovation, dedication, and an unwavering
                                        commitment to quality. We've built lasting relationships with suppliers,
                                        partners, and most importantly, our customers who trust us with their
                                        shopping needs.
                                    </p>
                                    <p>
                                        Today, we continue to evolve and adapt, always staying true to our core
                                        mission: making online shopping simple, secure, and satisfying for everyone.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <img
                                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
                                    alt="Our team working together"
                                    className="rounded-lg shadow-lg w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Values */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                These core values guide everything we do and shape our company culture.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                    <div className="flex justify-center mb-4">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Our Team */}
                <div className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                The passionate people behind ShopHub's success.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {team.map((member, index) => (
                                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                                    <p className="text-indigo-600 font-medium">{member.role}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mission Statement */}
                <div className="py-16 bg-indigo-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                        <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
                            To empower people worldwide by providing access to quality products,
                            exceptional service, and innovative shopping experiences that enhance their lives.
                        </p>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AboutUs;
