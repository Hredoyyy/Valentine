"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LoveLetter() {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                y: 80,
                opacity: 0,
                rotate: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="flex justify-center px-4 lg:px-0 pt-20 lg:pt-40 bg-[#fffcf5]">
            <div
                ref={cardRef}
                className="bg-white shadow-2xl w-full lg:w-[75rem] lg:-rotate-6 z-10 p-7 lg:p-20 flex flex-col gap-8 lg:gap-25"
            >
                <h2 className="text-xl lg:text-5xl font-[family-name:var(--font-editorial)] italic text-red-800">
                    a letter for Afsana
                </h2>
                <div className="flex flex-col gap-4 lg:gap-5 font-sans italic text-sm lg:text-2xl leading-relaxed lg:leading-normal text-justify text-stone-500">
                    <p>Hi love,</p>
                    <p>
                        I wanted to do something different this time — something that feels
                        more genuine than a store-bought gift wrapped in obligation. So I
                        built this. Every pixel, every word, every song — it&apos;s all for
                        you.
                    </p>
                    <p>
                        You know I&apos;m not great with words (okay, maybe sometimes I
                        am), but I want you to know that you make every ordinary day feel
                        extraordinary. Your laugh is my favorite sound. Your smile is my
                        favorite sight. And being with you is my favorite thing.
                    </p>
                    <p>
                        A single day is not enough to show my love, nor should only one day
                        be dedicated to telling you how special you are and how much you
                        mean to me. You are an absolute bundle of joy, and I wouldn&apos;t
                        have it any other way.
                    </p>
                    <p>
                        So here&apos;s to us — not just today, but every day. I love you
                        more than words on a screen can say, but I hope this comes close.
                    </p>
                    <p className="text-red-800 font-semibold not-italic mt-4">
                        — With all my love ❤️
                    </p>
                </div>
            </div>
        </div>
    );
}
