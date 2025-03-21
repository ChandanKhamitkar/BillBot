"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../navbar/Navbar";
import { youngserif, ibmplexmono600 } from "@/utils/fonts";
import { LuSend } from "react-icons/lu";
import { body } from "framer-motion/client";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {

    const phoneRef = useRef(null);
    const textRef = useRef(null);
    const subtextRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        if (!textRef.current || !phoneRef.current || !subtextRef.current) alert("there is no main text or phone ref or subtext");


        // Pin the background image
        gsap.to(bgRef.current, {
            scrollTrigger: {
                trigger: ".heroSection",
                start: "top top",
                end: "+=1000px",
                pin: true,
                scrub: 1
            }
        });
        // Main Hero Text
        gsap.to(textRef.current, {
            opacity: 0,
            filter: "blur(10px)",
            duration: .5,
            ease: "power1.out",
            scrollTrigger: {
                trigger: phoneRef.current,
                start: "top 50%",
                markers: true,
                toggleActions: "play reverse play reverse",
            }
        });

        // Subtext
        gsap.to(subtextRef.current, {
            opacity: 0,
            filter: "blur(10px)",
            duration: 1,
            ease: "power1.out",
            scrollTrigger: {
                trigger: phoneRef.current,
                start: "top 50%",
                toggleActions: "play reverse play reverse",
            }
        });

        // Rotate and move phone to center
        gsap.to(phoneRef.current, {
            rotate: "0", // Rotate to 0 degrees
            x: "-50%", // Move to center horizontally
            y: "-70%", // Move to center vertically
            left: "50%", // Align to center of the screen
            top: "50%", // Align to center of the screen
            duration: 2.7,
            ease: "power1.out",
            scrollTrigger: {
                trigger: phoneRef.current,
                start: "top 50%",
                end: "top 30%",
                scrub: 1, // Smooth scrolling effect
                toggleActions: "play reverse play reverse",
            }
        });


        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div className="heroSection w-full h-screen bg-black/10 backdrop-blur-xs relative mb-72">
            {/* Navbar */}
            <Navbar />

            {/* The purple circle + Noise + Star pattern */}
            <div ref={bgRef} className="backgroundImages absolute top-0 left-0 w-full h-screen z-0">

                <img
                    src="/purple-glow.png"
                    className="absolute top-0 backdrop-blur-xs w-full h-screen z-0"
                    alt="Purple glow of hero section"
                />
                <img
                    src="/starPattern.png"
                    alt="Star pattern"
                    className="w-[40%] h-[40%] absolute top-0 object-contain transform left-1/2 -translate-x-1/2 z-0"
                />
            </div>


            {/* Hero text */}
            <div
                className={`w-max h-screen mx-auto flex flex-col justify-center items-center space-y-6 text-white relative z-10 shadow-xl ${youngserif.className}`}
            >

                {/* Main Title */}
                <div
                    ref={textRef}
                    className="relative mainText">
                    <p className="text-8xl">Invoicing, Simplified</p>

                    {/* Single Star positioned at the top-right of the main text */}
                    <img
                        src="/thin-star.svg"
                        alt="Single star"
                        className="absolute top-0 transform -translate-y-[80%] right-0 w-28 h-28  z-20"
                    />
                </div>

                {/* Sub-text */}
                <div
                    ref={subtextRef}
                    className="w-full flex justify-between items-center text-white/90">
                    <p className="text-2xl">
                        <span className="flex justify-start items-center">
                            from your {<LuSend className="ml-2" />}
                        </span>
                        <span>telegram chat</span>
                    </p>

                    <p className={`${ibmplexmono600.className} text-base flex flex-col justify-start`}>
                        <span>a tool for Fast. Clean.</span>
                        <span>Invoice Img generation</span>
                    </p>
                </div>

                {/* Mobile Phone Mockup */}
                <div className="w-full flex justify-center mt-16 relative">
                    {/* left message box */}
                    {/* <img src="/msg-left-blue.svg" alt="Left message box" className="absolute left-[200px] top-[80%] z-10" /> */}
                    <img
                        ref={phoneRef}
                        src="/Phone.png"
                        alt="Mobile phone mockup"
                        className="w-[280px] absolute bottom-0 transform translate-y-[80%] rotate-12"
                    />
                    
                    {/* <img src="/msg-right-blue.svg" alt="Right message box" className="absolute right-[200px] top-0 z-10" /> */}
                </div>
            </div>


            {/* 3d Gemini + Google icons */}
            <img src="/gemini.png" alt="Gemini logo" className="absolute bottom-0 left-10 w-40" />
            <img src="/google.png" alt="Google logo" className="absolute -bottom-12 right-10 w-40" />

            {/* <img src="/PerspectiveGrid.svg" alt="Grids" className="abosolute bottom-0 w-full opacity-60" /> */}
        </div>
    );
}
