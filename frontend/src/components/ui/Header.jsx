import { useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { menulists } from "@/utils/data";
import { useUser } from "@/contexts/UserContext.jsx";
import {Container, CustomNavLink, CustomNavLinkList, UserAvatarDropdown} from "@/components/ui/index.js";

export const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user } = useUser();

  return (
    <>
      <header className='header py-1 bg-primary scrolled'>
        <Container>
          <nav className="p-4 flex justify-between items-center relative">
            <div className="flex items-center gap-14">
              <img src="../../../public/images/common/header-logo.png" alt="LogoImg" className="h-11" />
              <div className="hidden lg:flex items-center justify-between gap-8">
                {menulists.map((list) => (
                  (list.id !== 7 || user?.role === "SELLER") &&
                  (list.id !== 8 || user?.role === "ADMIN") &&
                  (list.id !== 9 || user?.role === "SELLER") &&
                  (
                    <li key={list.id} className="capitalize list-none">
                      <CustomNavLinkList href={list.path} isActive={location.pathname === list.path} className={`${!isHomePage ? "text-black" : "text-white"}`}>
                        {list.link}
                      </CustomNavLinkList>
                    </li>
                  )

                ))}
              </div>
            </div>
            <div className="flex items-center gap-8 icons">
              <div className="hidden lg:flex lg:items-center lg:gap-8">
                <IoSearchOutline size={23} className={`${!isHomePage ? "text-black" : "text-white"}`} />
                {user?.role === "BIDDER" && (
                  <CustomNavLink href="/seller/login" className={`${!isHomePage ? "text-black" : "text-white"}`}>
                  </CustomNavLink>
                )}

                {!user?.role ? (
                  <div className="flex items-center gap-8">
                    <CustomNavLink href="/auth/login" className={`${!isHomePage ? "text-black" : "text-white"}`}>
                      Sign in
                    </CustomNavLink>
                    <CustomNavLink href="/auth/register" className={`${!isHomePage ? "bg-green" : "bg-white"} px-8 py-2 rounded-full text-primary shadow-md`}>
                      Join
                    </CustomNavLink>
                  </div>
                 ) : (
                  <UserAvatarDropdown isHomePage={isHomePage} />
                )}
              </div>
            </div>
          </nav>
        </Container>
      </header>
    </>
  );
};

export default Header;
