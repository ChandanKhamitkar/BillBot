import Hero from "@/components/hero/Hero";
import Section1 from "@/components/section/Section1";
import Section2 from "@/components/section/Section2";
import Section3 from "@/components/section/Section3";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-y-scroll">
      <Hero/>
      <div className="h-[70%]"></div>
      <Section1/>
      <div className="h-10"></div>
      <Section2/>
      <div className="h-10"></div>
      <Section3/>
      <div className="h-10"></div>
      <Footer/>
    </div>
  );
}
