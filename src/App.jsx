import React, { useState, useMemo } from 'react';
import { Rocket, Clock, Users, Info, Moon, Star } from 'lucide-react';

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
  { title: "Perigee Raise Maneuver", time: "Day 1", desc: "A short burn from the ICPS second stage stabilizes the astronauts' orbit and prepares for altitude increases." },
  { title: "Apogee Raise Burn", time: "Day 1", desc: "A second burn raises the astronauts into a High Earth Orbit (HEO) to test the spacecraft's systems." },
  { title: "High Earth Orbit Checkout", time: "Day 1", desc: "During a 23.5-hour highly elliptical orbit, the crew tests manual control, life support, and habitation equipment." },
  { title: "Trans-Lunar Injection", time: "Day 2", desc: "The massive final burn of the ICPS accelerates Orion out of Earth's gravity and starts its free-return trajectory to the Moon." },
  { title: "Outbound Transit", time: "Days 2-4", desc: "Orion separates from the ICPS and coasts through deep space for a four-day journey toward the Moon." },
  { title: "Lunar Flyby", time: "Day 5", desc: "Orion slingshots around the far side of the Moon, passing within 4,600 miles of the surface, farther than humans have gone before." },
  { title: "Trans-Earth Return", time: "Days 6-9", desc: "Using the Moon's gravity assist, Orion coasts on a four-day return journey back toward Earth." },
  { title: "Crew Module Separation", time: "Day 10", desc: "The astronauts' return module separates from the European Service Module, preparing for atmospheric entry." },
  { title: "Earth Re-entry", time: "Day 10", desc: "The capsule re-enters Earth's atmosphere at a record speed of nearly 25,000 mph, enduring temperatures up to 5,000°F." },
  { title: "Splashdown", time: "Day 10", desc: "Astronauts land safely in the Pacific Ocean under parachutes, concluding the historic Artemis II mission." }
];

const crewData = [
  {
    name: 'Reid Wiseman',
    role: 'Commander',
    agency: 'NASA',
    bio: 'Wiseman served as flight engineer aboard the ISS for Expedition 41 in 2014, logging 165 days in space. Before his assignment, he served as chief of the Astronaut Office. He is a designated Naval Aviator and former test pilot.',
    color: 'bg-blue-600'
  },
  {
    name: 'Victor Glover',
    role: 'Pilot',
    agency: 'NASA',
    bio: 'Glover flew as pilot on NASA\'s SpaceX Crew-1 mission in 2020, logging 168 days in space. He participated in four spacewalks and is a former U.S. Navy test pilot with extensive combat experience.',
    color: 'bg-red-600'
  },
  {
    name: 'Christina Koch',
    role: 'Mission Specialist',
    agency: 'NASA',
    bio: 'Koch holds the record for the longest single spaceflight by a woman (328 days) and participated in the first all-female spacewalk. She has served as a flight engineer on the ISS for three expeditions.',
    color: 'bg-emerald-600'
  },
  {
    name: 'Jeremy Hansen',
    role: 'Mission Specialist',
    agency: 'CSA',
    bio: 'Representing the Canadian Space Agency, Hansen is making his first flight to space. He is a former Royal Canadian Air Force fighter pilot and has served in numerous leadership roles within the astronaut corps.',
    color: 'bg-amber-500'
  }
];

// --- COMPONENTS ---

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      {/* CSS Injection for hiding scrollbars on timeline */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">ARTEMIS <span className="text-blue-500">II</span></h1>
          </div>
          
          <nav className="flex overflow-x-auto gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 hide-scrollbar">
            <TabButton active={activeTab === 'rocket'} onClick={() => setActiveTab('rocket')} icon={Rocket} label="The Rocket" />
            <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={Clock} label="Mission Timeline" />
            <TabButton active={activeTab === 'crew'} onClick={() => setActiveTab('crew')} icon={Users} label="The Crew" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'rocket' && <RocketTab />}
          {activeTab === 'timeline' && <TimelineTab />}
          {activeTab === 'crew' && <CrewTab />}
        </div>
      </main>
    </div>
  );
}

// Reusable Tab Button
function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
        active 
          ? 'bg-slate-800 text-white shadow-sm' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// --- ROCKET TAB ---
function RocketTab() {
  const [stage, setStage] = useState('orion');

  const getStageClass = (id) => `cursor-pointer transition-all duration-300 ${
    stage === id 
      ? 'opacity-100 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]' 
      : 'opacity-50 hover:opacity-80'
  }`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/50 p-4 md:p-8 rounded-3xl border border-slate-800">
      
      {/* Left: Interactive SVG */}
      <div className="flex justify-center h-[500px] md:h-[600px] bg-slate-950 rounded-2xl border border-slate-800 p-4">
        <svg viewBox="0 0 400 800" className="w-full h-full drop-shadow-2xl">
          
          {/* Launch Pad Base */}
          <rect x="80" y="730" width="240" height="20" fill="#1e293b" rx="4" />
          <rect x="180" y="710" width="40" height="20" fill="#334155" />

          {/* RS-25 Engines */}
          <g onClick={() => setStage('engines')} className={getStageClass('engines')}>
            <rect x="150" y="700" width="10" height="5" fill="#64748b" />
            <rect x="180" y="700" width="10" height="5" fill="#64748b" />
            <rect x="210" y="700" width="10" height="5" fill="#64748b" />
            <rect x="240" y="700" width="10" height="5" fill="#64748b" />
            <path d="M 150 705 L 160 705 L 166 730 L 144 730 Z" fill="#475569" />
            <path d="M 180 705 L 190 705 L 196 730 L 174 730 Z" fill="#475569" />
            <path d="M 210 705 L 220 705 L 226 730 L 204 730 Z" fill="#475569" />
            <path d="M 240 705 L 250 705 L 256 730 L 234 730 Z" fill="#475569" />
          </g>

          {/* Solid Rocket Boosters (SRBs) */}
          <g onClick={() => setStage('srb')} className={getStageClass('srb')}>
            {/* Left SRB */}
            <rect x="100" y="240" width="40" height="470" fill="#e2e8f0" rx="4"/>
            <polygon points="100,240 120,180 140,240" fill="#cbd5e1"/>
            <rect x="100" y="340" width="40" height="10" fill="#94a3b8"/>
            <rect x="100" y="460" width="40" height="10" fill="#94a3b8"/>
            <rect x="100" y="580" width="40" height="10" fill="#94a3b8"/>
            
            {/* Right SRB */}
            <rect x="260" y="240" width="40" height="470" fill="#e2e8f0" rx="4"/>
            <polygon points="260,240 280,180 300,240" fill="#cbd5e1"/>
            <rect x="260" y="340" width="40" height="10" fill="#94a3b8"/>
            <rect x="260" y="460" width="40" height="10" fill="#94a3b8"/>
            <rect x="260" y="580" width="40" height="10" fill="#94a3b8"/>
          </g>

          {/* Core Stage */}
          <g onClick={() => setStage('core')} className={getStageClass('core')}>
            <rect x="140" y="260" width="120" height="440" fill="#c2410c" rx="4"/>
            <rect x="140" y="320" width="120" height="15" fill="#9a3412"/>
            <rect x="140" y="420" width="120" height="4" fill="#9a3412"/>
            <rect x="140" y="620" width="120" height="4" fill="#9a3412"/>
            <rect x="165" y="260" width="6" height="440" fill="#9a3412"/>
            <text x="200" y="520" fill="#ea580c" fontSize="30" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90 200 520)">SLS</text>
          </g>

          {/* ICPS */}
          <g onClick={() => setStage('icps')} className={getStageClass('icps')}>
            <polygon points="140,260 260,260 242,210 158,210" fill="#f8fafc"/>
            <rect x="158" y="170" width="84" height="40" fill="#f1f5f9"/>
            <rect x="158" y="206" width="84" height="4" fill="#cbd5e1"/>
            <rect x="140" y="256" width="120" height="4" fill="#cbd5e1"/>
          </g>

          {/* Orion Spacecraft */}
          <g onClick={() => setStage('orion')} className={getStageClass('orion')}>
            {/* Service Module */}
            <rect x="158" y="130" width="84" height="40" fill="#cbd5e1"/>
            <rect x="155" y="140" width="90" height="6" fill="#334155"/>
            <rect x="155" y="160" width="90" height="6" fill="#334155"/>
            {/* Capsule */}
            <polygon points="158,130 242,130 225,100 175,100" fill="#f8fafc"/>
            <rect x="158" y="127" width="84" height="3" fill="#64748b"/>
          </g>

          {/* Launch Abort System (LAS) */}
          <g onClick={() => setStage('las')} className={getStageClass('las')}>
            <polygon points="175,100 225,100 208,60 192,60" fill="#f8fafc"/>
            <rect x="190" y="55" width="20" height="8" fill="#e2e8f0" rx="2" />
            <rect x="195" y="20" width="10" height="35" fill="#f8fafc"/>
            <polygon points="195,20 205,20 200,0" fill="#f8fafc"/>
          </g>
        </svg>
      </div>

      {/* Right: Stage Information */}
      <div className="flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-xs mb-6 self-start border border-blue-500/20">
          <Info className="w-4 h-4" /> Click on a rocket stage to learn more
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          {rocketStages[stage].title}
        </h2>
        
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          {rocketStages[stage].desc}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(rocketStages[stage].stats).map(([key, value]) => (
            <div key={key} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner">
              <div className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-widest">{key}</div>
              <div className="text-xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- TIMELINE TAB ---
function TimelineTab() {
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

  // Calculate Orion spacecraft position and rotation based on current step
  // Angles strictly decrease continuously (except at the figure-8 crossover) to stop wild spins!
  const getShipPosition = (idx) => {
    const positions = [
      { x: 210, y: 160, r: -120 },    // 0: Liftoff
      { x: 140, y: 125, r: -180 },    // 1: MEC (Top Inner Loop, Moving Left)
      { x: 160, y: 290, r: -360 },    // 2: Perigee Raise (Bottom Inner Loop, Moving Right)
      { x: 250, y: 200, r: -450 },    // 3: Apogee Raise (Right Outer Loop, Moving Up)
      { x: 140, y:  90, r: -540 },    // 4: HEO Checkout (Top Outer Loop, Moving Left)
      { x: 150, y: 330, r: -720 },    // 5: TLI (Bottom Outer Loop, Moving Right)
      { x: 400, y: 230, r: -758 },    // 6: Outbound Transit
      { x: 720, y: 200, r: -630 },    // 7: Lunar Flyby (Inflection: Changes from CCW to CW)
      { x: 400, y: 170, r: -520 },    // 8: Return
      { x: 105, y:  80, r: -555 },    // 9: Module Sep
      { x:  55, y: 150, r: -630 },    // 10: Re-entry (Inflection: Hits Earth orbit CCW)
      { x:  85, y: 240, r: -700 },    // 11: Splashdown
    ];
    return positions[idx];
  };

  const pos = getShipPosition(currentStep);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 md:p-8">
      
      {/* 2D Space Visualizer */}
      <div className="relative w-full bg-slate-950 rounded-2xl overflow-hidden mb-8 border border-slate-800 shadow-2xl">
        <svg viewBox="0 0 800 400" className="w-full h-auto">
          {/* Deep Space Background */}
          <rect width="100%" height="100%" fill="#020617" />
          
          {/* Stars */}
          {stars.map((star, i) => (
            <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#ffffff" opacity={star.opacity} />
          ))}

          {/* Path Legend */}
          <g fontFamily="sans-serif" fontSize="12" fontWeight="bold" letterSpacing="1">
            <text x="20" y="30" fill="#3b82f6" opacity="0.8">EARTH ORBITS</text>
            <text x="140" y="30" fill="#22c55e" opacity="0.8">OUTBOUND</text>
            <text x="240" y="30" fill="#a855f7" opacity="0.8">RETURN</text>
            <text x="320" y="30" fill="#ef4444" opacity="0.8">RE-ENTRY</text>
          </g>

          {/* Earth Orbits (Flawless Expanding Spiral using perfect SVG Elliptical Arcs) */}
          <path
            d="M 210, 160
               A 75, 75 0 0 0 70, 200
               A 90, 90 0 0 0 250, 200
               A 110, 110 0 0 0 30, 200
               A 120, 130 0 0 0 150, 330"
            fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6,6" opacity="0.5"
          />
          {/* Outbound (TLI -> Moon) */}
          <path
            d="M 150, 330
               C 400, 330  400, 130  650, 130"
            fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="6,6" opacity="0.6"
          />
          {/* Moon Flyby & Return (Perfect Semi-circle -> Bezier to Earth) */}
          <path
            d="M 650, 130
               A 70, 70 0 0 1 650, 270
               C 400, 270  400, 70   150, 70"
            fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="6,6" opacity="0.6"
          />
          {/* Re-entry (Smoothed curve matching the smaller Earth) */}
          <path
            d="M 150, 70
               C 50, 70    30, 200   85, 240"
            fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="6,6" opacity="0.6"
          />

          {/* Earth - Scaled down slightly to allow orbits to breathe */}
          <g>
            <defs>
              <clipPath id="earth-clip">
                <circle cx="150" cy="200" r="65" />
              </clipPath>
            </defs>
            <circle cx="150" cy="200" r="65" fill="#0284c7" />
            {/* Simple Continents clipped to stay inside globe */}
            <g clipPath="url(#earth-clip)">
              <path d="M 100 150 Q 120 130 150 140 T 180 160 Q 150 200 120 180 Z" fill="#16a34a" opacity="0.9"/>
              <path d="M 160 250 Q 180 230 200 240 T 220 260 Q 190 280 150 270 Z" fill="#16a34a" opacity="0.9"/>
            </g>
            {/* Atmosphere Glow */}
            <circle cx="150" cy="200" r="72" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.2"/>
            <text x="150" y="205" fill="#ffffff" fontSize="14" fontWeight="bold" opacity="0.8" textAnchor="middle">EARTH</text>
          </g>

          {/* Moon - Scaled down slightly for the 70px flyby arc to wrap gracefully */}
          <g>
            <circle cx="650" cy="200" r="24" fill="#94a3b8" />
            <circle cx="642" cy="192" r="4" fill="#64748b" opacity="0.4"/>
            <circle cx="658" cy="208" r="6" fill="#64748b" opacity="0.4"/>
            <circle cx="638" cy="212" r="3" fill="#64748b" opacity="0.4"/>
            <text x="650" y="245" fill="#ffffff" fontSize="12" fontWeight="bold" opacity="0.6" textAnchor="middle">MOON</text>
          </g>

          {/* Orion Spacecraft */}
          <g 
            style={{ 
              transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.r}deg)`, 
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
          >
            {/* Ship Body */}
            <polygon points="-12,-8 12,0 -12,8 -6,0" fill="#f8fafc" />
            {/* Engine Flame (Shows mostly during burns) */}
            <polygon 
              points="-12,-3 -20,0 -12,3" 
              fill="#f97316" 
              className={`transition-opacity duration-500 ${[0, 2, 3, 5].includes(currentStep) ? 'opacity-100' : 'opacity-0'}`} 
            />
          </g>
        </svg>
      </div>

      {/* Active Step Information */}
      <div className="mb-8 p-6 md:p-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
        <div className="text-blue-500 font-bold mb-2 tracking-widest uppercase text-sm">
          Phase {currentStep + 1} • {timelineSteps[currentStep].time}
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{timelineSteps[currentStep].title}</h2>
        <p className="text-lg text-slate-400 leading-relaxed max-w-4xl">
          {timelineSteps[currentStep].desc}
        </p>
      </div>

      {/* Timeline Controls */}
      <div className="relative">
        <div className="flex items-start overflow-x-auto pb-4 pt-2 px-2 snap-x hide-scrollbar">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative min-w-[140px] snap-center shrink-0 group cursor-pointer" onClick={() => setCurrentStep(idx)}>
              
              {/* Connecting line */}
              {idx !== 0 && (
                <div className={`absolute top-5 -left-[50%] w-full h-1 -z-10 transition-colors duration-500 ${
                  idx <= currentStep ? 'bg-blue-600' : 'bg-slate-800'
                }`}></div>
              )}
              
              {/* Timeline Node */}
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 border-4 border-slate-900 ${
                  idx === currentStep 
                    ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-125' :
                  idx < currentStep 
                    ? 'bg-blue-900 text-blue-200 group-hover:bg-blue-800' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
              
              {/* Step Label */}
              <span className={`mt-4 text-sm font-semibold text-center px-2 transition-colors ${
                idx === currentStep ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}

// --- CREW TAB ---
function CrewTab() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 md:p-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-white mb-4">Meet The Artemis II Crew</h2>
        <p className="text-slate-400 text-lg">
          These four extraordinary astronauts will be the first humans to travel to the lunar vicinity in over 50 years, paving the way for future deep space exploration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {crewData.map((member, i) => (
          <div key={i} className="group relative overflow-hidden bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 transition-all hover:border-slate-600 shadow-lg">
            
            {/* Decorative Background Glow */}
            <div className={`absolute -right-10 -top-10 w-48 h-48 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${member.color}`}></div>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
              {/* Avatar Placeholder */}
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0 shadow-inner border border-white/10 ${member.color}`}>
                 <span className="text-2xl sm:text-3xl font-black text-white tracking-widest drop-shadow-md">
                   {member.name.split(' ').map(n => n[0]).join('')}
                 </span>
              </div>
              
              {/* Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                   <h3 className="text-2xl font-bold text-white leading-none">{member.name}</h3>
                   <span className="px-2.5 py-1 bg-slate-800 text-blue-400 rounded-md text-xs font-bold tracking-widest border border-slate-700">
                     {member.agency}
                   </span>
                </div>
                
                <div className="text-blue-400 font-semibold text-sm tracking-wider uppercase mb-3">
                  {member.role}
                </div>
                
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  {member.bio}
                </p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
