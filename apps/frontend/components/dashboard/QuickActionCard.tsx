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
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
        green: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
        purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
        orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
        default: 'bg-gray-50 text-gray-600 group-hover:bg-gray-900 group-hover:text-white',
    };

    return (
        <Link
            href={href}
            className="group relative flex flex-col p-6 bg-white rounded-2xl border border-gray-100 shadow-sm card-hover overflow-hidden"
        >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${colorStyles[color]}`} aria-hidden="true">
                <div className="text-2xl transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {description}
                </p>
            )}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <svg className="w-5 h-5 text-gray-300 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </Link>
    );
}
