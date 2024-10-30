import logo from "../assets/images/Logo.svg";
import { GoogleAuth } from "./GoogleAuth";

function Navbar() {
  function show(): void {
    const dropdown = document.querySelector<HTMLElement>(".dropDown");
    dropdown?.classList.toggle("mobile:hidden");
  }
  return (
    <nav>
      <div className="container mobile:relative  h-[93px] tablet:h-[60px]  text-[18px] tablet:text-[14px]  items-center flex   justify-between">
        <a href="/">
          <img src={logo} />
        </a>
        <button
          onClick={show}
          className="hidden mobile:block mobile:bg-purple mobile:active::rounded-b-[0px] mobile:text-white "
        >
          menu
        </button>

        <div className="flex gap-[40px] mobile:absolute mobile:flex-col  mobile:rounded-b-[8px] z-10 mobile:-bottom-[230px] mobile:p-10 mobile:bg-purple mobile:text-white mobile:w-full mobile:hidden dropDown">
          <a href="/" className="mt-[12px] tablet:mt-[5px] mobile:text-white">
            Home
          </a>
          <a
            href="#footer"
            className="mt-[12px] tablet:mt-[5px] mobile:text-white"
          >
            Contact
          </a>
          <GoogleAuth />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
