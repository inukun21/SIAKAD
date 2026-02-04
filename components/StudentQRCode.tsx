'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Student } from '@/lib/db';
import { Download, Printer } from 'lucide-react';

interface StudentQRCodeProps {
    student: Student;
    size?: number;
}

export default function StudentQRCode({ student, size = 200 }: StudentQRCodeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            // Create QR code data with student information
            const qrData = JSON.stringify({
                id: student.id,
                nis: student.nis,
                nisn: student.nisn,
                nik: student.nik,
                name: student.name,
                class: student.class,
                major: student.major,
                dateOfBirth: student.dateOfBirth,
                placeOfBirth: student.placeOfBirth,
                gender: student.gender,
                phone: student.phone,
                email: student.email,
                address: student.address,
            });

            QRCode.toCanvas(
                canvasRef.current,
                qrData,
                {
                    width: size,
                    margin: 2,
                    color: {
                        dark: '#1F2937',
                        light: '#FFFFFF',
                    },
                },
                (error) => {
                    if (error) console.error('Error generating QR code:', error);
                }
            );
        }
    }, [student, size]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `QR-${student.nis}-${student.name}.png`;
            link.href = url;
            link.click();
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <canvas ref={canvasRef} className="border-2 border-gray-200 rounded-lg" />
            <p className="text-xs text-gray-500 text-center">
                QR Code - {student.name}
            </p>

            <div className="flex gap-3 print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                </button>
            </div>
        </div>
    );
}
