import { poppins700, poppins400 } from "@/utils/fonts";
import GitHubSolarSystem from "./GitHubSolarSystem";
import Navbar from "../navbar/Navbar";

export default function Section3() {
    return (
        <div className="w-full h-screen bg-black backdrop-blur-xs relative overflow-clip flex justify-around items-center">
            
            {/* Navbar */}
            <Navbar name={false} version={false} trynow={false}/>

            <img src="/DotGrid.svg" alt="Dot Pattern Grid" className="absolute w-screen" />
            <img src="/sec-3-shades.svg" alt="Black top bottom shades" className="absolute w-screen" />
            <img src="/sec-3-white-ball.png" alt="white shade ball" className="absolute w-screen blur-3xl" />

            {/* Left section */}
            <div className="flex justify-start flex-col space-y-4 absolute left-18 top-1/2 transform -translate-y-1/2">
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
            <div className="w-[50%] flex justify-center transform translate-x-1/2">
                <GitHubSolarSystem />
            </div>

            <img src="/FigmaCursor.svg" alt="Figma Cursor" className="absolute bottom-[20%] transform -translate-y-1/2 left-[20%]  w-8 " />
        </div>
    );
};
