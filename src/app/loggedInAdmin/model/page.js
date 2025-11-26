'use client'
import { useState } from 'react'

export default function Modal() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105 transform"
            >
                Open Modal
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-blue-50 rounded-lg p-8 max-w-md w-full transform transition-all duration-300
                                 animate-[slideIn_0.3s_ease-out] opacity-100 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="mb-6 space-y-4">
                            <p className="text-gray-600">Welcome to our modal! Here some sample content:</p>
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>Feature 1: Amazing stuff</li>
                                    <li>Feature 2: Even more amazing</li>
                                    <li>Feature 3: Simply incredible</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all hover:scale-105"
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-105"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}