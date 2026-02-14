"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { songs } from "@/lib/songs";

const loaderImages = [
    "/loaderimage/1.jpeg",
    "/loaderimage/2.jpeg",
    "/loaderimage/3.jpeg",
    "/loaderimage/4.jpeg",
    "/loaderimage/5.jpeg",
    "/loaderimage/6.jpeg",
    "/loaderimage/7.jpeg",
    "/loaderimage/8.jpeg",
    "/loaderimage/9.jpeg",
    "/loaderimage/10.jpeg",
];

const heroImage = "/photos/bg2.webp";

export default function Loader({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const [shouldReveal, setShouldReveal] = useState(false);

    // Use a ref to animate the progress value without touching DOM directly
    const progressRef = useRef({ val: 0 });

    // Photo cycling
    useEffect(() => {
        if (shouldReveal) return;
        const interval = setInterval(() => {
            setCurrentPhoto((prev) => (prev + 1) % loaderImages.length);
        }, 300);
        return () => clearInterval(interval);
    }, [shouldReveal]);

    // PRELOADING LOGIC
    useEffect(() => {
        const assetsToLoad = [
            ...loaderImages,
            heroImage,
            ...songs.map(s => s.audio),
            ...songs.map(s => s.cover)
        ];

        let loadedCount = 0;
        const total = assetsToLoad.length;

        const updateProgress = () => {
            loadedCount++;
            const newProgress = Math.round((loadedCount / total) * 100);

            // Animate progress smoothly to the new value
            gsap.to(progressRef.current, {
                val: newProgress,
                duration: 0.5,
                onUpdate: function () {
                    setProgress(Math.round(progressRef.current.val));
                },
                onComplete: () => {
                    if (loadedCount === total) {
                        setIsLoaded(true);
                    }
                }
            });
        };

        const loadAsset = (url: string) => {
            return new Promise<void>((resolve) => {
                if (url.match(/\.(mp3|wav|ogg)$/i)) {
                    // Preload Audio
                    fetch(url)
                        .then(res => res.blob())
                        .then(() => {
                            updateProgress();
                            resolve();
                        })
                        .catch((err) => {
                            console.error("Failed to load audio:", url, err);
                            // Even on error, we count it as processed so loader doesn't hang
                            updateProgress();
                            resolve();
                        });
                } else {
                    // Preload Image
                    const img = new window.Image();
                    img.src = url;
                    img.onload = () => {
                        updateProgress();
                        resolve();
                    };
                    img.onerror = () => {
                        console.error("Failed to load image:", url);
                        updateProgress();
                        resolve();
                    };
                }
            });
        };

        // Start loading
        Promise.all(assetsToLoad.map(loadAsset));

        // Initial scale animation (independent of loading)
        gsap.to(imageRef.current, {
            scale: 1.1,
            duration: 10, // Slower scale for initial load feeling
            ease: "power2.out",
        });

    }, []);

    const handleClick = () => {
        if (!isLoaded || shouldReveal) return;
        setShouldReveal(true);

        const tl = gsap.timeline({
            onComplete: () => {
                onComplete();
            },
        });

        // Fade out counter and image
        tl.to([counterRef.current, imageRef.current], {
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
        });

        // Split screen reveal
        tl.to(
            topRef.current,
            {
                yPercent: -100,
                duration: 1,
                ease: "power4.inOut",
            },
            "+=0.1"
        );

        tl.to(
            bottomRef.current,
            {
                yPercent: 100,
                duration: 1,
                ease: "power4.inOut",
            },
            "<"
        );

        // Fade out entire loader
        tl.to(
            containerRef.current,
            {
                opacity: 0,
                duration: 0.3,
                pointerEvents: "none",
            },
            "+=0.2"
        );
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[60] cursor-pointer"
            onClick={handleClick}
        >
            {/* Top half */}
            <div
                ref={topRef}
                className="absolute top-0 left-0 w-full h-1/2 bg-black"
            />
            {/* Bottom half */}
            <div
                ref={bottomRef}
                className="absolute bottom-0 left-0 w-full h-1/2 bg-black"
            />

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                <div className="relative flex items-center justify-center w-full max-w-2xl px-4">
                    <div
                        ref={imageRef}
                        className="relative inline-flex overflow-hidden transform-gpu rounded-sm lg:max-h-64 lg:max-w-[70vw] max-h-48 max-w-[50vw] w-80 h-52"
                    >
                        <Image
                            src={loaderImages[currentPhoto]}
                            alt="Loading memory"
                            fill
                            className="object-cover transition-opacity duration-200"
                            priority
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    </div>
                </div>

                <div
                    ref={counterRef}
                    className="absolute bottom-10 right-10 flex flex-col items-end gap-2"
                >
                    <div className="lg:text-9xl text-7xl italic font-[family-name:var(--font-hello)] text-white/80">
                        {progress}%
                    </div>
                    {isLoaded && (
                        <div className="text-white/60 font-[family-name:var(--font-sans)] text-sm tracking-widest uppercase animate-pulse">
                            Click to continue
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
