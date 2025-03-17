import { youngserif, poppins400, poppins500, poppins600 } from "@/utils/fonts";
import { FaArrowRight } from "react-icons/fa6"
import { FiShare2 } from "react-icons/fi";

export default function Section2() {
    return (
        <div className="bg-black w-full h-full grid grid-cols-2 grid-rows-1 gap-10 mx-auto px-12 py-8">

            {/* left section */}
            <div className="rounded-xl overflow-clip bg-[#131313] backdrop-blur-xs border border-[#2E2E2E] relative">
                <img src="/sec-2-left-bg.png" alt="Section 2 left bg image" className="object-center blur-sm" />


                <div className="space-y-4 absolute left-10 top-10 z-10">
                    <p className={`text-5xl whitespace-pre-wrap text-left ${youngserif.className} text-white leading-16`}>
                        Download in
                        <br />
                        high-quality
                    </p>
                    <p className={`${poppins400.className} text-sm text-wrap text-white/80 w-[90%]`}>
                        As JPG/JPEG format - perfect for sharing anytime, anywhere!
                    </p>
                    <p className={`${poppins500.className} text-sm text-wrap text-white flex items-center`}>
                        Try it <FaArrowRight className="ml-2" size={12} />
                    </p>
                </div>

                {/* Golden Diamond on top-right */}
                <img src="/Golden-Diamond.svg" alt="Golden Diamond" className="absolute top-6 right-6" />

                {/* Download Icon */}
                <img src="/download-icon.svg" alt="Cloud Download Arrow icon" className="absolute bottom-16 left-1/2 transform -translate-x-1/2 floating" />
            </div>


            {/* right section */}
            <div className="rounded-xl overflow-clip bg-[#131313] border border-[#2E2E2E] relative">
                <img src="/sec-2-right-bg.png" alt="Section 2 left bg image" className="object-center opacity-50" />


                <div className="space-y-4 absolute left-10 top-10 z-10">
                    <p className={`text-5xl whitespace-pre-wrap text-left ${youngserif.className} text-white leading-16`}>
                        Share Effortlessly
                        <br />
                        to your clients
                    </p>
                    <p className={`${poppins400.className} text-sm text-wrap text-white/80 w-[90%]`}>
                        Generate and forward as products ordered from your clients.
                    </p>
                    <p className={`${poppins500.className} text-sm text-wrap text-white flex items-center`}>
                        Try it <FaArrowRight className="ml-2" size={12} />
                    </p>
                </div>


                {/* Buttom Success Section */}
                <div className="w-max h-max bg-[#131313] rounded-lg flex flex-col justify-center items-center absolute bottom-0 left-1/2 transform -translate-x-1/2 overflow-clip">
                    <img src="/success-bg.svg" alt="White shade" className="opacity-55" />

                    <div className="w-[60%] flex flex-col justify-center items-center space-y-3 absolute z-10">
                        <div className="w-8 h-8 bg-white rounded-full flex justify-center items-center">
                            <FiShare2 size={16} className="text-black"/>
                        </div>
                        
                        <p className={`${poppins600.className} text-lg text-white`}>Success!</p>
                        <p className={`${poppins500.className} text-sm text-white/70 text-wrap text-center`}>Thanks for using!, you will be updated with more features.</p>

                    </div>
                </div>

                <img src="/black-shade-sec-2-right.svg" alt="Black Shade" className="absolute bottom-0 w-full" />
            </div>
        </div>
    );
};
