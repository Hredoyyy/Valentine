"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { songs } from "@/lib/songs";

export default function VinylPlayer({ start }: { start: boolean }) {
    const [currentSong, setCurrentSong] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRefs = useRef<HTMLAudioElement[]>([]);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Auto-play when start prop becomes true
    useEffect(() => {
        if (start && !hasInteracted) {
            const audio = audioRefs.current[0];
            if (audio) {
                const playPromise = audio.play();
                if (playPromise) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                            setHasInteracted(true);
                        })
                        .catch((error) => {
                            console.log("Auto-play blocked:", error);
                        });
                }
            }
        }
    }, [start, hasInteracted]);

    const playSong = useCallback(
        (index: number) => {
            // Pause all
            audioRefs.current.forEach((audio) => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });

            setCurrentSong(index);
            const audio = audioRefs.current[index];
            if (audio) {
                audio.play().catch(() => { });
                setIsPlaying(true);
                setHasInteracted(true);
            }
        },
        []
    );

    const togglePlay = useCallback(() => {
        const audio = audioRefs.current[currentSong];
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(() => { });
            setIsPlaying(true);
            setHasInteracted(true);
        }
    }, [currentSong, isPlaying]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    toggleActions: "play none none none",
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={sectionRef}
            className="min-h-screen 2xl:min-h-[800px] w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-4 lg:px-12 py-20 lg:py-40 relative bg-[#fffcf5]"
        >
            {/* Background text */}
            <div className="absolute lg:flex hidden -rotate-90 text-9xl font-[family-name:var(--font-editorial)] text-stone-200/60 left-45 select-none">
                Now playing
            </div>

            {/* Play/Pause button */}
            <button
                onClick={togglePlay}
                className="absolute text-2xl lg:text-4xl text-red-800 top-20 lg:top-40 right-6 lg:right-10 cursor-pointer z-20 underline underline-offset-4 hover:text-red-600 transition-colors font-[family-name:var(--font-editorial)]"
            >
                {isPlaying ? "pause" : "play"}
            </button>

            {/* Audio elements */}
            {songs.map((song, i) => (
                <audio
                    key={song.title}
                    ref={(el) => {
                        if (el) audioRefs.current[i] = el;
                    }}
                    src={song.audio}
                    loop
                />
            ))}

            {/* Song list - left side with vinyl discs peeking out */}
            <div className="w-full lg:w-2/5 lg:p-0 p-4 flex flex-wrap lg:flex-col gap-14 lg:gap-10 justify-center items-center lg:items-start lg:mt-0 mt-10">
                {songs.map((song, index) => (
                    <button
                        key={song.title}
                        type="button"
                        onClick={() => playSong(index)}
                        className="relative h-30 w-30 lg:h-60 lg:w-60 focus:outline-none cursor-pointer group"
                    >
                        {/* Small vinyl disc peeking out behind the album cover */}
                        <div
                            className={`absolute lg:translate-x-30 translate-x-10 scale-95 inset-0 rounded-full overflow-hidden transition-transform duration-500 ${currentSong === index ? "lg:translate-x-35 translate-x-14" : ""
                                }`}
                        >
                            {/* Vinyl disc texture */}
                            <div className="absolute inset-0 vinyl-gradient rounded-full" />
                            <div className="absolute inset-0 rounded-full border-[1px] border-white/5" />
                            <div className="absolute inset-[15%] rounded-full border-[1px] border-white/5" />
                            <div className="absolute inset-[30%] rounded-full border-[1px] border-white/5" />
                            {/* Center label with album art */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative lg:w-20 lg:h-20 w-12 h-12 rounded-full overflow-hidden">
                                    <Image
                                        alt={song.title}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                        src={song.cover}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Album cover (front) */}
                        <div className="absolute inset-0 z-10 overflow-hidden rounded-sm">
                            <Image
                                alt={song.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="240px"
                                src={song.cover}
                            />
                        </div>
                    </button>
                ))}
            </div>

            {/* Large vinyl disc - right side */}
            <div className="w-full lg:w-3/5 lg:pl-16">
                <div className="relative w-full h-full min-h-72 lg:min-h-80 flex items-center justify-center">
                    <div className="absolute rounded-full overflow-hidden w-72 h-72 lg:w-[50rem] lg:h-[50rem] will-change-transform">
                        <div
                            className={`relative w-full h-full ${isPlaying
                                ? "animate-spin-slow animate-spin-running"
                                : "animate-spin-slow animate-spin-paused"
                                }`}
                            style={{
                                willChange: "transform",
                                backfaceVisibility: "hidden",
                            }}
                        >
                            {/* Vinyl disc background */}
                            <div className="absolute inset-0 rounded-full vinyl-gradient" />

                            {/* Vinyl grooves */}
                            <div className="absolute inset-0 rounded-full border-[1px] border-white/5" />
                            <div className="absolute inset-[10%] rounded-full border-[1px] border-white/5" />
                            <div className="absolute inset-[20%] rounded-full border-[1px] border-white/5" />
                            <div className="absolute inset-[30%] rounded-full border-[1px] border-white/5" />

                            {/* Center label */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-28 h-28 lg:w-70 lg:h-70 rounded-full overflow-hidden shadow-inner">
                                    <Image
                                        alt={songs[currentSong].title}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                        src={songs[currentSong].cover}
                                    />
                                </div>
                            </div>

                            {/* Center hole */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 lg:w-5 lg:h-5 rounded-full bg-[#1a1a1a] border-2 border-gray-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
