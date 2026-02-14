"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Target: Feb 14, 2026, 8:00 PM UTC+6
const TARGET_DATE = new Date("2026-02-14T20:00:00+06:00");

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
}

function getTimeLeft(): TimeLeft {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();

    if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

export default function DateCountdown() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const noButtonRef = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
    const [yesClicked, setYesClicked] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    // Countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            const tl = getTimeLeft();
            setTimeLeft(tl);
            if (tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
                setIsExpired(true);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Scroll-triggered blur reveal
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(headingRef.current, {
                filter: "blur(0px)",
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%",
                    toggleActions: "play none none none",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Dodging "No" button
    const handleNoHover = useCallback(() => {
        if (!noButtonRef.current) return;
        const maxX = window.innerWidth - 200;
        const maxY = window.innerHeight - 100;
        const randomX = Math.random() * maxX - maxX / 2;
        const randomY = Math.random() * maxY - maxY / 2;

        gsap.to(noButtonRef.current, {
            x: randomX,
            y: randomY,
            duration: 0.3,
            ease: "power3.out",
        });
    }, []);

    const handleYes = useCallback(() => {
        setYesClicked(true);
        // Create hearts burst
        if (sectionRef.current) {
            for (let i = 0; i < 20; i++) {
                const heart = document.createElement("div");
                heart.textContent = "❤️";
                heart.style.position = "fixed";
                heart.style.fontSize = `${Math.random() * 30 + 20}px`;
                heart.style.left = `${Math.random() * 100}vw`;
                heart.style.top = `${Math.random() * 100}vh`;
                heart.style.zIndex = "100";
                heart.style.pointerEvents = "none";
                document.body.appendChild(heart);

                gsap.fromTo(
                    heart,
                    { opacity: 1, scale: 0, y: 0 },
                    {
                        opacity: 0,
                        scale: 1.5,
                        y: -200 - Math.random() * 300,
                        x: (Math.random() - 0.5) * 200,
                        duration: 1.5 + Math.random(),
                        ease: "power2.out",
                        onComplete: () => heart.remove(),
                    }
                );
            }
        }
    }, []);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        <div
            ref={sectionRef}
            className="h-screen 2xl:h-[800px] flex flex-col items-center justify-center gap-10 relative bg-[#fffcf5] px-4"
        >
            {/* Question heading */}
            <h2
                ref={headingRef}
                className="lg:text-9xl text-5xl sm:text-6xl font-[family-name:var(--font-hello)] italic text-center leading-tight flex flex-col items-center gap-2 text-stone-300"
                style={{ filter: "blur(12px)", opacity: 0 }}
            >
                <div className="flex flex-wrap justify-center gap-x-4 lg:gap-x-6">
                    <span className="-tracking-widest">
                        {yesClicked ? "You" : "Will"}
                    </span>
                    <span className="-tracking-widest">
                        {yesClicked ? "will" : "you"}
                    </span>
                    <span className="-tracking-widest">be my</span>
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 lg:gap-x-6">
                    <span className="-tracking-wider">valentine</span>
                    <span className="-tracking-wider">and</span>
                </div>
                {!yesClicked && (
                    <div className="flex text-red-700/40 flex-wrap justify-center gap-x-4 lg:gap-x-6">
                        <span className="-tracking-wider">go out with</span>
                        <span className="-tracking-wider">me at 8?</span>
                    </div>
                )}
                {yesClicked && (
                    <div className="flex text-red-700/40 flex-wrap justify-center gap-x-4 lg:gap-x-6">
                        <span className="-tracking-wider">go out with</span>
                        <span className="-tracking-wider">me at 8</span>
                    </div>
                )}
            </h2>

            {/* Countdown */}
            {!isExpired && !yesClicked && (
                <div className="flex items-center gap-4 lg:gap-8 mt-4">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl lg:text-7xl font-[family-name:var(--font-editorial)] text-red-800 countdown-digit">
                            {pad(timeLeft.hours)}
                        </span>
                        <span className="text-xs lg:text-sm font-[family-name:var(--font-hello)] text-stone-400 uppercase tracking-widest mt-1">
                            hours
                        </span>
                    </div>
                    <span className="text-4xl lg:text-7xl font-[family-name:var(--font-editorial)] text-stone-300">
                        :
                    </span>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl lg:text-7xl font-[family-name:var(--font-editorial)] text-red-800 countdown-digit">
                            {pad(timeLeft.minutes)}
                        </span>
                        <span className="text-xs lg:text-sm font-[family-name:var(--font-hello)] text-stone-400 uppercase tracking-widest mt-1">
                            min
                        </span>
                    </div>
                    <span className="text-4xl lg:text-7xl font-[family-name:var(--font-editorial)] text-stone-300">
                        :
                    </span>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl lg:text-7xl font-[family-name:var(--font-editorial)] text-red-800 countdown-digit">
                            {pad(timeLeft.seconds)}
                        </span>
                        <span className="text-xs lg:text-sm font-[family-name:var(--font-hello)] text-stone-400 uppercase tracking-widest mt-1">
                            sec
                        </span>
                    </div>
                </div>
            )}

            {/* Yes response */}
            {yesClicked && (
                <div className="text-2xl lg:text-4xl font-[family-name:var(--font-hello)] italic text-red-800 animate-pulse">
                    See you at 8! ❤️
                </div>
            )}

            {/* Buttons */}
            {!yesClicked && (
                <div className="flex gap-6 mt-8">
                    <button
                        onClick={handleYes}
                        className="text-2xl lg:text-3xl font-[family-name:var(--font-hello)] border border-red-800 text-red-800 px-12 py-4 rounded-full cursor-pointer hover:bg-red-800 hover:text-white transition-colors duration-300"
                    >
                        Yes
                    </button>
                    <div
                        ref={noButtonRef}
                        onMouseEnter={handleNoHover}
                        onTouchStart={handleNoHover}
                        className="text-2xl lg:text-3xl font-[family-name:var(--font-hello)] border border-stone-400 text-stone-400 px-12 py-4 rounded-full cursor-pointer transition-transform duration-300 select-none"
                    >
                        No
                    </div>
                </div>
            )}
        </div>
    );
}
