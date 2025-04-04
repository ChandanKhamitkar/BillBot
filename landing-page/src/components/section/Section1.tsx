"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { youngserif, poppins400 } from "@/utils/fonts";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}
export default function Section1() {
    const section1Ref = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        gsap.set(leftRef.current, {
            scale: 0.1,
            x: "-100%",
            y: 100,
        });

        gsap.set(rightRef.current, {
            scale: 0.1,
            x: "100%",
            y: 100,
        });

        gsap.to([leftRef.current, rightRef.current], {
            scale: 1,
            x: 0,
            y: 0,
            duration: 2,
            ease: "power3.inOut",
            scrollTrigger: {
                trigger: section1Ref.current,
                start: "top 50%",
                toggleActions: "play reverse play reverse"
            }
        })

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        }
    }, []);

    return (
        <div
            ref={section1Ref}
            className="bg-black w-full h-full grid grid-cols-1 tablet:grid-cols-2 grid-rows-2 tablet:grid-rows-1 gap-10 mx-auto px-12 py-8 overflow-clip">

            {/* Left Section */}
            <div
                ref={leftRef}
                className="rounded-xl overflow-clip border border-[#2E2E2E] relative">
                <img src="/sec-1-left-bg.png" alt="Section 1 left bg wavery image" className="object-center" />

                <div className="space-y-4 absolute left-6 mobile:left-10 bottom-6 mobile:bottom-10 z-10">
                    <p className={`text-2xl mobile2:text-3xl mobile:text-4xl xl:text-5xl whitespace-pre-wrap text-left ${youngserif.className} text-white`}>
                        Create unlimited
                        <br />
                        invoices instantly
                    </p>
                    <p className={`${poppins400.className} text-xs mobile:text-sm text-wrap text-white/80 w-[70%]`}>
                        Just send customer details, and BillBot AI 🤖will generate a beautiful invoice. image—fast and hassle-free.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div
                ref={rightRef}
                className="rounded-xl overflow-clip border border-white/60 flex justify-center items-center relative shadow-[inset_0_0_30px_0_rgba(255,255,255,0.2)] ">
                <img src="/sec-1-right-bg.png" alt="Section 1 right bg light image" className="object-center opacity-80 blur-lg" />
                <img src="/react.png" alt="react" className="z-10 w-[125px] sm:w-[217px] absolute mix-blend-luminosity" />
                <div className="w-[90%] h-[90%] rounded-xl absolute z-10 border border-white opacity-70 "></div>
                <div className="w-[80%] h-[80%] rounded-xl absolute z-10 border border-white opacity-50"></div>
                <div className="w-[70%] h-[70%] rounded-xl absolute z-10 border border-white opacity-30"></div>
                <div className="w-[60%] h-[60%] rounded-xl absolute z-10 border border-white opacity-20"></div>
                <div className="w-[50%] h-[50%] rounded-xl absolute z-10 border border-white opacity-10"></div>
                <div className="w-[40%] h-[40%] rounded-xl absolute z-10 border border-white opacity-5"></div>
            </div>
        </div>
    );
};
