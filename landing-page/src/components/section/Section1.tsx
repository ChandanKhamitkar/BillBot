import { youngserif, poppins400 } from "@/utils/fonts";
export default function Section1() {
    return (
        <div className="bg-black w-full h-full grid grid-cols-2 grid-rows-1 gap-10 mx-auto px-12 py-8">

            {/* Left Section */}
            <div className="rounded-xl overflow-clip border border-[#2E2E2E] relative">
                <img src="/sec-1-left-bg.png" alt="Section 1 left bg wavery image" className="object-center" />

                <div className="space-y-4 absolute left-10 bottom-10 z-10">
                    <p className={`text-5xl whitespace-pre-wrap text-left ${youngserif.className} text-white`}>
                        Create unlimited
                        <br />
                        invoices instantly
                    </p>
                    <p className={`${poppins400.className} text-sm text-wrap text-white/80 w-[70%]`}>
                        Just send customer details, and BillBot AI 🤖will generate a beautiful invoice. image—fast and hassle-free.
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="rounded-xl overflow-clip border border-white/60 flex justify-center items-center relative shadow-[inset_0_0_30px_0_rgba(255,255,255,0.2)] ">
                <img src="/sec-1-right-bg.png" alt="Section 1 right bg light image" className="object-center opacity-80 blur-lg" />
                <img src="/react.png" alt="react" className="z-10 w-[217px] absolute mix-blend-luminosity" />
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
