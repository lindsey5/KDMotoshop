import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import * as motion from "motion/react-client"

const AboutSection = () => {

  return (
    <div className="relative flex justify-center items-center h-screen" id='about'>
      <div className="flex p-15 rounded-md gap-50">
        <motion.div
          initial={{ opacity: 0, x: -50}}
          whileInView={{ opacity: 1, x: 0}}
          transition={{ duration: 0.6 }}
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
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50}}
          whileInView={{ opacity: 1, x: 0}}
          transition={{ duration: 0.6 }}
        >
          <img
            className="hidden lg:block h-[500px]"
            src="/bg.jpg"
            alt=""
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;
