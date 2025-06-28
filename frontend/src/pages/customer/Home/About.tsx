import { useEffect, useRef, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';

const AboutSection = () => {
  const headingRef = useRef(null);
  const imageRef = useRef(null);
  const [isVisible, setIsVisible] = useState({ heading: false, image: false });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === headingRef.current) {
              setIsVisible((prev) => ({ ...prev, heading: true }));
            }
            if (entry.target === imageRef.current) {
              setIsVisible((prev) => ({ ...prev, image: true }));
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (headingRef.current) observer.observe(headingRef.current);
    if (imageRef.current) observer.observe(imageRef.current);

    return () => {
      if (headingRef.current) observer.unobserve(headingRef.current);
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center h-screen" id='about'>
      <div className="flex p-15 rounded-md gap-50">
        <div
          ref={headingRef}
          className={isVisible.heading ? 'animate-slide-to-r' : 'opacity-0'}
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-red-600">ABOUT</h1>
          <p className='max-w-lg text-lg mt-10'>
            <span className='font-bold text-red-600'>KD</span> MOTOSHOP is your motorsports store, offering legit and affordable motorcycle gear and accessories. As a trusted APB & DC Monorack dealer, we proudly carry top brands like EVO, Gille, MT, SEC, Spyder, and Zebra helmets, along with Duhan, Hybriid, MC riding gear and SEC top boxes. We also offer FreedConn intercoms, Motowolf phone holders, and a wide range of motorcycle accessories.
          </p>
          <div className='flex gap-2 mt-10'>
            <LocationOnIcon /> Blk. 2 Lot 19 Phase 1 Pinagsama, Taguig, Philippines
          </div>
          <div className='flex gap-2 mt-4'>
            <EmailIcon />KDmotoshop@gmail.com
          </div>
        </div>
        <img
          ref={imageRef}
          className={`hidden md:block h-[500px] ${isVisible.image ? 'animate-slide-to-l' : 'opacity-0'}`}
          src="/bg.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default AboutSection;
