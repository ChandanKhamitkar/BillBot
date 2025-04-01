"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../navbar/Navbar";
import { youngserif, poppins500, poppins400 } from "@/utils/fonts";
import { LuSend } from "react-icons/lu";
import { IoStar } from "react-icons/io5";

const listData = [
    "Yours to keep forever",
    "Future updates included",
    "No subscription"
];

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
    const footerRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const middleRef = useRef<HTMLDivElement>(null);
    const separatorRef = useRef<HTMLDivElement>(null);
    const pref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {

        const mainTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top 1%",
                end: "+=100%",
                scrub: true,
                pin: true,
                pinSpacing: true,
                toggleActions: "play reverse play reverse"
            }
        });

        mainTimeline.fromTo(footerRef.current,
            {
                opacity: 0,
                y: -50,
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
        mainTimeline.fromTo([headRef.current, middleRef.current, separatorRef.current],
            {
                opacity: 0,
                y: -50,
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
            },"-=0.2");

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);
    
    return (
        <div ref={footerRef} className="w-screen h-screen bg-black backdrop-blur-xs relative overflow-clip flex flex-col">
            {/* Navbar */}
            <Navbar />

            {/* Gradient background */}
            <img
                src="/FooterBG.svg"
                alt="Footer Background Gradient"
                className="absolute w-full h-full object-cover"
            />

            {/* Content Wrapper */}
            <div className="w-full flex-1 flex flex-col justify-end space-y-10 p-10 text-white z-10">
                {/* Main Heading */}
                <div ref={headRef}>
                    <p className={`${youngserif.className} text-7xl lg:text-9xl`}>Ready to try?</p>
                    <p className="text-xl sm:text-2xl flex items-center">
                        Use BillBot AI on <LuSend className="mx-2" /> Telegram
                    </p>
                </div>

                {/* Middle Content */}
                <div ref={middleRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-10 space-y-10 sm:space-y-0">
                    <p className={`${youngserif.className} text-xl lg:text-2xl`}>
                        Try it for<br />Free
                    </p>

                    <div className="flex flex-col space-y-2">
                        {listData.map((item, index) => (
                            <div key={index} className="flex space-x-2 items-center">
                                <div className="w-7 h-7 lg:w-10 lg:h-10 bg-[#5404FF] rounded-full flex justify-center items-center">
                                    <IoStar className="size-5" />
                                </div>
                                <p className={`${poppins500.className} text-sm lg:text-base`}>{item}</p>
                            </div>
                        ))}
                    </div>

                    <div className="w-[80%] sm:w-[30%]">
                        <p className={`${youngserif.className} text-2xl`}>Why us?</p>
                        <p className={`${poppins400.className} text-sm lg:text-base text-wrap`}>
                            Simply chat your invoice details, and we&apos;ll transform them into a sleek, professional invoice image!
                        </p>
                    </div>
                </div>

                {/* Separator Line */}
                <div ref={separatorRef} className="w-full h-px border border-[#5B5B5B] border-dashed"></div>

                {/* Footer Text */}
                <p ref={pref} className={`${poppins400.className} text-[#C5C5C5] text-xs sm:text-sm`}>
                    You can use it from any region.
                </p>
            </div>
        </div>
    );
}
