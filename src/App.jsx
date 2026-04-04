import React, { useState, useMemo } from 'react';
import { Info, Map, Rocket, UserSquare2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// --- DATA ---

const rocketStages = {
  las: { 
    title: 'Launch Abort System', 
    desc: 'Positioned on the very top of the SLS, the LAS is designed to safely pull the Orion crew module away from the rocket in the event of an emergency during launch or ascent.', 
    stats: { Height: '44 ft', Motor: 'Solid Propellant' } 
  },
  orion: { 
    title: 'Orion Spacecraft', 
    desc: 'The exploration vehicle that will carry the four-person crew to space, provide emergency abort capability, sustain the crew during space travel, and ensure safe re-entry.', 
    stats: { Volume: '316 cubic ft', Passengers: '4 Astronauts' } 
  },
  icps: { 
    title: 'Interim Cryogenic Propulsion Stage', 
    desc: 'The upper stage powered by one RL10 engine. It will perform the critical Trans-Lunar Injection (TLI) burn, accelerating Orion out of Earth orbit towards the Moon.', 
    stats: { Thrust: '24,750 lbs', Fuel: 'Liquid H2 / O2' } 
  },
  core: { 
    title: 'SLS Core Stage', 
    desc: 'The backbone of the rocket, standing 212 feet tall. It houses 730,000 gallons of super-cooled liquid hydrogen and liquid oxygen to feed the four RS-25 engines at its base.', 
    stats: { Height: '212 ft', Weight: '2.1M lbs' } 
  },
  engines: {
    title: 'RS-25 Engines',
    desc: 'Four RS-25 engines power the core stage. Originally developed for the Space Shuttle program, these highly efficient engines use cryogenic liquid hydrogen and oxygen to produce over 2 million pounds of combined thrust.',
    stats: { Thrust: '2M lbs total', Fuel: 'Cryogenic' }
  },
  srb: { 
    title: 'Solid Rocket Boosters', 
    desc: 'Two twin five-segment solid rocket boosters provide more than 75% of the total thrust at liftoff. They burn for just over two minutes before separating from the core stage.', 
    stats: { Thrust: '3.6M lbs each', BurnTime: '126 seconds' } 
  }
};

const timelineSteps = [
  { title: "Liftoff & Ascent", time: "Day 1", desc: "The Space Launch System lifts off from Pad 39B at Kennedy Space Center, utilizing the SRBs and core stage." },
  { title: "Main Engine Cutoff", time: "Day 1", desc: "The core stage main engines shut down and separate, placing Orion and the ICPS into an initial Low Earth Orbit (LEO)." },
  { title: "Perigee Raise", time: "Day 1", desc: "A short burn from the ICPS second stage stabilizes the astronauts' orbit and prepares for altitude increases." },
  { title: "Apogee Raise Burn", time: "Day 1", desc: "A second burn raises the astronauts into a High Earth Orbit (HEO) to test the spacecraft's systems." },
  { title: "HEO Checkout", time: "Day 1", desc: "During a 23.5-hour highly elliptical orbit, the crew tests manual control, life support, and habitation equipment." },
  { title: "Trans-Lunar Injection", time: "Day 2", desc: "The massive final burn of the ICPS accelerates Orion out of Earth's gravity and starts its free-return trajectory to the Moon." },
  { title: "Outbound Transit", time: "Days 2-4", desc: "Orion separates from the ICPS and coasts through deep space for a four-day journey toward the Moon." },
  { title: "Lunar Flyby", time: "Day 5", desc: "Orion slingshots around the far side of the Moon, passing within 4,600 miles of the surface, farther than humans have gone before." },
  { title: "Trans-Earth Return", time: "Days 6-9", desc: "Using the Moon's gravity assist, Orion coasts on a four-day return journey back toward Earth." },
  { title: "Module Separation", time: "Day 10", desc: "The astronauts' return module separates from the European Service Module, preparing for atmospheric entry." },
  { title: "Earth Re-entry", time: "Day 10", desc: "The capsule re-enters Earth's atmosphere at a record speed of nearly 25,000 mph, enduring temperatures up to 5,000°F." },
  { title: "Splashdown", time: "Day 10", desc: "Astronauts land safely in the Pacific Ocean under parachutes, concluding the historic Artemis II mission." }
];

const crewData = [
  {
    name: 'Reid Wiseman',
    role: 'Commander',
    agency: 'NASA',
    bio: 'Wiseman served as flight engineer aboard the ISS for Expedition 41 in 2014, logging 165 days in space. Before his assignment, he served as chief of the Astronaut Office. He is a designated Naval Aviator and former test pilot.',
    initials: 'RW',
    link: 'https://www.nasa.gov/astronauts/biographies/g-reid-wiseman',
    color: 'text-blue-700 bg-blue-50 border-blue-200'
  },
  {
    name: 'Victor Glover',
    role: 'Pilot',
    agency: 'NASA',
    bio: 'Glover flew as pilot on NASA\'s SpaceX Crew-1 mission in 2020, logging 168 days in space. He participated in four spacewalks and is a former U.S. Navy test pilot with extensive combat experience.',
    initials: 'VG',
    link: 'https://www.nasa.gov/astronauts/biographies/victor-j-glover',
    color: 'text-red-700 bg-red-50 border-red-200'
  },
  {
    name: 'Christina Koch',
    role: 'Mission Specialist',
    agency: 'NASA',
    bio: 'Koch holds the record for the longest single spaceflight by a woman (328 days) and participated in the first all-female spacewalk. She has served as a flight engineer on the ISS for three expeditions.',
    initials: 'CK',
    link: 'https://www.nasa.gov/astronauts/biographies/christina-hammock-koch',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  {
    name: 'Jeremy Hansen',
    role: 'Mission Specialist',
    agency: 'CSA',
    bio: 'Representing the Canadian Space Agency, Hansen is making his first flight to space. He is a former Royal Canadian Air Force fighter pilot and has served in numerous leadership roles within the astronaut corps.',
    initials: 'JH',
    link: 'https://www.asc-csa.gc.ca/eng/astronauts/canadian/active/bio-jeremy-hansen.asp',
    color: 'text-amber-700 bg-amber-50 border-amber-200'
  }
];

// --- MAIN ARTICLE LAYOUT ---

export default function App() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black font-serif selection:bg-gray-300">
      {/* CSS Injection for hide-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #262626; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #525252; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #737373; }
        .drop-cap::first-letter { font-size: 3.5rem; float: left; margin-right: 0.5rem; line-height: 0.8; font-weight: 900; }
      `}} />

      {/* Newspaper Header */}
      <header className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="border-b-4 border-double border-black pb-4 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            The Story Teller
          </h1>
          <div className="flex justify-between items-center text-xs md:text-sm font-sans uppercase tracking-widest border-t border-black pt-2 font-bold text-gray-700">
            <span>Special Interactive Edition</span>
            <span>{currentDate}</span>
            <span>Science & Technology</span>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <main className="max-w-4xl mx-auto px-4 pb-20">
        
        {/* Headline Section */}
        <div className="mb-12 text-center mt-8">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-none mb-6">
            RETURN TO THE LUNAR REALM
          </h2>
          <p className="text-xl md:text-2xl italic text-gray-600 max-w-3xl mx-auto">
            Fifty years after Apollo, four astronauts prepare to ride the most powerful rocket ever built on a historic voyage around the Moon.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm font-sans uppercase font-bold text-gray-800">
            <span>By The Science Desk</span>
            <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
            <span>Interactive Feature</span>
          </div>
        </div>

        {/* Introduction & History */}
        <article className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed text-justify mb-16">
          <p className="drop-cap">
            In December 1972, Apollo 17 Commander Eugene Cernan left the final human footprints in the lunar dust. As he departed, he spoke of a promise to return. For over half a century, that promise remained unfulfilled, as humanity's gaze shifted to low-Earth orbit, the Space Shuttle, and the construction of the International Space Station. 
          </p>
          <p>
            Now, the Artemis program aims to close that gap. Following the successful uncrewed flight of Artemis I in 2022, NASA is preparing for the next monumental step. Artemis II is not just a mission; it is a declaration that the era of deep space exploration has been reborn. This mission will test the foundational human deep space exploration capabilities, the Space Launch System (SLS) rocket, and the Orion spacecraft.
          </p>
        </article>

        {/* The Crew Section */}
        <section className="mb-16">
          <SectionHeader icon={UserSquare2} title="The Vanguard: Meet the Crew" />
          <p className="font-serif text-lg mb-8 text-gray-800">
            The Artemis II mission is crewed by four exceptional individuals representing a new, diverse generation of explorers. Their selection marks the first time a woman, a person of color, and a Canadian will fly to the lunar vicinity.
          </p>
          <div className="flex flex-col gap-4">
            {crewData.map((member, i) => (
              <CrewCard key={i} member={member} />
            ))}
          </div>
        </section>

        {/* The Hardware Section */}
        <article className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed text-justify mb-10">
          <p>
            To break the bonds of Earth's gravity, you need immense power. Enter the Space Launch System (SLS), a super heavy-lift launch vehicle that stands as the modern successor to the Saturn V. While it utilizes legacy Space Shuttle technology—including its famously efficient RS-25 engines and elongated solid rocket boosters—it is an entirely new beast designed explicitly for deep space.
          </p>
          <p>
            The interactive schematic below details the monumental engineering required to propel the Orion spacecraft—the crew's temporary home—out of Earth's orbit and toward the lunar surface.
          </p>
        </article>

        {/* Interactive Rocket SVG */}
        <section className="mb-16 border-t-2 border-b-2 border-black py-8 bg-white">
          <SectionHeader icon={Rocket} title="Interactive Schematic: The SLS Rocket" />
          <RocketGraphic />
        </section>

        {/* The Journey Section */}
        <article className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed text-justify mb-10">
          <p>
            The 10-day odyssey of Artemis II is a complex ballet of orbital mechanics. Unlike the direct Apollo missions, Artemis II will employ a highly elliptical High Earth Orbit (HEO) to test the life support systems before committing to the translunar coast.
          </p>
          <p>
            Once the massive Trans-Lunar Injection (TLI) burn is executed, Orion will travel on a "free-return trajectory." This means the spacecraft will use the Moon's gravity to slingshot itself back to Earth, requiring no major propulsion to safely return home. The crew will fly 4,600 miles beyond the far side of the Moon, pushing humans further into the solar system than ever before.
          </p>
        </article>

        {/* Interactive Timeline SVG */}
        <section className="mb-16">
          <SectionHeader icon={Map} title="Mission Profile: A 10-Day Odyssey" />
          <TimelineGraphic />
        </section>

        {/* Future Section */}
        <article className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed text-justify mb-16">
          <p>
            Artemis II is merely the prologue. If successful, it sets the stage for Artemis III, which plans to return boots to the lunar surface near the South Pole. It lays the groundwork for the Lunar Gateway, a space station in orbit around the Moon, and a sustained human presence on the lunar surface. 
          </p>
          <p>
            Ultimately, the lessons learned from the Artemis missions will serve as the stepping stones for humanity's next great leap: a crewed mission to Mars. The hardware is built. The crew is ready. The countdown to a new era of exploration has begun.
          </p>
        </article>

        {/* Footer */}
        <footer className="border-t-4 border-double border-black pt-6 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            The Story Teller
          </h1>
          <p className="font-sans text-xs uppercase tracking-widest text-gray-500 font-bold">
            &copy; {new Date().getFullYear()} The Story Teller Media • Science & Technology Desk
          </p>
        </footer>

      </main>
    </div>
  );
}

// Reusable Crew Card for the accordion layout
function CrewCard({ member }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`border border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden ${expanded ? 'pb-4' : ''}`}>
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 focus:outline-none transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${member.color}`}>
             <span className="text-xl sm:text-2xl font-black font-sans tracking-widest">{member.initials}</span>
          </div>
          <div className="text-left">
            <div className="flex flex-wrap items-center gap-2 mb-1">
               <h3 className="text-lg sm:text-xl font-bold font-sans uppercase text-black">{member.name}</h3>
               <span className="px-2 py-0.5 bg-black text-white text-[10px] font-sans font-bold tracking-widest uppercase">
                 {member.agency}
               </span>
            </div>
            <div className="text-gray-600 font-sans text-xs font-bold uppercase tracking-wider">
              {member.role}
            </div>
          </div>
        </div>
        <div className="pl-4 shrink-0">
          {expanded ? <ChevronUp className="w-6 h-6 text-gray-500" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
        </div>
      </button>
      
      {expanded && (
        <div className="px-4 pt-4 border-t border-gray-200 mx-4 sm:ml-[112px] animate-in fade-in slide-in-from-top-2">
          <p className="text-sm font-serif text-gray-800 mb-4 leading-relaxed">
            {member.bio}
          </p>
          <a href={member.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase text-blue-600 hover:text-blue-800 transition-colors">
            Official Biography <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}

// Reusable Section Header for the article
function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-2">
      <div className="w-8 h-8 bg-black flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold font-sans uppercase tracking-tight text-black">
        {title}
      </h2>
    </div>
  );
}

// --- ROCKET INTERACTIVE GRAPHIC (B&W Redesign) ---
function RocketGraphic() {
  const [stage, setStage] = useState('orion');

  const getStageClass = (id) => `cursor-pointer transition-all duration-300 ${
    stage === id 
      ? 'opacity-100 stroke-[4px]' 
      : 'opacity-50 hover:opacity-80 stroke-[2px]'
  }`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-black p-4 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
      
      {/* Left: Interactive Schematic SVG */}
      <div className="flex justify-center h-[500px] md:h-[600px] bg-slate-900 rounded border border-gray-300 p-4 relative pattern-grid-lg overflow-hidden">
        {/* Helper text overlay */}
        <div className="absolute top-4 left-4 bg-white border border-black px-3 py-1 font-sans text-xs uppercase font-bold flex items-center gap-2 shadow-sm z-10">
           <Info className="w-3 h-3" /> Select a component
        </div>

        <svg viewBox="0 0 400 800" className="w-full h-full drop-shadow-2xl">
          {/* Launch Pad Base */}
          <rect x="80" y="730" width="240" height="20" fill="#1e293b" rx="2" stroke="#0f172a" strokeWidth="2" />
          <rect x="180" y="710" width="40" height="20" fill="#334155" stroke="#0f172a" strokeWidth="2" />

          {/* RS-25 Engines */}
          <g onClick={() => setStage('engines')} className={getStageClass('engines')}>
            <rect x="150" y="700" width="10" height="5" fill="#64748b" stroke="#0f172a" />
            <rect x="180" y="700" width="10" height="5" fill="#64748b" stroke="#0f172a" />
            <rect x="210" y="700" width="10" height="5" fill="#64748b" stroke="#0f172a" />
            <rect x="240" y="700" width="10" height="5" fill="#64748b" stroke="#0f172a" />
            <path d="M 150 705 L 160 705 L 166 730 L 144 730 Z" fill="#475569" stroke="#0f172a" />
            <path d="M 180 705 L 190 705 L 196 730 L 174 730 Z" fill="#475569" stroke="#0f172a" />
            <path d="M 210 705 L 220 705 L 226 730 L 204 730 Z" fill="#475569" stroke="#0f172a" />
            <path d="M 240 705 L 250 705 L 256 730 L 234 730 Z" fill="#475569" stroke="#0f172a" />
          </g>

          {/* Solid Rocket Boosters (SRBs) */}
          <g onClick={() => setStage('srb')} className={getStageClass('srb')}>
            {/* Left SRB */}
            <rect x="100" y="240" width="40" height="470" fill="#f8fafc" stroke="#0f172a" rx="4"/>
            <polygon points="100,240 120,180 140,240" fill="#cbd5e1" stroke="#0f172a"/>
            <rect x="100" y="340" width="40" height="10" fill="#94a3b8" stroke="#0f172a"/>
            <rect x="100" y="460" width="40" height="10" fill="#94a3b8" stroke="#0f172a"/>
            <rect x="100" y="580" width="40" height="10" fill="#94a3b8" stroke="#0f172a"/>
            
            {/* Right SRB */}
            <rect x="260" y="240" width="40" height="470" fill="#f8fafc" stroke="#0f172a" rx="4"/>
            <polygon points="260,240 280,180 300,240" fill="#cbd5e1" stroke="#0f172a"/>
            <rect x="260" y="340" width="40" height="10" fill="#94a3b8" stroke="#0f172a"/>
            <rect x="260" y="460" width="40" height="10" fill="#94a3b8" stroke="#0f172a"/>
            <rect x="260" y="580" width="40" height="10" fill="#94a3b8" stroke="#0f172a"/>
          </g>

          {/* Core Stage */}
          <g onClick={() => setStage('core')} className={getStageClass('core')}>
            <rect x="140" y="260" width="120" height="440" fill="#ea580c" stroke="#0f172a" rx="4"/>
            <rect x="140" y="320" width="120" height="15" fill="#c2410c" stroke="#0f172a"/>
            <rect x="140" y="420" width="120" height="4" fill="#c2410c" stroke="#0f172a"/>
            <rect x="140" y="620" width="120" height="4" fill="#c2410c" stroke="#0f172a"/>
            <text x="200" y="520" fill="#9a3412" fontSize="30" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90 200 520)">SLS</text>
          </g>

          {/* ICPS */}
          <g onClick={() => setStage('icps')} className={getStageClass('icps')}>
            <polygon points="140,260 260,260 242,210 158,210" fill="#f8fafc" stroke="#0f172a"/>
            <rect x="158" y="170" width="84" height="40" fill="#e2e8f0" stroke="#0f172a"/>
          </g>

          {/* Orion Spacecraft */}
          <g onClick={() => setStage('orion')} className={getStageClass('orion')}>
            {/* Service Module */}
            <rect x="158" y="130" width="84" height="40" fill="#cbd5e1" stroke="#0f172a"/>
            <rect x="155" y="140" width="90" height="6" fill="#334155" stroke="#0f172a"/>
            <rect x="155" y="160" width="90" height="6" fill="#334155" stroke="#0f172a"/>
            {/* Capsule */}
            <polygon points="158,130 242,130 225,100 175,100" fill="#f8fafc" stroke="#0f172a"/>
          </g>

          {/* Launch Abort System (LAS) */}
          <g onClick={() => setStage('las')} className={getStageClass('las')}>
            <polygon points="175,100 225,100 208,60 192,60" fill="#f8fafc" stroke="#0f172a"/>
            <rect x="190" y="55" width="20" height="8" fill="#e2e8f0" stroke="#0f172a" rx="2" />
            <rect x="195" y="20" width="10" height="35" fill="#f8fafc" stroke="#0f172a"/>
            <polygon points="195,20 205,20 200,0" fill="#f8fafc" stroke="#0f172a"/>
          </g>
        </svg>
      </div>

      {/* Right: Stage Information */}
      <div className="flex flex-col justify-center">
        
        <div className="border-l-4 border-black pl-6">
          <h2 className="text-3xl md:text-4xl font-sans font-black uppercase mb-4 tracking-tight">
            {rocketStages[stage].title}
          </h2>
          
          <p className="text-lg text-gray-700 font-serif mb-8 leading-relaxed">
            {rocketStages[stage].desc}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(rocketStages[stage].stats).map(([key, value]) => (
              <div key={key} className="border-t-2 border-black pt-2">
                <div className="text-gray-500 font-sans text-xs font-bold mb-1 uppercase tracking-widest">{key}</div>
                <div className="text-xl font-sans font-bold text-black">{value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// --- TIMELINE INTERACTIVE GRAPHIC (B&W Redesign) ---
function TimelineGraphic() {
  const [currentStep, setCurrentStep] = useState(0);

  // Generate background stars once
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      x: Math.random() * 800,
      y: Math.random() * 400,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.1
    }));
  }, []);

  // Use the exact precise geometry from the previous version
  const getShipPosition = (idx) => {
    const positions = [
      { x: 210, y: 160, r: -120 },    
      { x: 140, y: 125, r: -180 },    
      { x: 160, y: 290, r: -360 },    
      { x: 250, y: 200, r: -450 },    
      { x: 140, y:  90, r: -540 },    
      { x: 150, y: 330, r: -720 },    
      { x: 400, y: 230, r: -758 },    
      { x: 720, y: 200, r: -630 },    
      { x: 400, y: 170, r: -520 },    
      { x: 105, y:  80, r: -555 },    
      { x:  55, y: 150, r: -630 },    
      { x:  85, y: 240, r: -700 },    
    ];
    return positions[idx];
  };

  const pos = getShipPosition(currentStep);

  return (
    <div className="bg-white border-2 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      
      <div className="p-4 md:p-6 bg-black text-white rounded-sm">
        
        {/* 2D Space Visualizer */}
        <div className="relative w-full bg-slate-950 rounded-sm overflow-hidden mb-8 border border-gray-800">
          <svg viewBox="0 0 800 400" className="w-full h-auto">
            <rect width="100%" height="100%" fill="#020617" />
            
            {/* Stars */}
            {stars.map((star, i) => (
              <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#fff" opacity={star.opacity * 0.8} />
            ))}

            {/* Path Legend (Colored) */}
            <g fontFamily="sans-serif" fontSize="11" fontWeight="bold" letterSpacing="1">
              <text x="20" y="30" fill="#3b82f6">EARTH ORBITS</text>
              <text x="140" y="30" fill="#22c55e">OUTBOUND</text>
              <text x="230" y="30" fill="#a855f7">RETURN</text>
              <text x="310" y="30" fill="#ef4444">RE-ENTRY</text>
            </g>

            {/* Earth Orbits */}
            <path
              d="M 210, 160
                 A 75, 75 0 0 0 70, 200
                 A 90, 90 0 0 0 250, 200
                 A 110, 110 0 0 0 30, 200
                 A 120, 130 0 0 0 150, 330"
              fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5,5" opacity="0.8"
            />
            {/* Outbound */}
            <path
              d="M 150, 330 C 400, 330  400, 130  650, 130"
              fill="none" stroke="#22c55e" strokeWidth="2.5" strokeDasharray="5,5" opacity="0.8"
            />
            {/* Moon Flyby & Return */}
            <path
              d="M 650, 130 A 70, 70 0 0 1 650, 270 C 400, 270  400, 70   150, 70"
              fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="5,5" opacity="0.8"
            />
            {/* Re-entry */}
            <path
              d="M 150, 70 C 50, 70    30, 200   85, 240"
              fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,5" opacity="0.8"
            />

            {/* Earth */}
            <g>
              <defs>
                <clipPath id="earth-clip">
                  <circle cx="150" cy="200" r="65" />
                </clipPath>
              </defs>
              <circle cx="150" cy="200" r="65" fill="#0284c7" />
              <g clipPath="url(#earth-clip)">
                <path d="M 100 150 Q 120 130 150 140 T 180 160 Q 150 200 120 180 Z" fill="#16a34a" />
                <path d="M 160 250 Q 180 230 200 240 T 220 260 Q 190 280 150 270 Z" fill="#16a34a" />
              </g>
              <circle cx="150" cy="200" r="72" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.3"/>
              <text x="150" y="205" fill="#fff" fontSize="13" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1" textAnchor="middle">EARTH</text>
            </g>

            {/* Moon */}
            <g>
              <circle cx="650" cy="200" r="24" fill="#94a3b8" />
              <circle cx="642" cy="192" r="4" fill="#64748b" opacity="0.5"/>
              <circle cx="658" cy="208" r="6" fill="#64748b" opacity="0.5"/>
              <circle cx="638" cy="212" r="3" fill="#64748b" opacity="0.5"/>
              <text x="650" y="245" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1" opacity="0.8" textAnchor="middle">MOON</text>
            </g>

            {/* Orion Spacecraft */}
            <g 
              style={{ 
                transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r}deg)`, 
                transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' 
              }}
            >
              <polygon points="-12,-8 12,0 -12,8 -6,0" fill="#f8fafc" />
              <polygon 
                points="-12,-3 -20,0 -12,3" 
                fill="#f97316" 
                className={`transition-opacity duration-500 ${[0, 2, 3, 5].includes(currentStep) ? 'opacity-100' : 'opacity-0'}`} 
              />
            </g>
          </svg>
        </div>

        {/* Active Step Information */}
        <div className="mb-8 border-l-4 border-white pl-6">
          <div className="text-gray-400 font-bold mb-2 tracking-widest font-sans uppercase text-xs">
            Phase {currentStep + 1} • {timelineSteps[currentStep].time}
          </div>
          <h2 className="text-3xl font-bold font-sans uppercase text-white mb-3">
            {timelineSteps[currentStep].title}
          </h2>
          <p className="text-lg text-gray-300 font-serif leading-relaxed max-w-3xl">
            {timelineSteps[currentStep].desc}
          </p>
        </div>

        {/* Timeline Controls (Newspaper style) */}
        <div className="relative">
          <div className="flex items-start overflow-x-auto pb-4 pt-2 px-2 snap-x custom-scrollbar">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center relative min-w-[120px] snap-center shrink-0 group cursor-pointer" onClick={() => setCurrentStep(idx)}>
                
                {/* Connecting line */}
                {idx !== 0 && (
                  <div className={`absolute top-4 -left-[50%] w-full h-0.5 -z-10 transition-colors duration-500 ${
                    idx <= currentStep ? 'bg-white' : 'bg-gray-800'
                  }`}></div>
                )}
                
                {/* Timeline Node */}
                <button
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-sans text-sm transition-all duration-300 z-10 border-2 ${
                    idx === currentStep 
                      ? 'bg-white text-black border-white scale-125' :
                    idx < currentStep 
                      ? 'bg-gray-800 text-white border-gray-800 group-hover:bg-gray-700' 
                      : 'bg-black text-gray-500 border-gray-800 group-hover:border-gray-600'
                  }`}
                >
                  {idx + 1}
                </button>
                
                {/* Step Label */}
                <span className={`mt-4 text-xs font-bold font-sans uppercase text-center px-2 transition-colors ${
                  idx === currentStep ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}