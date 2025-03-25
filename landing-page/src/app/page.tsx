import Hero from "@/components/hero/Hero";
import Section1 from "@/components/section/Section1";
import Section2 from "@/components/section/Section2";
import Section3 from "@/components/section/Section3";
import Footer from "@/components/footer/Footer";
import ReactLenis from "lenis/react";

export default function Home() {

  return (
    <>
      <ReactLenis root className="w-screen h-screen overflow-y-scroll">
        <Hero />

        {/* <div className="h-[70%]"></div> */}
        <Section1 />
        <Section2 />
        <Section3 />
        <Footer />
      </ReactLenis>
    </>
  );
}
