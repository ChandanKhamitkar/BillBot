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

    useEffect(() => {
        if (!textRef.current || !phoneRef.current || !subtextRef.current) alert("there is no main text or phone ref or subtext");

        // Pin the entire hero section during animations
        ScrollTrigger.create({
            trigger: ".heroSection",
            start: "top top",
            end: "+=1500px", // Extended pinning duration
            pin: true,
            pinSpacing: true,
        });

        // Main Hero Text
        gsap.to(textRef.current, {
            opacity: 0,
            filter: "blur(10px)",
            duration: 1, // Increased duration
            ease: "power2.inOut", // Smoother ease
            scrollTrigger: {
                trigger: phoneRef.current,
                start: "top 40%", // Adjusted trigger point
                toggleActions: "play reverse play reverse",
            }
        });

        // Subtext
        gsap.to(subtextRef.current, {
            opacity: 0,
            filter: "blur(10px)",
            duration: 1.5, // Increased duration
            ease: "power2.inOut", // Smoother ease
            scrollTrigger: {
                trigger: phoneRef.current,
                start: "top 60%", // Adjusted trigger point
                toggleActions: "play reverse play reverse",
            }
        });

        // Rotate and move phone to center
        gsap.to(phoneRef.current, {
            rotate: "0",
            x: "-50%",
            y: "-70%",
            left: "50%",
            top: "50%",
            duration: 8, // Slowed down rotation and movement
            ease: "power2.inOut", // Smoother ease
            scrollTrigger: {
                trigger: phoneRef.current,
                start: "top 50%",
                end: "top 30%",
                scrub: 2, // Increased scrub for smoother scrolling
                toggleActions: "play reverse play reverse",
            }
        });

        // left msg box on phone
        gsap.to(leftMsgRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1, // Increased duration
            ease: "back.out(1.7)", // Elastic ease for more natural feel
            scrollTrigger: {
                trigger: phoneRef.current,
                start: "top 25%", // Adjusted trigger point
                end: "top 5%",
                scrub: 1.5,
                toggleActions: "play reverse play reverse",
            }
        });

        // right msg box on phone
        gsap.to(rightMsgRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1, // Increased duration
            ease: "back.out(1.7)", // Elastic ease for more natural feel
            scrollTrigger: {
                trigger: phoneRef.current,
                start: "top 35%", // Adjusted trigger point
                end: "top 15%",
                scrub: 1.5,
                toggleActions: "play reverse play reverse",
            }
        });

        // Create a timeline for the button press and image change animations
        const buttonPressTl = gsap.timeline({
            scrollTrigger: {
                trigger: phoneRef.current,
                start: "top 10%", // Adjusted trigger point
                end: "top -10%",
                scrub: 2, // Increased scrub for smoother transition
                onEnter: () => {
                    // Phone button press and scale effect
                    gsap.to(phoneRef.current, {
                        scale: 0.98,
                        duration: 0.5, // Slightly longer duration
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.inOut"
                    });
                },
                onLeaveBack: () => {
                    // Revert to original image when scrolling back up
                    if (phoneImgRef.current) {
                        phoneImgRef.current.src = "/Phone.png";
                    }
                }
            }
        });

        // Add animations to the timeline with extended durations and smoother easing
        buttonPressTl
            .to(startBtnPressRef.current, {
                opacity: 1,
                scale: 1,
                zIndex: 30,
                duration: 2, // Extended duration
                ease: "back.out(1.5)", // More elastic ease
            })
            // Fade out Phone.png and change to Phone-2.png
            .to(phoneRef.current, {
                opacity: 0,
                duration: 2, // Extended duration
                ease: "power2.inOut",
                onComplete: () => {
                    if (phoneImgRef.current) {
                        phoneImgRef.current.src = "/Phone-2.png";
                    }
                },
                onStart: () => {
                    gsap.to(leftMsgRef.current, {
                        opacity: 0,
                        scale: 0,
                        duration: 1.5,
                        ease: "back.in(1.7)",
                    })
                    gsap.to(rightMsgRef.current, {
                        opacity: 0,
                        scale: 0,
                        duration: 1.5,
                        ease: "back.in(1.7)",
                    })
                }
            })
            // left & right msg box disapper
            // phone-2 image fade in
            .to(phoneRef.current, {
                opacity: 1,
                duration: 2, // Extended duration
                ease: "power2.inOut",
                onStart: () => {
                    gsap.set(leftMsgRef.current, { display: "none" });
                    gsap.set(rightMsgRef.current, { display: "none" });
                },
            })
            // button press outline going back
            .to(startBtnPressRef.current, {
                opacity: 0,
                zIndex: 30,
                duration: 2, // Extended duration
                ease: "power2.out",
            })
            // Fade out Phone-2.png and change to Phone-3.png
            .to(phoneRef.current, {
                opacity: 0,
                duration: 1.5, // Slightly extended duration
                ease: "power2.inOut",
                onComplete: () => {
                    if (phoneImgRef.current) {
                        phoneImgRef.current.src = "/Phone-3.png";
                    }
                }
            })
            // phone-3 image fade in
            .to(phoneRef.current, {
                opacity: 1,
                duration: 1.5, // Slightly extended duration
                ease: "power2.inOut",
            })
            // Move phoneRef to the right
            .to(phoneRef.current, {
                x: "100%",
                duration: 5, // Extended duration for smoother movement
                ease: "power2.inOut",
                onStart: () => {
                    gsap.set(phoneRef.current, { scale: 1 });
                },
            })
            // Fade out Phone-3.png and change to Phone-4.png
            .to(phoneRef.current, {
                opacity: 0,
                duration: 1.5, // Slightly extended duration
                ease: "power2.inOut",
                onComplete: () => {
                    if (phoneImgRef.current) {
                        phoneImgRef.current.src = "/Phone-4.png";
                    }
                }
            })
            // phone-4 image fade in
            .to(phoneRef.current, {
                opacity: 1,
                duration: 1.5, // Slightly extended duration
                ease: "power2.inOut",
            })

        const processingElement = processingRef.current;
        const phoneElement = phoneRef.current;
        
        // Processing Component 
        gsap.timeline({
            scrollTrigger: {
                trigger: phoneElement,
                start: "top -10%",
                onEnter: () => {
                    // Fade in Processing component when phone moves to right
                    gsap.to(processingElement, {
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
                                        opacity: index === 0 ? 1 : 0.5,
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
                                        fontWeight: "normal",
                                        duration: 0.8,
                                        ease: "power2.inOut",
                                    });

                                    currentIndex = (currentIndex + 1) % totalTexts;

                                    // Bring the next text to the center with improved centering
                                    gsap.to(textRefs.current[currentIndex], {
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                        fontWeight: "bold",
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
                                                fontWeight: "normal",
                                                duration: 0.8,
                                                ease: "power2.inOut",
                                            });
                                        }
                                    });
                                };

                                setTimeout(animateTexts, 2000);
                            }
                        }
                    });
                },
                onLeaveBack: () => {
                    gsap.to(processingElement, {
                        opacity: 0,
                        x: "-100%",
                        duration: 1,
                        ease: "power2.in"
                    });
                }
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <div ref={heroSectionRef} className="heroSection w-full h-screen bg-black/10 backdrop-blur-xs relative mb-72">
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
                        className="absolute top-0 transform -translate-y-[80%] right-0 w-28 h-28 z-20"
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
                <Processing textRefs={textRefs} processingRef={processingRef} />
            </div>


            {/* 3d Gemini + Google icons */}
            <img src="/gemini.png" alt="Gemini logo" className="absolute bottom-0 left-10 w-40" />
            <img src="/google.png" alt="Google logo" className="absolute -bottom-12 right-10 w-40" />
        </div>
    );
}