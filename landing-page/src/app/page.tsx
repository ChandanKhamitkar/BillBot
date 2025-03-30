"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Hero from "@/components/hero/Hero";
import Section1 from "@/components/section/Section1";
import Section2 from "@/components/section/Section2";
import Section3 from "@/components/section/Section3";
import Footer from "@/components/footer/Footer";
import ReactLenis from "lenis/react";
import { comfortaa } from "@/utils/fonts";

export default function Home() {
  const preloaderRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {

    // hiding the Content intially
    gsap.set(contentRef.current, {
      autoAlpha: 0
    });

    // Callback for clearing loading & enabling content to display
    const handleComplete = () => {
      const t1 = gsap.timeline();
      t1.to(preloaderRef.current, {
        duration: 0.8,
        autoAlpha: 0,
        ease: "power2.inOut"
      }).to(contentRef.current, {
        duration: 0.8,
        autoAlpha: 1,
        ease: "power2.inOut",
      }, "-=0.4");
    };

    // if DOM is ready then execute the callback
    if(document.readyState === "complete"){
      handleComplete();
    }
    // making sure loading is visible untill page content is loaded
    // attaching a callback,
    // which will execute when the load is fired
    else{
      window.addEventListener("load", handleComplete);
    }

    return () => window.removeEventListener("load", handleComplete);
  }, []);

  return (
    <> 
      {/* Pre-loader */}
      <div
        ref={preloaderRef} 
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black backdrop-blur-lg">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="BillBot Image" className="w-14 h-14 animate-bounce" />
          <p className={`mt-4 text-lg font-semibold text-gray-500 ${comfortaa.className}`}>Get Ready</p>
        </div>
      </div>
      {/* Main Content to display */}
      <div ref={contentRef}>
        <ReactLenis root className="w-screen h-screen overflow-y-scroll">
          <Hero />
          <Section1 />
          <Section2 />
          <Section3 />
          <Footer />
        </ReactLenis>
      </div>
    </>
  );
}
