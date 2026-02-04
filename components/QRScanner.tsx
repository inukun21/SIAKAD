'use client';

import { useEffect, useRef, useState } from 'react';

interface QRScannerProps {
    onScanSuccess: (decodedText: string) => void;
    onScanError?: (error: string) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        let codeReader: any = null;
        let isActive = true;

        const initScanner = async () => {
            try {
                // Dynamic import to avoid SSR issues
                const { BrowserMultiFormatReader } = await import('@zxing/browser');
                codeReader = new BrowserMultiFormatReader();

                // Get video devices using navigator.mediaDevices
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');

                if (videoDevices.length === 0) {
                    setError('Tidak ada kamera yang terdeteksi');
                    if (onScanError) onScanError('Tidak ada kamera yang terdeteksi');
                    return;
                }

                const selectedDeviceId = videoDevices[0].deviceId;

                if (videoRef.current && isActive) {
                    setIsInitialized(true);

                    const controls = await codeReader.decodeFromVideoDevice(
                        selectedDeviceId,
                        videoRef.current,
                        (result: any, err: any) => {
                            if (result && isActive) {
                                setIsScanning(true);
                                onScanSuccess(result.getText());

                                setTimeout(() => {
                                    if (isActive) {
                                        setIsScanning(false);
                                    }
                                }, 2000);
                            }
                        }
                    );

                    // Store the stream for cleanup
                    if (videoRef.current && videoRef.current.srcObject) {
                        streamRef.current = videoRef.current.srcObject as MediaStream;
                    }
                }
            } catch (err: any) {
                console.error('Error starting scanner:', err);
                setError(err.message || 'Gagal mengakses kamera');
                if (onScanError) onScanError(err.message || 'Gagal mengakses kamera');
            }
        };

        initScanner();

        return () => {
            isActive = false;

            // Stop all video tracks
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // Clear video source
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, [onScanSuccess, onScanError]);

    return (
        <div className="relative">
            <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-lg bg-black">
                <video
                    ref={videoRef}
                    className="w-full h-auto"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                />

                {/* Scanning overlay */}
                {isInitialized && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 border-2 border-blue-500 opacity-50">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500"></div>
                        </div>

                        {/* Animated scanning line */}
                        <div className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-lg shadow-blue-500/50 animate-scan"></div>
                    </div>
                )}

                {/* Success feedback */}
                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-30 animate-pulse">
                        <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
                            ✓ QR Code Terdeteksi!
                        </div>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-3 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Loading state */}
                {!isInitialized && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                        <div className="text-white text-sm">Memuat kamera...</div>
                    </div>
                )}
            </div>

            <p className="text-center text-sm text-gray-600 mt-3">
                Arahkan kamera ke QR Code siswa
            </p>

            {/* Custom CSS for scanning animation */}
            <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        
        :global(.animate-scan) {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
