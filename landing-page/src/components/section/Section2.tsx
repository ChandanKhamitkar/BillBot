"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { youngserif, poppins400, poppins500, poppins600 } from "@/utils/fonts";
import { FaArrowRight } from "react-icons/fa6"
import { FiShare2 } from "react-icons/fi";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Section2() {
    const section1Ref = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const slateRef = useRef<HTMLDivElement>(null);
    const goldDiamondRef = useRef<HTMLImageElement>(null);
    const cursorRef = useRef<HTMLImageElement>(null);
    const rippleRef = useRef<HTMLDivElement>(null);

    // Refs for inner content animations
    const leftTitleRef = useRef<HTMLParagraphElement>(null);
    const leftDescRef = useRef<HTMLParagraphElement>(null);
    const leftCTARef = useRef<HTMLParagraphElement>(null);
    const leftDownloadIconRef = useRef<HTMLImageElement>(null);
    const leftDiamondRef = useRef<HTMLImageElement>(null);

    const rightTitleRef = useRef<HTMLParagraphElement>(null);
    const rightDescRef = useRef<HTMLParagraphElement>(null);
    const rightCTARef = useRef<HTMLParagraphElement>(null);
    const successBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!goldDiamondRef.current) return;

        // Initial setup
        gsap.set(goldDiamondRef.current, {
            scale: 1,
            rotation: 0
        });

        gsap.set(cursorRef.current, {
            opacity: 0,
            scale: 1
        });

        gsap.set(rippleRef.current, {
            scale: 0,
            opacity: 0
        });

        // Initial setup for card content - starting positions
        gsap.set([leftTitleRef.current, rightTitleRef.current], {
            y: 30,
            opacity: 0
        });

        gsap.set([leftDescRef.current, rightDescRef.current], {
            y: 20,
            opacity: 0
        });

        gsap.set([leftCTARef.current, rightCTARef.current], {
            y: 15,
            opacity: 0
        });

        gsap.set(leftDownloadIconRef.current, {
            y: 40,
            opacity: 0,
            scale: 0.8
        });

        gsap.set(leftDiamondRef.current, {
            rotation: -45,
            opacity: 0.5,
            scale: 0.8
        });

        gsap.set(successBoxRef.current, {
            y: 50,
            opacity: 0,
            scale: 0.8
        });

        // Main slate and cursor animation timeline
        const mainTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section1Ref.current,
                start: "top 1%",
                end: "+=100%",
                scrub: true,
                pin: true,
                pinSpacing: true,
                markers: false
            }
        });

        // 1. Cursor animation - appear and move to diamond
        mainTimeline.to(cursorRef.current, {
            opacity: 1,
            x: goldDiamondRef.current ? -(window.innerWidth / 2 - (goldDiamondRef.current.getBoundingClientRect()?.width || 0) / 2) : 0,
            y: window.innerHeight / 2 + 50,
            duration: 2,
            ease: "power2.inOut"
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

        // 3. Ripple effect animation
        mainTimeline.to(rippleRef.current, {
            scale: 10,
            opacity: 0.6,
            duration: 2,
            ease: "power1.out"
        }, "-=0.2");

        mainTimeline.to(rippleRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power1.in"
        }, "+=0.2");

        // 4. Slate disappearing animation with circular reveal
        mainTimeline.to(slateRef.current, {
            clipPath: "circle(0% at center)",
            duration: 1.5,
            ease: "power3.inOut"
        }, "-=0.5");

        // 5. Card content animations - activate after slate disappears

        // Left card animations
        mainTimeline.to([leftTitleRef.current, rightTitleRef.current], {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.8");

        mainTimeline.to([leftDescRef.current, rightDescRef.current], {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.5)"
        }, "-=0.6");

        mainTimeline.to([leftCTARef.current, rightCTARef.current], {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.3)"
        }, "-=0.4");

        // Left card special elements
        mainTimeline.to(leftDiamondRef.current, {
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "elastic.out(1, 0.5)"
        }, "-=0.5");

        mainTimeline.to(leftDownloadIconRef.current, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "bounce.out"
        }, "-=0.7");

        // Right card success box
        mainTimeline.to(successBoxRef.current, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.3)"
        }, "-=0.9");

        // Create a subtle hover effect for both cards
        const hoverAnimation = () => {
            gsap.to(leftRef.current, {
                y: -5,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                duration: 0.3,
                ease: "power1.out"
            });

            gsap.to(rightRef.current, {
                y: -5,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                duration: 0.3,
                ease: "power1.out",
                delay: 0.1
            });
        };

        // Execute hover animation after the main timeline is complete
        mainTimeline.add(() => hoverAnimation(), "+=0.2");

        // Create floating animation for download icon
        const createFloatingAnimation = () => {
            gsap.to(leftDownloadIconRef.current, {
                y: "-=10",
                duration: 1.5,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        };

        // Execute floating animation for download icon
        mainTimeline.add(() => createFloatingAnimation(), "-=0.3");

        // Final cursor movement to bottom-left and disappear
        mainTimeline.to(cursorRef.current, {
            x: 10,
            y: window.innerHeight - 50,
            duration: 3,
            rotate: "-90%",
            ease: "power2.inOut"
        }, "+=0.5");

        // Fade out cursor
        mainTimeline.to(cursorRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power1.out"
        }, "-=0.3");

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        }
    }, []);

    return (
        <div
            ref={section1Ref}
            className="bg-black w-full h-full grid grid-cols-1 tablet:grid-cols-2 grid-rows-2 tablet:grid-rows-1 gap-10 mx-auto px-12 py-8 relative">

            {/* Cursor */}
            <img
                ref={cursorRef}
                src="/FigmaCursor.svg"
                alt="Cursor"
                className="absolute top-0 right-0 z-[120] w-8 h-8"
            />

            {/* slate with circular clip-path for reveal effect */}
            <div
                ref={slateRef}
                className="absolute z-[100] inset-0 h-full w-full flex justify-center items-center bg-black/15 backdrop-blur-xl"
                style={{ clipPath: "circle(150% at center)" }}
            >
                <img
                    ref={goldDiamondRef}
                    src="/Golden-diamond.svg"
                    alt="Golden Diamond"
                    className="cursor-pointer"
                />

                {/* Ripple effect div */}
                <div
                    ref={rippleRef}
                    className="absolute w-16 h-16 rounded-full bg-white/30 pointer-events-none"
                >
                </div>
            </div>

            {/* left section */}
            <div
                ref={leftRef}
                className="rounded-xl overflow-clip bg-[#131313] backdrop-blur-xs border border-[#2E2E2E] relative transition-all duration-300"
            >
                <img src="/sec-2-left-bg.png" alt="Section 2 left bg image" className="object-center blur-sm" />

                <div className="space-y-4 absolute left-10 top-10 z-10">
                    <p
                        ref={leftTitleRef}
                        className={`text-3xl mobile:text-4xl xl:text-5xl whitespace-pre-wrap text-left ${youngserif.className} text-white leading-10 sm:leading-16`}
                    >
                        Download in
                        <br />
                        high-quality
                    </p>
                    <p
                        ref={leftDescRef}
                        className={`${poppins400.className} text-xs mobile2:text-sm text-wrap text-white/80 w-[90%]`}
                    >
                        As JPG/JPEG format - perfect for sharing anytime, anywhere!
                    </p>
                    <p
                        ref={leftCTARef}
                        className={`${poppins500.className} text-xs mobile2:text-sm text-wrap text-white flex items-center`}
                    >
                        Try it <FaArrowRight className="ml-2" size={12} />
                    </p>
                </div>

                {/* Golden Diamond on top-right */}
                <img
                    ref={leftDiamondRef}
                    src="/Golden-diamond.svg"
                    alt="Golden Diamond"
                    className="absolute top-6 right-6"
                />

                {/* Download Icon with floating class */}
                <img
                    ref={leftDownloadIconRef}
                    src="/download-icon.svg"
                    alt="Cloud Download Arrow icon"
                    className="absolute bottom-16 left-1/2 transform -translate-x-1/2 floating size-24 mobile:size-32 sm:size-50"
                />
            </div>

            {/* right section */}
            <div
                ref={rightRef}
                className="rounded-xl overflow-clip bg-[#131313] border border-[#2E2E2E] relative transition-all duration-300"
            >
                <img src="/sec-2-right-bg.png" alt="Section 2 left bg image" className="object-center opacity-50" />

                <div className="space-y-4 absolute left-10 top-10 z-10">
                    <p
                        ref={rightTitleRef}
                        className={`text-3xl mobile:text-4xl xl:text-5xl whitespace-pre-wrap text-left ${youngserif.className} text-white leading-10 sm:leading-16`}
                    >
                        Share Effortlessly
                        <br />
                        to your clients
                    </p>
                    <p
                        ref={rightDescRef}
                        className={`${poppins400.className} text-xs mobile2:text-sm text-wrap text-white/80 w-[90%]`}
                    >
                        Generate and forward as products ordered from your clients.
                    </p>
                    <p
                        ref={rightCTARef}
                        className={`${poppins500.className} text-sm text-wrap text-white flex items-center`}
                    >
                        Try it <FaArrowRight className="ml-2" size={12} />
                    </p>
                </div>

                {/* Bottom Success Section */}
                <div
                    ref={successBoxRef}
                    className="w-fit h-fit sm:w-max sm:h-max bg-[#131313] rounded-lg flex flex-col justify-center items-center absolute bottom-0 left-1/2 transform -translate-x-1/2 overflow-clip"
                >
                    <img src="/success-bg.svg" alt="White shade" className="opacity-55" />

                    <div className="w-[60%] flex flex-col justify-center items-center space-y-3 absolute z-10">
                        <div className="w-8 h-8 bg-white rounded-full flex justify-center items-center">
                            <FiShare2 className="text-black size-3 sm:size-4" />
                        </div>

                        <p className={`${poppins600.className} text-sm sm:text-lg text-white`}>Success!</p>
                        <p className={`${poppins500.className} text-[9px] sm:text-sm text-white/70 text-wrap text-center`}>Thanks for using!, you will be updated with more features.</p>
                    </div>
                </div>

                <img src="/black-shade-sec-2-right.svg" alt="Black Shade" className="absolute bottom-0 w-full" />
            </div>
        </div>
    );
};