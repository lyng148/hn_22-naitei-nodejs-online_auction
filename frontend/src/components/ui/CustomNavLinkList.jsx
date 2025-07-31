import {NavLink} from "react-router-dom";

const CustomNavLinkList = ({ href, className, isActive, children }) => {
  const linkStyles =
    "text-[17px] font-medium cursor-pointer list-none hover:text-green transition-all ease-in-out";
  const activeClass = isActive ? "text-green" : "";

  return (
    <>
      <NavLink
        to={href}
        className={`${className} ${linkStyles} ${activeClass}`}
      >
        {children}
      </NavLink>
    </>
  );
};

export default CustomNavLinkList;