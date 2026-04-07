import React, { useState, useMemo } from 'react';
import { Info, Map, Rocket, UserSquare2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

// --- DATA ---

const rocketStages = {
  sls: {
    title: 'Space Launch System (SLS)',
    desc: 'The Space Launch System is a super heavy-lift expendable launch vehicle, providing the foundation for human exploration beyond Earth\'s orbit. With its unprecedented power and capabilities, SLS is the only rocket that can send Orion, astronauts, and cargo to the Moon on a single mission.',
    stats: { Thrust: '39,000,000 Newtons', Payload: '95,000 kg to Low Eearth Orbit' }
  },
  las: { 
    title: 'Launch Abort System', 
    desc: 'Positioned on the very top of the SLS, the LAS is designed to safely pull the Orion crew module away from the rocket in the event of an emergency during launch or ascent.', 
    stats: { 'Can Lift': '26 Elephants', 'Activates In': '< 1 ms' } 
  },
  orion: { 
    title: 'Orion Spacecraft', 
    desc: 'The exploration vehicle that carries the four-person crew to space, provides emergency abort capability, sustains the crew during space travel, and ensures safe re-entry.', 
    stats: { Volume: '8,9 m sq', Passengers: '4 Astronauts' } 
  },
  icps: { 
    title: 'Interim Cryogenic Propulsion Stage', 
    desc: 'The upper stage powered by one RL10 engine. It performed the critical Trans-Lunar Injection (TLI) burn, accelerating Orion out of Earth\'s orbit towards the Moon.', 
    stats: { Thrust: '110,000 Newtons', Fuel: 'Liquid H2 / O2' } 
  },
  lvsa: {
    title: 'Launch Vehicle Stage Adapter',
    desc: 'The cone-shaped Launch Vehicle Stage Adapter (LVSA) connects the massive Core Stage to the upper stages. It also partially encloses and protects the engine of the Interim Cryogenic Propulsion Stage (ICPS) during launch.',
    stats: { Height: '8,4 m', Diameter: '5m to 8,4 m' }
  },
  core: { 
    title: 'SLS Core Stage', 
    desc: 'The backbone of the rocket, standing 64,6 meters tall. Visually similar to the core stage of the Space Shuttle program it provides about 25% of the total thrust of the vehicle.', 
    stats: { Height: '64,6 m', 'Empty Weight': '85,275 kg' } 
  },
  engines: {
    title: 'RS-25 Engines',
    desc: 'Four RS-25 engines power the core stage. Originally developed for the Space Shuttle program, these highly efficient engines use cryogenic liquid hydrogen and oxygen to produce over 9,000,000 Newtons of combined thrust.',
    stats: { Thrust: '9,100,000 Newtons total', 'Operation Time': '8 minutes' }
  },
  srb: { 
    title: 'Solid Rocket Boosters', 
    desc: 'Two twin five-segment solid rocket boosters provide more than 75% of the total thrust at liftoff. They burn for just over two minutes before separating from the core stage.', 
    stats: { Thrust: '16,000,000 Newtons each', BurnTime: '126 seconds' } 
  }
};

const timelineSteps = [
  { title: "Liftoff & Ascent", time: "Day 1", desc: "The Space Launch System lifts off from Pad 39B at Kennedy Space Center, utilizing the SRBs and core stage." },
  { title: "Main Engine Cutoff", time: "Day 1", desc: "The core stage main engines shut down and separate, placing Orion and the ICPS into an initial Low Earth Orbit (LEO)." },
  { title: "Perigee Raise", time: "Day 1", desc: "A short burn from the ICPS second stage stabilizes the astronauts' orbit and prepares for altitude increases." },
  { title: "Apogee Raise Burn", time: "Day 1", desc: "A second ICPS burn raises the astronauts into a High Earth Orbit (HEO) to test the spacecraft's systems." },
  { title: "Second Stage Separation", time: "Day 1", desc: "Once the ICPS has done its job, it separates from Orion and is repurposed as a target for a verifying the crew can safely pilot Orion in manual mode." },
  { title: "Trans-Lunar Injection", time: "Day 2", desc: "Orion’s Main Engine performs the last major engine firing of the mission accelerating Orion out of Earth's gravity and starting its free-return trajectory to the Moon." },
  { title: "Outbound Transit", time: "Days 2-5", desc: "Orion crew performs small trajectory correction burns and coasts through deep space for a four-day journey toward the Moon." },
  { title: "Lunar Flyby", time: "Day 5", desc: "Orion slingshots around the far side of the Moon, passing within 7,000 km of the surface, while also venturing farther than humans have ever gone before." },
  { title: "Trans-Earth Return", time: "Days 6-9", desc: "Using the Moon's gravity assist, Orion coasts on a four-day return journey back toward Earth." },
  { title: "Module Separation", time: "Day 10", desc: "The astronauts' return module separates from the European Service Module housing the last remaining engines, preparing for atmospheric entry." },
  { title: "Earth Re-entry", time: "Day 10", desc: "The capsule re-enters Earth's atmosphere at a record speed of roughly 400,000 km/h, enduring temperatures up to 1,650°C." },
  { title: "Splashdown", time: "Day 10", desc: "Astronauts land safely in the Pacific Ocean under parachutes, concluding the historic Artemis II mission." }
];

const crewData = [
  {
    name: 'Reid Wiseman',
    role: 'Commander',
    agency: 'NASA',
    bio: 'Wiseman served as flight engineer aboard the ISS for Expedition 41 in 2014, logging 165 days in space. Before his assignment, he served as chief of the Astronaut Office. He is a designated Naval Aviator and former test pilot.',
    initials: 'RW',
    photoUrl: '/wiseman.jpg',
    link: 'https://www.nasa.gov/people/reid-wiseman/',
    color: 'text-blue-700 bg-blue-50 border-blue-200'
  },
  {
    name: 'Victor Glover',
    role: 'Pilot',
    agency: 'NASA',
    bio: 'Glover flew as pilot on SpaceX\'s Crew-1 mission in 2020, logging 168 days in space. He participated in four spacewalks and is a former U.S. Navy test pilot with extensive combat experience.',
    initials: 'VG',
    photoUrl: '/glover.jpg',
    link: 'https://www.nasa.gov/people/victor-j-glover-jr/',
    color: 'text-red-700 bg-red-50 border-red-200'
  },
  {
    name: 'Christina Koch',
    role: 'Mission Specialist',
    agency: 'NASA',
    bio: 'Koch holds the record for the longest single spaceflight by a woman (328 days) and participated in the first all-female spacewalk. She has served as a flight engineer on the ISS for three expeditions.',
    initials: 'CK',
    photoUrl: '/koch.jpg',
    link: 'https://www.nasa.gov/people/christina-koch/',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  {
    name: 'Jeremy Hansen',
    role: 'Mission Specialist',
    agency: 'CSA',
    bio: 'Representing the Canadian Space Agency, Hansen will be the first Canadian to venture to the Moon. He previously took part in NASA\'s NEEMO 19 undersea exploration mission and ESA\'s CAVES program during which he lived underground for six days.',
    initials: 'JH',
    photoUrl: '/hansen.jpg',
    link: 'https://www.asc-csa.gc.ca/eng/astronauts/canadian/active/bio-jeremy-hansen.asp',
    color: 'text-amber-700 bg-amber-50 border-amber-200'
  }
];

// --- MAIN ARTICLE LAYOUT ---

export default function App() {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-black font-serif selection:bg-gray-300 relative overflow-x-hidden">
      
      {/* Background Image Fading into the Page (Absolute positioning keeps it stuck to top and scrolls away) */}
      <div className="absolute top-0 right-0 w-full sm:w-[80vw] md:w-[55vw] lg:w-[45vw] h-[50vh] md:h-[70vh] z-0 pointer-events-none">
        <div className="absolute inset-0 bg-no-repeat bg-cover bg-right-top opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('/backgroundrocket.jpg')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f9f9f9]"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#f9f9f9]/50 to-[#f9f9f9]"></div>
      </div>

      <div className="relative z-10">
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
              <span>Saturday, March 4, 2026</span>
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
              More than fifty years after Apollo, four astronauts aboard the most advanced spacecraft ever built voyage to the Moon.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm font-sans uppercase font-bold text-gray-800">
              <span>By Frantisek Klima</span>
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              <span>Interactive Feature</span>
            </div>
          </div>

          {/* Introduction & History */}
          <article className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed text-justify mb-16">
            <p className="drop-cap">
              In December 1972, Apollo 17 Commander Eugene Cernan left the final human footprints in the lunar dust. As he departed, he spoke of a promise to return. For over half a century, that promise remained unfulfilled, as humanity's gaze shifted to low-Earth orbit, the Space Shuttle, and the construction of the International Space Station. 
            </p>
            
            <blockquote className="border-l-8 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 mt-10 relative border-y-2 border-r-2">
              <div className="absolute -top-6 -left-4 text-6xl text-gray-300 font-serif leading-none opacity-50">"</div>
              <p className="mb-6 italic text-xl md:text-2xl text-gray-800 font-serif leading-relaxed relative z-10">
                Bob, this is Gene, and I'm on the surface; and, as I take man's last step from the surface, back home for some time to come - but we believe not too long into the future - I'd like to just (say) what I believe history will record. That America's challenge of today has forged man's destiny of tomorrow. And, as we leave the Moon at Taurus- Littrow, we leave as we came and, God willing, as we shall return, with peace and hope for all mankind. "Godspeed the crew of Apollo 17."
              </p>
              
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 border-t-2 border-gray-100 pt-4 not-italic font-sans">
                <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase tracking-wider text-black">Commander Eugene Cernan</span>
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Apollo 17, Dec 14, 1972</span>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                   <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Listen to Historic Broadcast</span>
                   <audio controls className="w-full sm:w-64 h-8 outline-none">
                     <source src="/cernan.mp3" type="audio/mpeg" />
                     Your browser does not support the audio element.
                   </audio>
                </div>
              </div>
            </blockquote>
            <div className="mt-4 text-right text-[10px] sm:text-xs font-sans text-gray-500 uppercase tracking-wider font-bold">
              Source: apollojournals.org
            </div>

            <p className="mt-10">
              Now, the Artemis program aims to close that gap. After several delays, NASA has finally launched humans towards the Moon on April 1st, 2026. As many commentators noted, Artemis II is more than a mission - it is a declaration that the era of deep space exploration has been reborn.
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
            <div className="mt-4 text-right text-[10px] sm:text-xs font-sans text-gray-500 uppercase tracking-wider font-bold">
              Data & Biographies Source: NASA / CSA
            </div>
          </section>

          {/* The Hardware Section */}
          <article className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed text-justify mb-10">
            <p>
              To break the bonds of Earth's gravity, you need immense power. Enter the Space Launch System (SLS), a super heavy-lift launch vehicle that stands as the modern successor to the Saturn V. While it utilizes legacy Space Shuttle technology, including its famously efficient RS-25 engines and elongated solid rocket boosters, it is an entirely new beast designed explicitly for deep space.
            </p>
            <br></br>
            <p>
              The interactive schematic below details what it takes to propel the Orion spacecraft, the crew's temporary home, out of Earth's orbit and toward the lunar surface.
            </p>
          </article>

          {/* Interactive Rocket SVG */}
          <section className="mb-16 border-t-2 border-b-2 border-black py-8 bg-white">
            <SectionHeader icon={Rocket} title="Interactive Schematic of The SLS Rocket" />
            <RocketGraphic />
          </section>

          {/* The Orion Spacecraft Section */}
          <article className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed text-justify mb-10">
            <p>
              Once the towering SLS has completed its job of breaking Earth's gravitational grip, the Orion spacecraft will separate and carry the crew the rest of the way. Unlike capsules designed for Low Earth Orbit, Orion is purpose-built for deep space. It features state-of-the-art life support, enhanced radiation protection, and a heat shield capable of withstanding the blistering 1,650 °C temperatures on re-entry into the Earth's atmosphere.
            </p>
          </article>

          {/* Interactive 3D Model: Orion */}
          <section className="bg-white border-2 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="sketchfab-embed-wrapper w-full aspect-video bg-[#111]">
              <iframe 
                title="NASA Orion Spacecraft" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; fullscreen; xr-spatial-tracking" 
                src="https://sketchfab.com/models/1b783d2e242b4021a9ccdce44a051dc3/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_hint=2&dnt=1"
                className="w-full h-full"
              > 
              </iframe> 
            </div>
            <div className="p-4 text-center border-t-2 border-black text-xs md:text-sm font-sans font-bold uppercase tracking-widest text-gray-800 bg-gray-50">
              Interactive 3D Model of The Orion Crew Module and European Service Module
            </div>
          </section>
          <div className="mt-4 text-right text-[10px] sm:text-xs font-sans text-gray-500 uppercase tracking-wider font-bold">
              3D Model Source: MechLab3D
          </div>

          {/* The Journey Section */}
          <article className="mt-10 prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed text-justify mb-10">
            <p>
              The 10-day odyssey of Artemis II is a complex ballet of orbital mechanics. Unlike the direct Apollo missions, Artemis II employed a highly elliptical High Earth Orbit (HEO) to test the life support systems before committing to the translunar coast.
            </p>
            <br></br>
            <p>
              The massive Trans-Lunar Injection (TLI) burn set Orion on a "free-return trajectory." This means the spacecraft will use the Moon's gravity to slingshot itself back to Earth, requiring no major propulsion to safely return home. The crew will pass within 6,543 km of the lunar surface observing the far side of the Moon and traveling about 406,772 km far from home, pushing humans further into the solar system than ever before.
            </p>
          </article>

          {/* Interactive Timeline SVG */}
          <section className="mb-16">
            <SectionHeader icon={Map} title="The Timeline of the 10-Day Odyssey" />
            <TimelineGraphic />
          </section>

          {/* Future Section */}
          <article className="prose prose-lg md:prose-xl max-w-none text-gray-900 leading-relaxed text-justify mb-16">
            <p>
              Artemis II is merely the prologue. When astronaut Koch was asked in an interview <i>"What do you hope [the history of the Artemis II mission] says?"</i> she simply answered: <i>"I hope they forget all about Artemis II."</i> As she later added in unanimity with her colleagues, Artemis II is mainly about enabling the next missions that ultimately aim to put a man on Mars.
            </p>
            <br></br>
            <p>
              If the Artemis II mission successfully completes its journey, the next mission, Artemis III will test one or both commercial landers from SpaceX and Blue Origin in 2027, with Artemis IV hoping to return boots to the lunar surface by early 2028. 
            </p>
            <br></br>
            <p>
              Ultimately, the lessons learned from the Artemis missions will serve as the stepping stones for humanity's next great leap - a crewed mission to Mars.
            </p>
          </article>

          {/* Artemis Logo Meaning Graphic */}
          <section className="mb-16 pt-8 border-t-2 border-black">
            <SectionHeader icon={Info} title="The Artemis Identity" />
            <div className="bg-white border-2 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <img 
                src="/artemis.jpg" 
                alt="Artemis Logo Meaning" 
                className="w-full h-auto border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = '/artemis.png'; // Fallback just in case file was saved as .png
                  e.currentTarget.onerror = null;
                }}
              />
              <div className="p-4 text-center text-xs sm:text-sm font-sans uppercase tracking-widest text-gray-700 font-bold bg-gray-50 border-t border-gray-200">
                The symbolism behind the Artemis program identity
              </div>
            </div>
            <div className="mt-4 text-right text-[10px] sm:text-xs font-sans text-gray-500 uppercase tracking-wider font-bold">
              Image Source: NASA
            </div>
          </section>

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
          <div className={`relative overflow-hidden w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${member.color}`}>
             {/* Initials Fallback (Now underneath the image) */}
             <span className="text-xl sm:text-2xl font-black font-sans tracking-widest absolute inset-0 flex items-center justify-center z-0">{member.initials}</span>
             
             {/* Profile Picture Implementation */}
             <img 
               src={member.photoUrl} 
               alt={member.name}
               className="absolute inset-0 w-full h-full object-cover z-10 bg-white"
               onError={(e) => {
                 e.currentTarget.style.display = 'none';
               }}
             />
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
  const [stage, setStage] = useState('sls');

  const getStageClass = (id) => `cursor-pointer transition-all duration-300 ${
    stage === id || stage === 'sls'
      ? 'opacity-100 stroke-[4px]' 
      : 'opacity-50 hover:opacity-80 stroke-[2px]'
  }`;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-black p-4 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
        
        {/* Left: Interactive Schematic SVG */}
        <div className="flex justify-center h-[500px] md:h-[600px] bg-slate-900 rounded border border-gray-300 p-4 relative pattern-grid-lg overflow-hidden">
          {/* Helper text overlay */}
          <div className="absolute bottom-4 left-4 bg-white border border-black px-3 py-1 font-sans text-xs uppercase font-bold flex items-center gap-2 shadow-sm z-10 pointer-events-none">
             <Info className="w-3 h-3" /> Select a component
          </div>

          <svg viewBox="0 0 400 800" className="w-full h-full drop-shadow-2xl cursor-pointer" onClick={() => setStage('sls')}>
            {/* Launch Pad Base */}
            <rect x="80" y="730" width="240" height="20" fill="#1e293b" rx="2" stroke="#0f172a" strokeWidth="2" />
            <rect x="180" y="710" width="40" height="20" fill="#334155" stroke="#0f172a" strokeWidth="2" />

            {/* RS-25 Engines */}
            <g onClick={(e) => { e.stopPropagation(); setStage('engines'); }} className={getStageClass('engines')}>
              <rect x="169" y="700" width="6" height="5" fill="#64748b" stroke="#0f172a" />
              <path d="M 169 705 L 175 705 L 179 725 L 165 725 Z" fill="#475569" stroke="#0f172a" />
              <rect x="186" y="700" width="6" height="5" fill="#64748b" stroke="#0f172a" />
              <path d="M 186 705 L 192 705 L 196 725 L 182 725 Z" fill="#475569" stroke="#0f172a" />
              <rect x="208" y="700" width="6" height="5" fill="#64748b" stroke="#0f172a" />
              <path d="M 208 705 L 214 705 L 218 725 L 204 725 Z" fill="#475569" stroke="#0f172a" />
              <rect x="225" y="700" width="6" height="5" fill="#64748b" stroke="#0f172a" />
              <path d="M 225 705 L 231 705 L 235 725 L 221 725 Z" fill="#475569" stroke="#0f172a" />
            </g>

            {/* Solid Rocket Boosters (SRBs) */}
            <g onClick={(e) => { e.stopPropagation(); setStage('srb'); }} className={getStageClass('srb')}>
              {/* Left SRB */}
              <rect x="139" y="280" width="26" height="440" fill="#f8fafc" stroke="#0f172a" rx="2"/>
              <polygon points="139,280 152,230 165,280" fill="#cbd5e1" stroke="#0f172a"/>
              <rect x="139" y="380" width="26" height="8" fill="#94a3b8" stroke="#0f172a"/>
              <rect x="139" y="500" width="26" height="8" fill="#94a3b8" stroke="#0f172a"/>
              <rect x="139" y="620" width="26" height="8" fill="#94a3b8" stroke="#0f172a"/>
              
              {/* Right SRB */}
              <rect x="235" y="280" width="26" height="440" fill="#f8fafc" stroke="#0f172a" rx="2"/>
              <polygon points="235,280 248,230 261,280" fill="#cbd5e1" stroke="#0f172a"/>
              <rect x="235" y="380" width="26" height="8" fill="#94a3b8" stroke="#0f172a"/>
              <rect x="235" y="500" width="26" height="8" fill="#94a3b8" stroke="#0f172a"/>
              <rect x="235" y="620" width="26" height="8" fill="#94a3b8" stroke="#0f172a"/>
            </g>

            {/* Core Stage */}
            <g onClick={(e) => { e.stopPropagation(); setStage('core'); }} className={getStageClass('core')}>
              <rect x="165" y="300" width="70" height="400" fill="#ea580c" stroke="#0f172a" rx="2"/>
              <rect x="165" y="340" width="70" height="15" fill="#c2410c" stroke="#0f172a"/>
              <rect x="165" y="440" width="70" height="4" fill="#c2410c" stroke="#0f172a"/>
              <rect x="165" y="620" width="70" height="4" fill="#c2410c" stroke="#0f172a"/>
              <text x="200" y="520" fill="#9a3412" fontSize="24" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90 200 520)">SLS</text>
            </g>

            {/* LVSA (Launch Vehicle Stage Adapter) */}
            <g onClick={(e) => { e.stopPropagation(); setStage('lvsa'); }} className={getStageClass('lvsa')}>
              <polygon points="165,300 235,300 223,240 177,240" fill="#ea580c" stroke="#0f172a"/>
              <rect x="177" y="285" width="46" height="3" fill="#c2410c" opacity="0.5"/>
            </g>

            {/* ICPS */}
            <g onClick={(e) => { e.stopPropagation(); setStage('icps'); }} className={getStageClass('icps')}>
              <rect x="177" y="190" width="46" height="50" fill="#e2e8f0" stroke="#0f172a"/>
              <rect x="177" y="230" width="46" height="4" fill="#cbd5e1" stroke="#0f172a"/>
            </g>

            {/* Orion Spacecraft */}
            <g onClick={(e) => { e.stopPropagation(); setStage('orion'); }} className={getStageClass('orion')}>
              {/* Service Module */}
              <rect x="177" y="150" width="46" height="40" fill="#cbd5e1" stroke="#0f172a"/>
              <rect x="174" y="160" width="52" height="4" fill="#334155" stroke="#0f172a"/>
              <rect x="174" y="175" width="52" height="4" fill="#334155" stroke="#0f172a"/>
              {/* Capsule */}
              <polygon points="177,150 223,150 213,120 187,120" fill="#f8fafc" stroke="#0f172a"/>
            </g>

            {/* Launch Abort System (LAS) */}
            <g onClick={(e) => { e.stopPropagation(); setStage('las'); }} className={getStageClass('las')}>
              <polygon points="187,120 213,120 204,60 196,60" fill="#f8fafc" stroke="#0f172a"/>
              <rect x="194" y="55" width="12" height="5" fill="#e2e8f0" stroke="#0f172a" rx="1" />
              <rect x="197" y="20" width="6" height="35" fill="#f8fafc" stroke="#0f172a"/>
              <polygon points="197,20 203,20 200,5" fill="#f8fafc" stroke="#0f172a"/>
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
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.entries(rocketStages[stage].stats).map(([key, value]) => (
                <div key={key} className="border-t-2 border-black pt-2">
                  <div className="text-gray-500 font-sans text-xs font-bold mb-1 uppercase tracking-widest">{key}</div>
                  <div className="text-xl font-sans font-bold text-black">{value}</div>
                </div>
              ))}
            </div>

            <a href="https://www.nasa.gov/humans-in-space/space-launch-system/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase text-blue-600 hover:text-blue-800 transition-colors">
              Learn more about SLS <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>
      <div className="mt-4 text-right text-[10px] sm:text-xs font-sans text-gray-500 uppercase tracking-wider font-bold">
        Schematic & Technical Data Source: NASA
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
    <div className="flex flex-col">
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
      <div className="mt-4 text-right text-[10px] sm:text-xs font-sans text-gray-500 uppercase tracking-wider font-bold">
        Mission Profile & Orbit Data Source: NASA
      </div>
    </div>
  );
}