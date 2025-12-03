import Link from 'next/link';
import { ReactNode } from 'react';

interface QuickActionCardProps {
    href: string;
    title: string;
    description?: string;
    icon: ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'default';
}

export default function QuickActionCard({
    href,
    title,
    description,
    icon,
    color = 'default',
}: QuickActionCardProps) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
        green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
        purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
        orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
        default: 'bg-gray-50 text-gray-600 group-hover:bg-gray-100',
    };

    return (
        <Link
            href={href}
            className="group relative flex flex-col p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
        >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${colorStyles[color]}`}>
                <div className="text-2xl">{icon}</div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                    {description}
                </p>
            )}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}
