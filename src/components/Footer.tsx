"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(textRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={sectionRef}
            className="bg-red-800 lg:h-screen 2xl:h-[800px] min-h-[50vh] overflow-hidden flex items-center justify-center sticky bottom-0 -z-10"
        >
            <span
                ref={textRef}
                className="lg:text-[20rem] md:text-[10rem] text-[6rem] text-[#fffcf5] font-[family-name:var(--font-hello)] italic select-none leading-none text-center"
            >
                Hredoy

            </span>
        </div>
    );
}
