'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Unauthorized Access</h1>
                <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
                <Button onClick={() => router.push('/')} className="mt-4">
                    Return to Home
                </Button>
            </div>
        </div>
    );
}