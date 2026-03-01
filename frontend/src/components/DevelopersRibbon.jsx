import React from 'react';

const TEAM_MEMBERS = [
    {
        name: "Ravi Kumar", role: "Full Stack Engineer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
        name: "Parth", role: "Frontend Architect",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
        name: "Aarya", role: "Backend Specialist",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    },
    {
        name: "Shikhar", role: "Chief Vibe Officer",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
    },
    {
        name: "Deva", role: "DevOps Engineer",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    }
];

export default function DevelopersRibbon() {
    return (
        <section className="bg-white py-24 border-t border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Developed By</h3>
                <p className="text-sm text-gray-500 font-light mb-12 max-w-lg mx-auto">
                    The brilliant engineering minds working tirelessly behind the scenes to power the official IIT Patna recruitment infrastructure.
                </p>

                {/* Organic Staggered Layout Ribbon */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {TEAM_MEMBERS.map((member, idx) => (
                        <div
                            key={member.name}
                            className={`flex flex-col items-center group transition-transform hover:-translate-y-2 duration-300 ${idx % 2 !== 0 ? 'md:translate-y-6' : ''}`}
                        >
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-gray-200 to-gray-400 group-hover:from-blue-400 group-hover:to-cyan-300 transition-all duration-500 shadow-sm">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full rounded-full object-cover border-2 border-white"
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <h4 className="text-gray-900 font-bold text-sm">{member.name}</h4>
                                <p className="text-gray-500 text-xs font-medium">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
