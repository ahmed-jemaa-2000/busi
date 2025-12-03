export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex justify-between items-end">
                <div className="space-y-3">
                    <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 w-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 h-32">
                        <div className="flex justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                        </div>
                        <div className="h-4 w-24 bg-gray-100 rounded mb-2"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 h-96 p-6">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-50 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Content Skeleton */}
                <div className="space-y-6">
                    <div className="h-48 bg-gray-200 rounded-xl"></div>
                    <div className="bg-white rounded-xl border border-gray-200 h-64 p-6">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-50 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
