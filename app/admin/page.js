export default function AdminPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-red-600 mb-6">Admin Dashboard</h1>
                <p className="text-gray-700 mb-4">
                    Welcome, Administrator! You have access to this restricted area.
                </p>
                <div className="bg-red-50 border border-red-200 p-4 rounded text-sm text-red-800">
                    This page is protected by middleware. Only users with <code>role: 'admin'</code> can see this.
                </div>
            </div>
        </div>
    );
}
