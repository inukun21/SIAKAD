import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center p-8 h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-500">Memuat data...</span>
        </div>
    );
}
