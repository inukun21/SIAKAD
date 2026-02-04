export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
                {/* Dynamic title could be implemented here */}
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        A
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700">Admin</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                </div>
            </div>
        </header>
    );
}
