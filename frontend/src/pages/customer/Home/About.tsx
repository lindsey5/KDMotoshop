import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import * as motion from "motion/react-client"
import { cn } from '../../../utils/utils';
import { Title } from '../../../components/text/Text';
import Orb from '../../../components/backgrounds/Orb';

const AboutSection = ({ isParallax } : { isParallax : boolean}) => {

  return (
    <div className={cn("min-h-screen relative transition-colors duration-600 flex justify-center lg:justify-end p-10 text-white", !isParallax && 'bg-[url(/bg.png)] bg-cover')}>
          <Orb 
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
          <motion.div
            className='w-[90%] lg:w-[50%] lg:h-[50%] flex flex-col justify-center items-center absolute inset-1/2 transform -translate-1/2'
            initial={{ opacity: 0, y: 50}}
            whileInView={{ opacity: 1, y: 0}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <Title className='text-red-600 xl:text-5xl'>ABOUT</Title>
              <p className='max-w-lg xl:text-xl mt-10'>
                <span className='font-bold text-red-600'>KD</span> MOTOSHOP is your motorsports store, offering legit and affordable motorcycle gear and accessories. As a trusted APB & DC Monorack dealer, we proudly carry top brands like EVO, Gille, MT, SEC, Spyder, and Zebra helmets, along with Duhan, Hybriid, MC riding gear and SEC top boxes. We also offer FreedConn intercoms, Motowolf phone holders, and a wide range of motorcycle accessories.
              </p>
            </div>
            <div className='flex gap-2 mt-10'>
              <LocationOnIcon /> Blk. 2 Lot 19 Phase 1 Pinagsama, Taguig, Philippines
            </div>
            <div className='flex gap-2 mt-4'>
              <EmailIcon />KDmotoshop@gmail.com
            </div>
          </motion.div>
    </div>
  );
};

export default AboutSection;
