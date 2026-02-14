"use client";

import { useEffect, useRef } from "react";

export default function FilmGrain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        const patternSize = 250;
        const patternAlpha = 15;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawGrain = () => {
            const imageData = ctx.createImageData(patternSize, patternSize);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const value = Math.random() * 255;
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = patternAlpha;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const pattern = ctx.createPattern(
                (() => {
                    const patternCanvas = document.createElement("canvas");
                    patternCanvas.width = patternSize;
                    patternCanvas.height = patternSize;
                    const patternCtx = patternCanvas.getContext("2d")!;
                    patternCtx.putImageData(imageData, 0, 0);
                    return patternCanvas;
                })(),
                "repeat"
            );

            if (pattern) {
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            animationId = requestAnimationFrame(drawGrain);
        };

        resize();
        drawGrain();
        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-50">
            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute top-0 left-0 h-screen w-screen film-grain"
            />
        </div>
    );
}
