import { useEffect, useState } from "react";
import { fetchData } from "../../../services/api";
import { RedButton } from "../../../components/Button";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type TopCategory = {
  totalQuantity: number;
  image: string;
  category: string;
};

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        position: "absolute",
    }),
    center: {
        x: 0,
        opacity: 1,
        position: "relative",
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        position: "absolute",
    }),
};

const PopularCategoriesSection = () => {
  const [categories, setCategories] = useState<TopCategory[]>([]);
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const pageSize = 3;

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetchData("/api/category/top");
      if (response.success) {
        setCategories(response.topCategories);
      }
    };
    getCategories();
  }, []);

  const totalPages = Math.ceil(categories.length / pageSize);

  const paginate = (newDirection: number) => {
    setPage(([prevPage]) => {
      const nextPage = (prevPage + newDirection + totalPages) % totalPages;
      return [nextPage, newDirection];
    });
  };

  const currentCategories = categories.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  return (
    <section className="bg-gray-100 py-20">
      <h1 className="text-center text-5xl font-bold text-red-600 mb-12">
        Popular Categories
      </h1>
      <div className="relative flex justify-center items-center overflow-hidden min-h-[400px]">
        <IconButton
          size="large"
          sx={{
            position: "absolute",
            left: 20,
            zIndex: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          onClick={() => paginate(-1)}
        >
          <ArrowBackIosIcon />
        </IconButton>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
            }}
            className="flex gap-10 justify-center w-full"
          >
            {currentCategories.map((category) => (
              <motion.div
                key={category.category}
                className="flex flex-col gap-5 items-center"
              >
                <img
                  className="w-[300px] h-[300px] rounded-full border-2 border-gray-400 object-cover"
                  src={category.image}
                  alt={category.category}
                />
                <h1 className="text-center font-bold text-red-600 text-xl">
                  {category.category}
                </h1>
                <RedButton>Shop now</RedButton>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <IconButton
          size="large"
          sx={{
            position: "absolute",
            right: 20,
            zIndex: 10,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          onClick={() => paginate(1)}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>

      {/* Dot indicators */}
      <div className="text-center mt-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            onClick={() => setPage([i, i > page ? 1 : -1])}
            className={`inline-block h-3 w-3 mx-1 rounded-full cursor-pointer ${
              i === page ? "bg-red-600" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default PopularCategoriesSection;
