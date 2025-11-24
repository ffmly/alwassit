// --- START OF FILE components/SignaturePadModal.tsx ---
import React, { useRef, useState, useEffect } from 'react';
import { Icon } from './UIComponents';
import { translations } from '../i18n/fraudTranslations'; // Reusing general structure
import { creditTranslations } from '../i18n/creditTranslations';

export const SignaturePadModal = ({ isOpen, onClose, onSign, contractText, lang='en' }: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);
    
    // @ts-ignore
    const t = creditTranslations[lang] || creditTranslations.en;

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#2563eb'; // Blue pen
            }
        }
    }, [isOpen]);

    const getPos = (e: any) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDraw = (e: any) => {
        setIsDrawing(true);
        const { x, y } = getPos(e);
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
        ctx?.moveTo(x, y);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const { x, y } = getPos(e);
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.lineTo(x, y);
        ctx?.stroke();
        setHasSigned(true);
    };

    const stopDraw = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        setHasSigned(false);
    };

    const handleConfirm = () => {
        if (!hasSigned) return;
        const dataUrl = canvasRef.current?.toDataURL();
        onSign(dataUrl);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-md flex items-end sm:items-center justify-center">
            <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-auto sm:rounded-2xl rounded-t-3xl flex flex-col overflow-hidden animate-slide-up">
                
                {/* Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">{t.contractTitle}</h3>
                    <button onClick={onClose}><Icon name="close" className="text-slate-400" /></button>
                </div>

                {/* Contract Text Preview */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="bg-white border border-slate-200 shadow-sm p-4 font-mono text-[10px] leading-relaxed text-slate-600 whitespace-pre-wrap">
                        {contractText}
                    </div>
                </div>

                {/* Signature Area */}
                <div className="bg-white p-4 border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] relative z-10">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.signArea}</label>
                        <button onClick={clearCanvas} className="text-xs text-blue-500 font-bold hover:underline">Clear</button>
                    </div>
                    
                    <div className="border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/30 h-32 touch-none overflow-hidden cursor-crosshair mb-4 relative">
                        {!hasSigned && <span className="absolute inset-0 flex items-center justify-center text-blue-200 text-3xl opacity-20 pointer-events-none select-none">Draw Signature</span>}
                        <canvas 
                            ref={canvasRef}
                            className="w-full h-full"
                            onMouseDown={startDraw}
                            onMouseMove={draw}
                            onMouseUp={stopDraw}
                            onMouseLeave={stopDraw}
                            onTouchStart={startDraw}
                            onTouchMove={draw}
                            onTouchEnd={stopDraw}
                        />
                    </div>

                    <button 
                        onClick={handleConfirm}
                        disabled={!hasSigned}
                        className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2
                            ${hasSigned ? 'bg-blue-600 shadow-lg shadow-blue-200 scale-100' : 'bg-slate-300 scale-95 opacity-70'}
                        `}
                    >
                       <Icon name="history_edu" /> {t.confirmSign}
                    </button>
                </div>
            </div>
        </div>
    );
};