"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { poppins700, poppins400, poppins500 } from "@/utils/fonts";
import GitHubSolarSystem from "./GitHubSolarSystem";
import Navbar from "../navbar/Navbar";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Section3() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const solarSystem = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLImageElement>(null);

    useEffect(() => {

        gsap.set(cursorRef.current, {
            opacity: 0.5,
            scale: 1
        });

        const mainTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 1%",
                end: "+=100%",
                scrub: true,
                pin: true,
                pinSpacing: true,
                toggleActions: "play reverse play reverse"
            }
        });

        mainTimeline.fromTo(sectionRef.current,
            {
                opacity: 0,
                y: 50,
                scale: 0.8,
                filter: "blur(10px)"
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 3,
                ease: "power3.out"
            });

        mainTimeline.fromTo(leftRef.current,
            {
                opacity: 0,
                y: 50,
                scale: 0.9,
                filter: "blur(10px)"
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 3,
                ease: "power3.out"
            }, "-=0.2");

        mainTimeline.to(cursorRef.current, {
            opacity: 1,
            rotate: 0,
            duration: 3,
            ease: "power2.inOut",
            x: solarSystem.current ? (window.innerWidth / 2 + (solarSystem.current.getBoundingClientRect()?.width || 0) / 2) : 0,
            y: window.innerHeight / 2,
        });

        // 2. Cursor click animation
        mainTimeline.to(cursorRef.current, {
            scale: 0.9,
            duration: 0.2,
            ease: "power1.inOut",
            onComplete: () => {
                // Reset cursor scale after click
                gsap.to(cursorRef.current, {
                    scale: 1,
                    duration: 0.2
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div ref={sectionRef} className="w-full h-screen bg-black backdrop-blur-xs relative overflow-clip">
            {/* Background elements */}
            <img src="/DotGrid.svg" alt="Dot Pattern Grid" className="absolute w-screen" />
            <img src="/sec-3-shades.svg" alt="Black top bottom shades" className="absolute w-screen" />
            <img src="/sec-3-white-ball.png" alt="white shade ball" className="absolute w-screen blur-3xl" />

            {/* Cursor */}
            <img
                ref={cursorRef}
                src="/FigmaCursor.svg"
                alt="Cursor"
                className="absolute top-0 left-0 z-[120] w-8 h-8 rotate-45"
            />

            {/* Navbar */}
            <Navbar name={false} version={false} trynow={false} />

            {/* Content container - using flex row instead of absolute positioning */}
            <div className="w-full h-1/2 xl:h-full flex flex-col xl:flex-row items-start xl:items-center justify-center xl:justify-between px-10 moblie:px-16 space-y-6">

                {/* Left section */}
                <div ref={leftRef} className="xl:flex flex-col space-y-4 w-[90%] xl:w-1/2 z-30 ">
                    <p className={`${poppins700.className} text-3xl mobile2:text-4xl mobile:text-5xl sm:text-6xl xl:text-7xl 2xl:text-8xl text-white whitespace-pre-wrap leading-10 mobile:leading-14 sm:leading-20 2xl:leading-28`}>
                        Wanna
                        <br />
                        Contribute! 🚀
                    </p>

                    <p className={`${poppins400.className} text-xs mobile:text-base text-white/70 text-wrap w-[90%] mobile:w-[80%]`}>
                        Have an idea? 💡 Jump in, explore the codebase, and become a part of our growing universe! 🌌✨
                    </p>

                    <a
                        href="https://github.com/ChandanKhamitkar/BillBot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#131313] text-white/80 font-semibold text-xs mobile:text-sm w-fit ${poppins500.className} hover:scale-110 transition-all duration-300 ease-in-out`}
                    >
                        Contribute
                        <HiMiniArrowTopRightOnSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>

                </div>

                {/* Right Side */}
                <div ref={solarSystem} className="flex items-center self-center w-1/2 scale-50 mobile:scale-75 xl:scale-100 transform translate-y-[170px] mobile2:translate-y-[200px] xl:translate-y-0">
                    <GitHubSolarSystem />
                </div>
            </div>
        </div>
    );
};
