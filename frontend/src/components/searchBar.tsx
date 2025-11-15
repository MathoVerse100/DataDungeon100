import NavButton from "./navButton";
import searchLogo from "../assets/search.png";

export default function SearchBar() {
  return (
    <div className="bg-white h-[75%] rounded-[1rem] flex-[2] flex flex-row justify-start items-center text-black">
      <NavButton type="circle" logo={searchLogo} iconSize="50%" content="" />

      <input
        type="text"
        placeholder="Search Statista..."
        className="p-[1em] h-full w-full [@media(max-width:480px)]:rounded-l-[1em] rounded-r-[1em] text-black placeholder-gray-400 outline-none"
      ></input>
    </div>
  );
}
