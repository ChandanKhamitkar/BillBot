"use client";
import { motion } from "framer-motion";

const users = [
    { id: 1, img: "/chandan-avatar.png", orbit: 1, angle: 0 },
    { id: 2, img: "/manas-avatar.png", orbit: 1, angle: 80 },
    { id: 3, img: "/avatar1.png", orbit: 2, angle: 120 },
    { id: 4, img: "/avatar2.png", orbit: 2, angle: 180 },
    { id: 5, img: "/avatar3.png", orbit: 3, angle: 240 },
    { id: 6, img: "/avatar4.png", orbit: 3, angle: 300 },
    { id: 7, img: "/avatar5.png", orbit: 3, angle: 30 },
];

// Orbit sizes
const orbitSizes = [120, 200, 280]; // Small, Medium, Large

export default function GitHubSolarSystem() {
    return (
        <div className="relative w-full h-full flex justify-center items-center">

            {/* GitHub Center Logo */}
            <img src="/github-logo.png" alt="GitHub Logo" className="absolute w-20 h-20 rounded-full" />

            {/* Blue Fade Stroke (from GitHub icon to bottom) */}
            <BlueFadeStroke/>

            {/* 3 Orbits */}
            {orbitSizes.map((size, index) => (
                <div
                    key={index}
                    className="absolute border-2 border-white/30 rounded-full"
                    style={{
                        width: `${size * 2}px`,
                        height: `${size * 2}px`,
                    }}
                />
            ))}

            {/* Animated Avatars on Correct Circles */}
            {users.map((user) => {
                const radius = orbitSizes[user.orbit - 1]; // Get correct orbit size
                return (
                    <motion.div
                        key={user.id}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10 + 1 * 2, repeat: Infinity, ease: "linear" }} // Different speeds for different orbits
                        className="absolute"
                        style={{
                            width: `${radius * 2}px`,
                            height: `${radius * 2}px`,
                        }}
                    >
                        <div
                            className="absolute w-12 h-12 rounded-full shadow-lg"
                            style={{
                                top: `calc(50% - ${0}px)`,
                                left: "50%",
                                transform: `translate(-50%, -50%) rotate(${user.angle}deg) translate(${radius}px) rotate(-${user.angle}deg)`,
                            }}
                        >
                            <motion.img
                                src={user.img}
                                alt={`User ${user.id}`}
                                className="w-full h-full rounded-full"
                                animate={{ rotate: -360 }} // Counter-rotates in the opposite direction
                                transition={{ duration: 10 + 1 * 2, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
const BlueFadeStroke = () => {
    return (
        <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 w-[36px] h-[50vh] flex justify-center items-center">
            {/* Background Blur & Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#5F8693FF] via-[#77A7B7BB] to-[#A1E3F900] blur-[30px] opacity-40"></div>

            {/* Inner Sharp Stroke */}
            <div className="relative w-0.5 h-full bg-gradient-to-t from-[#A1E3F9FF] to-[#A1E3F900]"></div>
        </div>
    );
};
