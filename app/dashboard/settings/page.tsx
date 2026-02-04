export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Pengaturan</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Preferensi Aplikasi</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div>
                            <p className="font-medium text-gray-700">Tema Aplikasi</p>
                            <p className="text-sm text-gray-500">Tema saat ini diatur secara global (Biru & Putih).</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium cursor-not-allowed" disabled>
                            Default
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium text-gray-700">Versi Aplikasi</p>
                            <p className="text-sm text-gray-500">v1.0.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
