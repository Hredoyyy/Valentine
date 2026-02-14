"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import ValentineSection from "@/components/ValentineSection";
import LoveLetter from "@/components/LoveLetter";
import VinylPlayer from "@/components/VinylPlayer";
import DateCountdown from "@/components/DateCountdown";
import Footer from "@/components/Footer";

const FilmGrain = dynamic(() => import("@/components/FilmGrain"), {
  ssr: false,
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [startMusic, setStartMusic] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
    setStartMusic(true);
  }, []);

  return (
    <>
      <FilmGrain />
      <Loader onComplete={handleLoadComplete} />

      <div className="relative z-10 bg-[#fffcf5]">
        <Hero />
        <ValentineSection />
        <LoveLetter />
        <VinylPlayer start={startMusic} />
        <DateCountdown />
      </div>
      <Footer />
    </>
  );
}
