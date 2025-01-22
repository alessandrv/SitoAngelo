import logo from './logo.svg';
import './App.css';
import Waves from './blocks/Backgrounds/Waves/Waves.jsx';
import SplitText from "./blocks/TextAnimations/SplitText/SplitText.jsx";
import FadeContent from './blocks/Animations/FadeContent/FadeContent.jsx'
import { useState, useEffect } from 'react';
import Noise from './blocks/Animations/Noise/Noise.jsx'
import SpotlightCard from './blocks/Components/SpotlightCard/SpotlightCard.jsx';
import StarBorder from './blocks/Animations/StarBorder/StarBorder.jsx'
import LogoWall from './blocks/Components/LogoWall/LogoWall.jsx';
import BookingModal from './blocks/Components/BookingModal/BookingModal';



function App() {
  const [isVisible, setIsVisible] = useState(true);
  const [showMainContent, setShowMainContent] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);

  useEffect(() => {
    // After 3 seconds, start the docking animation
    const timer = setTimeout(() => {
      setIsDocked(true);
      // After docking animation, show main content
      setTimeout(() => {
        setShowMainContent(true);
      }, 1000); // Wait 1 second after docking starts
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
    };

  const handleBookSystem = (systemName) => {
    setSelectedSystem(systemName);
    setIsBookingModalOpen(true);
  };

  return (
    <div style={{backgroundColor: 'black', width: '100vw', height: '100vh', overflow: 'hidden'}} 
         className="App relative">
      <Waves
        lineColor="grey"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      
      <div className={`transition-all duration-1000 absolute z-10 w-full
        ${isDocked 
          ? 'top-8 text-2xl' 
          : 'top-1/2 -translate-y-1/2 text-4xl'}`}>
        <FadeContent 
          blur={true} 
          duration={2000} 
          easing="ease-in-out" 
          initialOpacity={0}>
          <SplitText
            text="AUDIO SYSTEMS"
            className="font-bold text-center text-white"
            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            easing="easeOutCubic"
            threshold={0}
            rootMargin="0px"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </FadeContent>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-1000 w-full px-4 md:px-8
        ${showMainContent 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20'}`}>
        <FadeContent 
          blur={true} 
          duration={1000} 
          easing="ease-in-out" 
          initialOpacity={0}
          show={showMainContent}>
          <div className="bg-[#111111] backdrop-blur-sm rounded-lg p-4 md:p-8 mt-16 md:mt-24 h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] overflow-auto select-text pointer-events-auto max-w-7xl mx-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white text-center">Professional Audio Solutions</h2>
              <p className="text-base md:text-lg mb-8 md:mb-12 text-white text-center mx-auto max-w-3xl">
                We specialize in delivering exceptional sound experiences through state-of-the-art audio systems. 
                Whether you're hosting an intimate gathering or a large-scale event, our carefully curated selection 
                of sound systems ensures pristine audio quality and powerful performance for any occasion.
              </p>

              {/* Systems Grid */}
              <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8">
                <div className="break-inside-avoid">
                  <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Compact Elite Series</h3>
                    <img 
                      src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" 
                      alt="Compact Elite Series" 
                      className="w-full h-48 md:h-64 object-cover rounded-lg mb-3 md:mb-4"
                    />
                    <p className="text-base md:text-lg mb-3 md:mb-4 text-white">
                      A versatile 2.1 system featuring premium satellite speakers and a powerful subwoofer. 
                      Delivers crystal-clear highs and deep, controlled bass in a compact form factor. 
                      Perfect for spaces up to 100m².
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-white">Ideal for:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Private Parties', 'Weddings', 'Club Nights'].map((use) => (
                          <span key={use} className="bg-white/10 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm text-white">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                    <StarBorder
as="button"
onClick={() => handleBookSystem("Compact Elite Series")}

className="custom-class"
color="cyan"
speed="5s"
>
BOOK THIS SYSTEM
</StarBorder>
                   
                  </SpotlightCard>
                </div>
                <div className="break-inside-avoid">
                  <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Pro Performance Array</h3>
                    <img 
                      src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" 
                      alt="Pro Performance Array" 
                      className="w-full h-48 md:h-64 object-cover rounded-lg mb-3 md:mb-4"
                    />
                    <p className="text-base md:text-lg mb-3 md:mb-4 text-white">
                      A professional line array system with dual 18" subwoofers. 
                      Engineered for exceptional clarity and coverage across large spaces. 
                      Includes advanced DSP processing for optimal sound shaping.
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-white">Ideal for:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Dance Events', 'Festival Stages', 'Club Nights'].map((use) => (
                          <span key={use} className="bg-white/10 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm text-white">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                    <StarBorder
as="button"
onClick={() => handleBookSystem("Pro Performance Array")}

className="custom-class"
color="cyan"
speed="5s"
>
BOOK THIS SYSTEM
</StarBorder>
                  
                  </SpotlightCard>
                </div>
                <div className="break-inside-avoid">
                  <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">Ultra Flex System</h3>
                    <img 
                      src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" 
                      alt="Ultra Flex System" 
                      className="w-full h-48 md:h-64 object-cover rounded-lg mb-3 md:mb-4"
                    />
                    <p className="text-base md:text-lg mb-3 md:mb-4 text-white">
                      A modular system that can scale from intimate to large setups. 
                      Features intelligent power management and wireless control capabilities. 
                      Includes mid-high cabinets and matching subwoofers.
                    </p>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-white">Ideal for:</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Private Parties', 'Dance Events', 'Weddings'].map((use) => (
                          <span key={use} className="bg-white/10 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm text-white">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                    <StarBorder
as="button"
onClick={() => handleBookSystem("Ultra Flex System")}

className="custom-class"
color="cyan"
speed="5s"
>
BOOK THIS SYSTEM
</StarBorder>
                   
                  </SpotlightCard>
                </div>
                
              </div>

              {/* Reviews Section */}
              <div className="mt-16 md:mt-24">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white text-center">What Our Clients Say</h2>
                
                {/* Reviews in LogoWall */}
                <div style={{height: '200px', width: '100%', position: 'relative'}}>
                  <LogoWall
                    items={[
                      {
                        component: (
                          <div className="bg-black/30 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                              <div className="text-yellow-400">★★★★★</div>
                            </div>
                            <p className="text-white mb-4">"The sound quality was absolutely incredible. Perfect for our wedding reception!"</p>
                            <div className="text-gray-400">
                              <p className="font-semibold">Sarah M.</p>
                              <p className="text-sm">Wedding Event</p>
                            </div>
                          </div>
                        )
                      },
                      {
                        component: (
                          <div className="bg-black/30 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                              <div className="text-yellow-400">★★★★★</div>
                            </div>
                            <p className="text-white mb-4">"Professional setup and amazing bass response. The crowd loved it!"</p>
                            <div className="text-gray-400">
                              <p className="font-semibold">David K.</p>
                              <p className="text-sm">Club Night</p>
                            </div>
                          </div>
                        )
                      },
                      {
                        component: (
                          <div className="bg-black/30 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                              <div className="text-yellow-400">★★★★★</div>
                            </div>
                            <p className="text-white mb-4">"Crystal clear sound even in a large venue. Exceeded our expectations!"</p>
                            <div className="text-gray-400">
                              <p className="font-semibold">Michael R.</p>
                              <p className="text-sm">Festival Stage</p>
                            </div>
                          </div>
                        )
                      }
                    ]}
                    direction='horizontal'
                    pauseOnHover={true}
                    size='clamp(15rem, 1rem + 20vmin, 25rem)'
                    duration='40s'
                    bgColor='transparent'
                    bgAccentColor='transparent'
                  />
                </div>
                </div>
            </div>
          </div>
        </FadeContent>
      </div>
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        systemName={selectedSystem}
      />
    </div>
  );
}

export default App;
