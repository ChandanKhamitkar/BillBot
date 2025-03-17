import Navbar from "../navbar/Navbar";
import { youngserif, poppins500, poppins400 } from "@/utils/fonts";
import { LuSend } from "react-icons/lu";
import { IoStar } from "react-icons/io5";

const listData = [
    "Yours to keep forever",
    "Future updates included",
    "No subscription"
];

export default function Footer() {
    return (
        <div className="w-screen h-screen bg-black backdrop-blur-xs relative overflow-clip flex flex-col">
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
                <div>
                    <p className={`${youngserif.className} text-9xl`}>Ready to try?</p>
                    <p className="text-2xl flex items-center">
                        Use BillBot AI on <LuSend className="mx-2" /> Telegram
                    </p>
                </div>

                {/* Middle Content */}
                <div className="flex justify-between items-center mt-10">
                    <p className={`${youngserif.className} text-2xl`}>
                        Try it for<br />Free
                    </p>

                    <div className="flex flex-col space-y-2">
                        {listData.map((item, index) => (
                            <div key={index} className="flex space-x-2 items-center">
                                <div className="w-10 h-10 bg-[#5404FF] rounded-full flex justify-center items-center">
                                    <IoStar size={20} />
                                </div>
                                <p className={`${poppins500.className} text-base`}>{item}</p>
                            </div>
                        ))}
                    </div>

                    <div className="w-[30%]">
                        <p className={`${youngserif.className} text-2xl`}>Why us?</p>
                        <p className={`${poppins400.className} text-wrap`}>
                            Simply chat your invoice details, and we&apos;ll transform them into a sleek, professional invoice image!
                        </p>
                    </div>
                </div>

                {/* Separator Line */}
                <div className="w-full h-px border border-[#5B5B5B] border-dashed"></div>

                {/* Footer Text */}
                <p className={`${poppins400.className} text-[#C5C5C5] text-sm`}>
                    You can use it from any region.
                </p>
            </div>
        </div>
    );
}
