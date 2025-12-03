import { redirect } from 'next/navigation';
import { getCurrentUser, getAuthToken, getUserShopId } from '@/lib/auth-server';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    // Let the login page render without layout chrome
    return <>{children}</>;
  }

  const token = getAuthToken();
  const shopId = token ? await getUserShopId(token) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      <div className="flex">
        <DashboardSidebar user={user} shopId={shopId} />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
