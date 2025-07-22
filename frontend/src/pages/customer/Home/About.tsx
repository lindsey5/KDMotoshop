import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import * as motion from "motion/react-client"
import { cn } from '../../../utils/utils';
import useDarkmode from '../../../hooks/useDarkmode';
import ProductsGrid from './ProductsGridGallery';
import { Title } from '../../../components/text/Text';

const AboutSection = () => {
  const isDark = useDarkmode();

  return (
    <div className={cn("relative transition-colors duration-600 flex lg:grid grid-cols-2 lg:gap-50 justify-center p-20",
      isDark ? "bg-[#1e1e1e] text-white" : 'bg-white'
    )}>
        <motion.div
          initial={{ opacity: 0, x: -50}}
          whileInView={{ opacity: 1, x: 0}}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Title>ABOUT</Title>
          <p className='max-w-lg text-lg mt-10'>
            <span className='font-bold text-red-600'>KD</span> MOTOSHOP is your motorsports store, offering legit and affordable motorcycle gear and accessories. As a trusted APB & DC Monorack dealer, we proudly carry top brands like EVO, Gille, MT, SEC, Spyder, and Zebra helmets, along with Duhan, Hybriid, MC riding gear and SEC top boxes. We also offer FreedConn intercoms, Motowolf phone holders, and a wide range of motorcycle accessories.
          </p>
          <div className='flex gap-2 mt-10'>
            <LocationOnIcon /> Blk. 2 Lot 19 Phase 1 Pinagsama, Taguig, Philippines
          </div>
          <div className='flex gap-2 mt-4'>
            <EmailIcon />KDmotoshop@gmail.com
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50}}
          whileInView={{ opacity: 1, x: 0}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className='hidden lg:block'>
            <ProductsGrid />
          </div>
        </motion.div>
    </div>
  );
};

export default AboutSection;
