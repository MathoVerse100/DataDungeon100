import { useState } from "react";

type DropdownProps = {
  className?: string;
  defaultDisplay: string;
  sections: {
    name: string;
    default: string;
    options: {
      name: string;
      onClick: () => void;
    }[];
  }[];
};

export default function Dropdown({
  className,
  defaultDisplay,
  sections,
}: DropdownProps) {
  const [toggle, setToggle] = useState("hidden");

  function handleToggle() {
    setToggle(toggle === "hidden" ? "block" : "hidden");
  }

  return (
    <div
      className={`
                dropdown relative ${className ?? ""}
                text-[0.75rem] h-[2.5em] rounded-[1rem] bg-gray-700 py-[0.5em] 
                pl-[1em] pr-[3em] inline-block bg-gray-700/50 whitespace-nowrap appearance-none 
                text-white font-bold outline-none
            `}
      onClick={handleToggle}
    >
      <span
        className="
                    dropdown_display_text text-white font-bold truncate max-w-[5rem]
                    select-none hover:cursor-pointer
                "
      >
        {defaultDisplay}
      </span>
      <div
        className={`
                    absolute top-0 left-[50%] bg-gray-800 z-[2] ${toggle}
                    flex flex-col -translate-x-[50%] translate-y-[calc(2.5em+1%)]
                `}
      >
        {sections.map((section, index) => {
          return (
            <section key={index} className="dropdown_section">
              <header
                className="
                                px-[1em] py-[0.5em] hover:cursor-pointer
                                bg-gray-900 font-bold text-white
                                flex flex-row justify-stretch items-center
                                select-none pointer-events-none
                            "
              >
                {section.name}
              </header>

              {section.options.map((option, index) => {
                return (
                  <button
                    key={index}
                    className="
                                    px-[1em] py-[0.5em] text-white
                                    font-normal transition-all duration-[200ms]
                                    hover:bg-gray-500/25 w-full
                                    flex flex-row justify-start items-center
                                    select-none hover:cursor-pointer
                                "
                    onClick={option.onClick}
                  >
                    {option.name}
                  </button>
                );
              })}
            </section>
          );
        })}
      </div>
      <span
        className="
                    dropdown_arrow absolute
                    text-[0.75rem] text-white select-none right-3 translate-y-[5%]
                "
      >
        ▼
      </span>
    </div>
  );
}
