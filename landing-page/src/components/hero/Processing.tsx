import { RefObject} from "react";
import { poppins500 } from "@/utils/fonts";
interface ProcessingProps {
    textRefs: RefObject<(HTMLParagraphElement | null)[]>;
    processingRef: RefObject<HTMLDivElement | null>;
}

export default function Processing({ textRefs, processingRef }: ProcessingProps) {

    return (
        <div className="w-fit h-fit mx-auto">
            <div className="w-fit h-fit relative">
                {/* Gemini image */}
                <img src="/gemini-2.png" alt="Gemini Img" className="w-24 h-24 mx-auto" />

                {/* Top vertical line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full z-10">
                    <div className="w-px h-24 bg-[#696969] relative">

                        {/* Processing Text */}
                        <div
                            ref={processingRef}
                            className={`absolute w-[170px] h-[170px] flex flex-col gap-6 justify-center items-center text-center bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full rounded-full overflow-clip ${poppins500.className}`}
                        >
                            {["Extracting Invoice details from message...", "Verifying valid message format", "Generating invoice", "Done"].map(
                                (text, index) => (
                                    <p
                                        key={index}
                                        ref={(el) => {
                                            if (textRefs.current) {
                                                textRefs.current[index] = el;
                                            }
                                        }}
                                        className="absolute w-[80%] text-wrap text-neutral-400 text-[8px] tracking-wider text-center"
                                    >
                                        {text}
                                    </p>
                                )
                            )}
                        </div>


                        {/* Level Circle Wrapper */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[233px] w-[300px] h-[300px] z-20">
                            {/* Level 3 Circle - Largest */}
                            <div className="absolute w-[300px] h-[300px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-rotate-clockwise">
                                <img
                                    src="/l3-circle.png"
                                    alt="Level 3 Processing circle"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Level 2 Circle - Medium */}
                            <div className="absolute w-[230px] h-[230px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-rotate-counterclockwise">
                                <img
                                    src="/l2-circle.png"
                                    alt="Level 2 Processing circle"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Level 1 Circle - Smallest */}
                            <div className="absolute w-[170px] h-[170px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-rotate-clockwise">
                                <img
                                    src="/l1-circle.png"
                                    alt="Level 1 Processing circle"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Bottom Line */}
                        <div className="w-px h-32 bg-[#696969] absolute bottom-1/2 transform translate-y-[267%]"></div>

                        {/* Check GIF */}
                        <img src="/check-animated.gif" alt="Check Animated Green GIF" className="min-w-[100px] absolute -bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-[285%]" />
                    </div>
                </div>
            </div>
        </div >
    );
};