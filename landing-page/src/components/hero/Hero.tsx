"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "../navbar/Navbar";
import { youngserif, ibmplexmono600 } from "@/utils/fonts";
import { LuSend } from "react-icons/lu";
import Processing from "./Processing";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
    const phoneRef = useRef(null);
    const phoneImgRef = useRef<HTMLImageElement | null>(null);
    const textRef = useRef(null);
    const subtextRef = useRef(null);
    const bgRef = useRef(null);
    const heroSectionRef = useRef(null);
    const leftMsgRef = useRef(null);
    const rightMsgRef = useRef(null);
    const startBtnPressRef = useRef(null);
    const processingRef = useRef<HTMLDivElement>(null);
    const textRefs = useRef<HTMLParagraphElement[]>([]);
    const processDoneBottomLineRef = useRef<HTMLDivElement>(null);
    const processDoneCheckRef = useRef<HTMLDivElement>(null);

    // GSAP Animation
    useEffect(() => {

        if (!textRef.current || !phoneRef.current || !subtextRef.current) {
            alert("there is no main text or phone ref or subtext");
            return;
        }

        // Master Timeline for Smooth Scroll-Triggered Animations
        const masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: heroSectionRef.current,
                start: "top top",
                end: "+=400%",
                scrub: 1.5,
                pin: true,
                pinSpacing: true,
            }
        });

        // Initial Setup - Soft Entrance
        gsap.fromTo([textRef.current, subtextRef.current, phoneImgRef.current, ...document.querySelectorAll(".bottomLogos")],
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
                duration: 2,
                ease: "power3.out"
            }
        );

        // Stage 1: Text and Subtext Transitions.
        masterTimeline
            .to([textRef.current, subtextRef.current], {
                opacity: 0,
                filter: "blur(10px)",
                duration: 2,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: phoneRef.current,
                    start: "top 40%",
                    // toggleActions: "play reverse play reverse",
                }
            });

        // Stage 2: Phone Rotation and Movement
        masterTimeline
            .to(phoneRef.current, {
                rotation: 0,
                x: "calc(50vw - 50%)",
                y: "30%",
                duration: 3,
                ease: "power3.inOut"
            })
            .to(leftMsgRef.current, {
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: "back.out(1.7)"
            }, "-=2")
            .to(rightMsgRef.current, {
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: "back.out(1.7)"
            }, "-=1.8")
            .to(startBtnPressRef.current, {
                opacity: 1,
                scale: 1,
                zIndex: 30,
                duration: 2,
                ease: "back.out(1.5)"
            }, "-=1.5");

        // Stage 3: Phone Image Transitions
        const phoneImages = [
            "/Phone-2.png",
            "/Phone-3.png",
            "/Phone-4.png"
        ];

        phoneImages.forEach((imageSrc) => {
            masterTimeline
                .to(startBtnPressRef.current, {
                    opacity: 0,
                    scale: 0,
                    duration: 1.5,
                    ease: "power2.inOut"
                }, "-=1")
                .to(phoneRef.current, {
                    onStart: () => {
                        // Fade out messages for intermediate stages
                        gsap.to([leftMsgRef.current, rightMsgRef.current], {
                            opacity: 0,
                            scale: 0.8,
                            duration: 1,
                            ease: "back.in(1.7)"
                        });
                        if (phoneImgRef.current) {
                            phoneImgRef.current.src = imageSrc;
                        }
                    },
                    duration: 2,
                    ease: "power2.inOut"
                });
        });

        // Phone Exit and Processing Component
        masterTimeline
            .to(phoneRef.current, {
                x: "100%",
                scale: 1,
                duration: 3,
                ease: "power2.inOut"
            })
            .to(processingRef.current, {
                opacity: 1,
                x: "20%",
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    // Sequential text animation for Processing Component
                    if (textRefs.current.length > 0) {
                        // Initial state for all texts
                        textRefs.current.forEach((text, index) => {
                            gsap.set(text, {
                                opacity: index === 0 ? 1 : 0,
                                scale: index === 0 ? 1 : 0.8,
                                y: index === 0 ? 0 : 100,
                                fontWeight: index === 0 ? "bold" : "normal",
                                transformOrigin: "center center" // Ensure scaling happens from center
                            });
                        });

                        let currentIndex = 0;
                        const totalTexts = textRefs.current.length;

                        const animateTexts = () => {
                            // Move the current text up and reduce its opacity and scale
                            gsap.to(textRefs.current[currentIndex], {
                                opacity: 0.5,
                                scale: 0.8,
                                y: -50,
                                duration: 0.8,
                                ease: "power2.inOut",
                            });

                            currentIndex = (currentIndex + 1) % totalTexts;

                            // Bring the next text to the center with improved centering
                            gsap.to(textRefs.current[currentIndex], {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "power2.inOut",
                                onComplete: () => {
                                    if (currentIndex < totalTexts - 1) {
                                        setTimeout(animateTexts, 2000);
                                    }
                                },
                            });

                            // Reposition other texts more precisely
                            textRefs.current.forEach((text, index) => {
                                if (index !== currentIndex) {
                                    const offset = index < currentIndex
                                        ? -(Math.abs(index - currentIndex) * 50)
                                        : (index - currentIndex) * 50;

                                    gsap.to(text, {
                                        y: offset,
                                        opacity: 0.5,
                                        scale: 0.8,
                                        duration: 0.8,
                                        ease: "power2.inOut",
                                    });
                                }
                            });
                        };
                        setTimeout(animateTexts, 2000);
                    }
                },
                onLeaveBack: () => {
                    gsap.to(processingRef.current, {
                        opacity: 0,
                        x: "-100%",
                        duration: 1,
                        ease: "power2.in"
                    });
                }
            });

        // Final Phone image (invoice received)
        masterTimeline
            .to(phoneRef.current, {
                onStart: () => {
                    if (phoneImgRef.current) {
                        phoneImgRef.current.src = "/Phone-5.png";
                    }
                    masterTimeline.to([processDoneBottomLineRef.current, processDoneCheckRef.current], {
                        opacity: 1,
                        duration: 1,
                        ease: "power2.in"
                    })
                },
                ease: "power2.inOut"
            })


        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div ref={heroSectionRef} className="heroSection w-full h-screen bg-black/10 backdrop-blur-xs relative mb-72 overflow-clip">
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
                className={`w-max h-screen mx-auto flex flex-col justify-center items-center space-y-2 mobile:space-y-6 text-white relative z-10 shadow-xl  ${youngserif.className}`}
            >   
                {/* Titles */}
                <div className="w-max mx-6 mobile:mx-0 flex flex-col justify-center items-center space-y-2 mobile:space-y-6 transfrom -translate-y-3/4 mobile:-translate-y-0">
                    {/* Main Title */}
                    <div
                        ref={textRef}
                        className="relative mainText">
                        <p className="text-3xl mobile2:text-4xl mobile:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">Invoicing, Simplified</p>

                        {/* Single Star positioned at the top-right of the main text */}
                        <img
                            src="/thin-star.svg"
                            alt="Single star"
                            className="absolute top-0 transform -translate-y-[80%] right-0 w-20 h-20 mobile:w-24 mobile:h-24 md:w-28 md:h-28 z-20"
                        />
                    </div>

                    {/* Sub-text */}
                    <div
                        ref={subtextRef}
                        className="w-full flex flex-col md:flex-row justify-start md:justify-between items-start gap-2 md:gap-0 md:items-center text-white/90">
                        <p className="text-lg mobile:text-2xl">
                            <span className="flex justify-start items-center">
                                from your {<LuSend className="ml-2" />}
                            </span>
                            <span>telegram chat</span>
                        </p>

                        <p className={`${ibmplexmono600.className} text-sm mobile:text-base flex flex-col justify-start tracking-widest sm:tracking-normal`}>
                            <span>a tool for Fast. Clean.</span>
                            <span>Invoice Img generation</span>
                        </p>
                    </div>
                </div>

                {/* Mobile Phone Mockup */}
                <div className="w-full flex justify-center mt-16 relative">
                    <div
                        ref={phoneRef}
                        className="w-fit h-fit absolute bottom-0 transform translate-y-[80%] rotate-12">
                        <img
                            ref={phoneImgRef}
                            src="/Phone.png"
                            alt="Mobile phone mockup"
                            className="w-[280px] relative z-10"
                        />
                        <div ref={startBtnPressRef} className="absolute bottom-8 transform left-1/2 -translate-x-1/2 rounded-xl border-4 border-[#5404FF]/80 w-[220px] h-[50px] z-0 scale-0 opacity-0"></div>
                        <img ref={leftMsgRef} src="/msg-left-blue.svg" alt="Left message box" className="absolute bottom-[6%] transform -translate-y-[50%] left-0 -translate-x-1/3 size-32 z-20 opacity-0 scale-0" />
                        <img ref={rightMsgRef} src="/msg-right-blue.svg" alt="Right message box" className="absolute bottom-[16%] transform -translate-y-[50%] right-0 translate-x-1/3 size-28 z-20 opacity-0 scale-0" />
                    </div>
                </div>
            </div>

            {/* Processing Component */}
            <div
                ref={processingRef}
                className="absolute top-[14%] left-[20%] transform z-40 opacity-0"
            >
                <Processing
                    textRefs={textRefs}
                    processingRef={processingRef}
                    processDoneBottomLineRef={processDoneBottomLineRef}
                    processDoneCheckRef={processDoneCheckRef}
                />
            </div>


            {/* 3d Gemini + Google icons */}
            <img src="/gemini.png" alt="Gemini logo" className="bottomLogos absolute bottom-0 left-10  w-24 mobile2:w-28 sm:w-40" />
            <img src="/google.png" alt="Google logo" className="bottomLogos absolute -bottom-12 right-10  w-24 mobile2:w-28 sm:w-40" />
        </div>
    );
}