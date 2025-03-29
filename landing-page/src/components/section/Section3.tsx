"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { poppins700, poppins400 } from "@/utils/fonts";
import GitHubSolarSystem from "./GitHubSolarSystem";
import Navbar from "../navbar/Navbar";

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
        <div ref={sectionRef} className="w-full h-screen bg-black backdrop-blur-xs relative overflow-clip flex justify-around items-center">


            {/* Cursor */}
            <img
                ref={cursorRef}
                src="/FigmaCursor.svg"
                alt="Cursor"
                className="absolute top-0 left-0 z-[120] w-8 h-8 rotate-45"
            />
            {/* Navbar */}
            <Navbar name={false} version={false} trynow={false} />

            <img src="/DotGrid.svg" alt="Dot Pattern Grid" className="absolute w-screen" />
            <img src="/sec-3-shades.svg" alt="Black top bottom shades" className="absolute w-screen" />
            <img src="/sec-3-white-ball.png" alt="white shade ball" className="absolute w-screen blur-3xl" />

            {/* Left section */}
            <div ref={leftRef} className="flex justify-start flex-col space-y-4 absolute left-18 top-1/2 transform -translate-y-1/2">
                <p className={`${poppins700.className} text-8xl text-white whitespace-pre-wrap leading-28`}>
                    Wanna
                    <br />
                    Contribute! 🚀
                </p>

                <p className={`${poppins400.className} text-white/70 text-wrap w-[80%]`}>
                    Have an idea? 💡 Jump in, explore the codebase, and become a part of our growing universe! 🌌✨
                </p>
            </div>

            {/* Right Side */}
            <div ref={solarSystem} className="w-[50%] flex justify-center transform translate-x-1/2">
                <GitHubSolarSystem />
            </div>

        </div>
    );
};
