"use client"

import {useState} from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Mail, Phone, MapPin, Clock, MessageSquare, Send} from 'lucide-react';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        alert('Thank you for your message! We\'ll get back to you soon.');
    };

    const contactInfo = [
        {
            icon: <Mail className="h-6 w-6 text-indigo-600"/>,
            title: "Email Us",
            details: "support@shophub.com",
            description: "Send us an email anytime"
        },
        {
            icon: <Phone className="h-6 w-6 text-indigo-600"/>,
            title: "Call Us",
            details: "+1 (555) 123-4567",
            description: "Mon-Fri 9AM-6PM EST"
        },
        {
            icon: <MapPin className="h-6 w-6 text-indigo-600"/>,
            title: "Visit Us",
            details: "123 Commerce Street",
            description: "New York, NY 10001"
        },
        {
            icon: <Clock className="h-6 w-6 text-indigo-600"/>,
            title: "Business Hours",
            details: "Mon-Fri: 9AM-6PM EST",
            description: "Weekend: 10AM-4PM EST"
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
                            <MessageSquare className="h-16 w-16 mx-auto mb-6"/>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
                            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {contactInfo.map((info, index) => (
                                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                    <div className="flex justify-center mb-4">
                                        {info.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.title}</h3>
                                    <p className="text-lg font-medium text-indigo-600 mb-1">{info.details}</p>
                                    <p className="text-gray-600 text-sm">{info.description}</p>
                                </Card>
                            ))}
                        </div>

                        {/* Contact Form and Map */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <Card className="p-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name"
                                                   className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email"
                                                   className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Customer Support</option>
                                            <option value="billing">Billing Question</option>
                                            <option value="shipping">Shipping & Delivery</option>
                                            <option value="returns">Returns & Refunds</option>
                                            <option value="partnership">Partnership Opportunities</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message"
                                               className="block text-sm font-medium text-gray-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                                            placeholder="Please describe your inquiry in detail..."
                                        />
                                    </div>

                                    <Button type="submit"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Send className="h-4 w-4 mr-2"/>
                                        Send Message
                                    </Button>
                                </form>
                            </Card>

                            {/* Map and Additional Info */}
                            <div className="space-y-6">
                                <Card className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Location</h3>
                                    <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                                        <div className="text-center text-gray-600">
                                            <MapPin className="h-12 w-12 mx-auto mb-2"/>
                                            <p>Interactive Map</p>
                                            <p className="text-sm">123 Commerce Street, New York, NY 10001</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Response</h3>
                                    <div className="space-y-3 text-gray-600">
                                        <p className="flex items-center">
                                            <Mail className="h-4 w-4 mr-2 text-indigo-600"/>
                                            Email responses within 24 hours
                                        </p>
                                        <p className="flex items-center">
                                            <Phone className="h-4 w-4 mr-2 text-indigo-600"/>
                                            Phone support available during business hours
                                        </p>
                                        <p className="flex items-center">
                                            <MessageSquare className="h-4 w-4 mr-2 text-indigo-600"/>
                                            Live chat available on our website
                                        </p>
                                    </div>
                                </Card>

                                <Card className="p-6 bg-indigo-50">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Immediate Help?</h3>
                                    <p className="text-gray-600 mb-4">
                                        For urgent matters, please call our customer support hotline or use our live
                                        chat feature on the website.
                                    </p>
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Phone className="h-4 w-4 mr-2"/>
                                        Call Now: +1 (555) 123-4567
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default ContactUs;
