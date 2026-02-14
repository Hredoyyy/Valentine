"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax on the background image
            gsap.to(imageRef.current, {
                yPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // Heading parallax (moves faster)
            gsap.to(headingRef.current, {
                yPercent: -40,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // Fade in the intro text
            gsap.to(textRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={sectionRef} className="h-screen 2xl:h-[800px] relative overflow-hidden z-20 bg-[#fffcf5]">
            <div ref={imageRef} className="absolute inset-0 will-change-transform">
                <Image
                    alt="hero"
                    src="/photos/bg2.webp"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
            </div>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-between lg:p-15 p-10 z-10">
                {/* Date pill */}
                <div className="flex items-center justify-center w-full">
                    <div className="font-[family-name:var(--font-editorial)] text-stone-200 lg:text-xl text-base flex items-center justify-center rounded-full border border-stone-300/60 px-7 py-3 backdrop-blur-sm bg-white/10">
                        <span>14 . 02 . 2026</span>
                    </div>
                </div>

                {/* Main heading */}
                <div
                    ref={headingRef}
                    className="lg:text-9xl text-7xl font-[family-name:var(--font-editorial)] text-center leading-tight -mt-40 will-change-transform"
                >
                    <span className="italic text-stone-100 font-[family-name:var(--font-hello)] relative z-20 block">
                        the 14th of
                    </span>
                    <span className="uppercase tracking-tighter font-black text-[#ffb7e0] relative z-10 block">
                        February
                    </span>
                </div>

                {/* Intro paragraph */}
                <div
                    ref={textRef}
                    className="text-center max-w-xl text-stone-100 font-[family-name:var(--font-editorial)] will-change-transform lg:text-base text-sm leading-relaxed"
                    style={{ opacity: 0, transform: "translateY(16px)" }}
                >
                    I place no faith in the hollow decree of a single calendar day, for a
                    scheduled romance feels hollow. I believe in the genuine acts of love
                    that happen every day without needing a reason.
                </div>
            </div>
        </div>
    );
}
