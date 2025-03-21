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
        <nav className="fixed top-0 z-[100] w-full h-fit flex justify-between pt-6 px-12">
            <div className="w-fit flex items-center justify-start space-x-3 text-white">
                {
                    logo && <img src="/logo.png" alt="BillBot logo" className="w-8 h-8 " />
                }
                {
                    name && <p className={`${comfortaa.className} text-2xl font-semibold`}>BillBot</p>
                }
                {
                    version && <p className={`px-3 py-1 rounded-2xl border border-white text-sm ${poppins400.className}`}>v1.0</p>
                }

            </div>
            {
                trynow && <div className="w-fit px-3 py-2 rounded-lg bg-white flex justify-center items-center space-x-2 text-black">
                    <p className={`${inter.className} text-xs font-semibold`}>Try now?</p>
                    <HiMiniArrowTopRightOnSquare size={18} />
                </div>
            }

        </nav>
    );
};
