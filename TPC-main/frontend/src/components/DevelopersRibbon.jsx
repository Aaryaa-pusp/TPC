import React from 'react';

const TEAM_MEMBERS = [
    {
        name: "Ravi Kumar",
        rollNumber: "2401AI51",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
        name: "Parth Kataria",
        rollNumber: "2401CS88",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    },
    {
        name: "Aaryaa",
        rollNumber: "2401CS85",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    },
    {
        name: "Anjney Lawaniya",
        rollNumber: "2401CS87",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
    },
    {
        name: "Devansh Kumar Sharma",
        rollNumber: "2401CS93",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    },
    {
        name: "Shikhar Yadav",
        rollNumber: "2402CS11",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"
    },
];

export default function DevelopersRibbon() {
    return (
        <section className="relative bg-white pb-24 pt-12 border-t border-gray-100 overflow-hidden dark:bg-slate-950 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-12 dark:text-slate-100">Developed By</h3>

                {/* Wave Ribbon */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {TEAM_MEMBERS.map((member, idx) => (
                        <div
                            key={member.name}
                            className="ribbon-wave-member flex flex-col items-center group"
                            style={{
                                '--wave-delay': `${idx * 0.22}s`,
                                '--wave-duration': `${4.9 + (idx % 4) * 0.42}s`
                            }}
                        >
                            <div className="ribbon-avatar-frame relative w-20 h-20 md:w-24 md:h-24 rounded-full p-[2px] bg-white shadow-sm group-hover:shadow-[0_0_26px_-10px_rgba(14,165,233,0.85)] transition-shadow duration-500 dark:bg-slate-900">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full rounded-full object-cover border border-white dark:border-slate-900"
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <h4 className="text-gray-900 font-bold text-sm dark:text-slate-100">{member.name}</h4>
                                <p className="text-gray-500 text-xs font-medium dark:text-slate-400">{member.rollNumber}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
