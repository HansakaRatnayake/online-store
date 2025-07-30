// components/admin/AdminData.tsx
'use client';

import { useAuth } from '@/components/providers/auth-provider';

export default function AdminData() {
    const { token } = useAuth();

    const fetchAdminData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/data`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include', // Include HttpOnly cookie
            });
            if (!response.ok) throw new Error('Failed to fetch admin data');
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    return <button onClick={fetchAdminData}>Fetch Admin Data</button>;
}