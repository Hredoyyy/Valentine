"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ValentineSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const valentineRef = useRef<HTMLSpanElement>(null);
    const loverRef = useRef<HTMLSpanElement>(null);
    const svgPathRef = useRef<SVGPathElement>(null);
    const mailRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // SVG path draw animation
            if (svgPathRef.current) {
                // Set initial state
                gsap.set(svgPathRef.current, {
                    strokeDasharray: 1,
                    strokeDashoffset: 1,
                    opacity: 1,
                });

                gsap.to(svgPathRef.current, {
                    strokeDashoffset: 0,
                    duration: 2,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                        toggleActions: "play none none none",
                    },
                });
            }

            // Text swap animation: valentine's → lover's
            const swapTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 30%",
                    end: "bottom 70%",
                    // Changed to play and stick found
                    toggleActions: "play none none none",
                },
            });

            swapTl.to(valentineRef.current, {
                opacity: 0,
                duration: 0.6,
                ease: "power3.inOut",
            });

            swapTl.to(
                loverRef.current,
                {
                    opacity: 1,
                    clipPath: "inset(-20% -20% -20% -20%)", // Expanded clip path to prevent cutoff
                    duration: 0.6,
                    ease: "power3.inOut",
                },
                "<"
            );

            // Mail.webp scroll animation:
            // Starts at its current position, then moves to the right
            // and travels down the page until the bottom of the letter section
            if (mailRef.current) {
                gsap.to(mailRef.current, {
                    x: () => window.innerWidth * 0.35,
                    y: () => window.innerHeight * 1.2,
                    rotation: 8,
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        // End at the bottom of the love letter (2 sections down)
                        end: () => `+=${window.innerHeight + 10}`,
                        scrub: 1,
                        pin: false,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={sectionRef}
            className="min-h-screen 2xl:min-h-[800px] pt-40 lg:pt-60 lg:px-10 px-4 flex flex-col items-center lg:justify-between gap-10 relative bg-[#fffcf5] -mt-1"
        >
            {/* Decorative SVG */}
            <svg
                viewBox="0 0 474 243"
                className="absolute lg:top-10 lg:left-40 left-0 -z-10 w-96 h-48 sm:w-[34rem] sm:h-[17rem] lg:w-[60rem] lg:h-[30rem]"
            >
                <path
                    ref={svgPathRef}
                    d="M0.216461 0.119293C0.216461 0.119293 164.716 294.119 189.216 234.119C213.716 174.119 256.216 166.119 415.216 214.119C574.216 262.119 85.2165 34.1193 180.216 36.1193C275.216 38.1193 473.216 103.119 473.216 103.119"
                    fill="none"
                    stroke="#961210"
                    strokeWidth="0.5"
                    opacity="0"
                    pathLength="1"
                    strokeDashoffset="0"
                    strokeDasharray="0 1"
                />
            </svg>

            {/* Main heading */}
            <div className="text-6xl lg:text-9xl font-[family-name:var(--font-editorial)] text-stone-300 text-center lg:text-left flex flex-col gap-4">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                    <span>Happy</span>
                    {/* mail.webp with scroll-triggered animation */}
                    <div
                        ref={mailRef}
                        className="will-change-transform z-20 relative w-24 h-16 lg:w-52 lg:h-36"
                    >
                        <Image
                            src="/photos/mail.webp"
                            alt="mail"
                            fill
                            className="object-contain drop-shadow-lg"
                            sizes="(min-width: 1024px) 208px, 96px"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className="flex items-center justify-center relative">
                        <span
                            ref={loverRef}
                            className="-tracking-widest italic font-semibold text-red-800 absolute"
                            style={{ clipPath: "inset(-10% 110% -10% 0)", opacity: 0 }}
                        >
                            lover&apos;s
                        </span>
                        <span ref={valentineRef}>valentine&apos;s</span>
                    </div>
                    <span>day</span>
                </div>
            </div>

            {/* Bottom row */}
            <div className="w-full flex flex-col gap-6 md:flex-row md:items-start md:justify-between text-center md:text-left">
                <div className="uppercase text-xs lg:text-sm tracking-wide text-stone-500">
                    Scroll to see
                </div>
                <div className="uppercase text-xs lg:text-sm tracking-wide text-stone-500">
                    the love <span className="italic">letter</span>
                </div>
                <span className="lg:max-w-md font-[family-name:var(--font-editorial)] tracking-wider text-sm text-stone-500 leading-7 text-justify lg:pt-0 pt-20">
                    <b>Hi love</b>, glad you made it here. You likely already know that{" "}
                    <b>I don&apos;t</b> particularly <b>like</b> the celebration of{" "}
                    <b>Valentine&apos;s Day</b> as I feel it primarily serves to encourage
                    consumerism. <br />
                    <b>However</b>, the fact that I am sharing this with you shows that{" "}
                    <b>I</b> do <b>believe in</b> something: the importance of displaying
                    <b> love</b>.
                </span>
            </div>
        </div>
    );
}
