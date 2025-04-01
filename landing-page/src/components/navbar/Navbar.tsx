import { comfortaa, inter, poppins400 } from "@/utils/fonts";
import { HiMiniArrowTopRightOnSquare } from "react-icons/hi2";

interface NavbarProps {
    logo?: boolean;
    name?: boolean;
    version?: boolean;
    trynow?: boolean;
}
export default function Navbar({
    logo = true,
    name = true,
    version = true,
    trynow = true,
}: NavbarProps) {
    return (
        <nav className="fixed top-0 z-[100] w-full h-fit flex justify-between pt-6 px-8 sm:px-12">
            <div className="w-fit flex items-center justify-start space-x-3 text-white">
                {
                    logo && <img src="/logo.png" alt="BillBot logo" className="w-8 h-8 " />
                }
                {
                    name && <p className={`${comfortaa.className} text-lg sm:text-2xl font-semibold`}>BillBot</p>
                }
                {
                    version && <p className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-2xl border border-white text-[9px] sm:text-sm ${poppins400.className}`}>v1.0</p>
                }

            </div>
            {
                trynow && <a href="https://web.telegram.org/k/#@TreekeyBot" target="_blank" className="w-fit px-3 py-2 rounded-lg bg-white flex justify-center items-center space-x-2 text-black cursor-pointer">
                    <p className={`${inter.className} text-xs sm:text-xs font-semibold`}>Try now?</p>
                    <HiMiniArrowTopRightOnSquare className="size-4 sm:size-5" />
                </a>
            }

        </nav>
    );
};
