import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronRight } from "react-icons/fa";
import { useLanguage } from "@/src/context/LanguageContext";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useToolTipPosition from "@/src/hooks/useToolTipPosition";
import Qtip from "../qtip/Qtip";
import { getImageUrl, handleImageError } from "../../utils/imageProxy";

function Cart({ label, data, path }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredItem, data);

  const handleImageEnter = (item, index) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredItem(item.id + index);
  };

  const handleImageLeave = () => {
    setHoverTimeout(
      setTimeout(() => {
        setHoveredItem(null);
      }, 300) 
    );
  };

  return (
    <div className="flex flex-col w-1/4 space-y-7 max-[1200px]:w-full">
      <h1 className="font-bold text-2xl text-[#ffbade] max-md:text-xl">
        {label}
      </h1>
      <div className="w-full space-y-4 flex flex-col">
        {data &&
          data.slice(0, 5).map((item, index) => (
            <div
              key={index}
              style={{ borderBottom: "1px solid rgba(255, 255, 255, .075)" }}
              className="flex pb-4 items-center relative"
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <img
                src={getImageUrl(item.poster, { section: path, forceDirect: true })}
                alt={item.title}
                className="flex-shrink-0 w-[60px] h-[75px] rounded-md object-cover cursor-pointer"
                onClick={() => navigate(`/watch/${item.id}`)}
                onMouseEnter={() => handleImageEnter(item, index)}
                onMouseLeave={handleImageLeave}
                onError={(e) => handleImageError(e, { originalUrl: item.poster })}
              />

              {hoveredItem === item.id + index && window.innerWidth > 1024 && (
                <div
                  className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} 
                    ${
                      tooltipHorizontalPosition === "left-1/2"
                        ? "translate-x-[-100px]"
                        : "translate-x-[-200px]"
                    } 
                    z-[100000] transform transition-all duration-300 ease-in-out 
                    ${
                      hoveredItem === item.id + index
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                  onMouseEnter={() => {
                    if (hoverTimeout) clearTimeout(hoverTimeout); 
                  }}
                  onMouseLeave={handleImageLeave}
                >
                  <Qtip id={item.id} />
                </div>
              )}

              <div className="flex flex-col ml-4">
                <Link
                  to={`/${item.id}`}
                  className="text-[15px] font-semibold hover:text-[#ffbade] line-clamp-1"
                >
                  {language === "EN" ? item.title : item.japanese_title}
                </Link>
                <div className="flex items-center gap-x-2 w-full mt-2 overflow-hidden">
                  <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                    {item.tvInfo?.showType?.split(" ").shift()}
                  </div>
                  <div className="dot"></div>
                  <div className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
                    {item.tvInfo?.duration === "m" ||
                    item.tvInfo?.duration === "?" ||
                    item.duration === "m" ||
                    item.duration === "?"
                      ? "N/A"
                      : item.tvInfo?.duration || item.duration || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Link
        to={`/${path}`}
        className="flex w-fit items-baseline h-fit rounded-3xl gap-x-1 group"
      >
        <p className="text-white text-[17px] h-fit leading-4 group-hover:text-[#ffbade] transform transition-all ease-out">
          View more
        </p>
        <FaChevronRight className="text-white text-[10px] group-hover:text-[#ffbade] transform transition-all ease-out" />
      </Link>
    </div>
  );
}

export default Cart;
