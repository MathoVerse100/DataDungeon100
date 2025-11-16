type DropdownProps = {
  className?: string;
  defaultDisplay: string;
  sections: {
    name: string;
    default: string;
    options: {
      name: string;
    }[];
  }[];
};

export default function Dropdown({
  className,
  defaultDisplay,
  sections,
}: DropdownProps) {
  return (
    <div
      className={`
                dropdown relative ${className ?? ""}
                text-[0.75rem] h-[2.5em] rounded-[1rem] bg-gray-700 bg-opacity-50 py-[0.5em] 
                pl-[1em] pr-[3em] inline-block whitespace-nowrap appearance-none 
                text-white font-bold outline-none
            `}
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
        className="
                    dropdown_view
                    absolute top-0 left-[50%] bg-gray-800
                    flex flex-col -translate-x-[50%] translate-y-[calc(2.5em+1%)]
                "
        style={{ display: "none" }}
      >
        {sections.map((section) => {
          return (
            <section className="dropdown_section">
              <header
                className="
                                dropdown_section_header
                                px-[1em] py-[0.5em] hover:cursor-pointer
                                bg-gray-900 font-bold text-white
                                flex flex-row justify-stretch items-center
                                select-none pointer-events-none
                            "
              >
                {section.name}
              </header>

              {section.options.map((option) => {
                return (
                  <button
                    className="
                                    dropdown_section_option
                                    px-[1em] py-[0.5em] text-white
                                    font-normal transition-all duration-[200ms]
                                    hover:bg-gray-500 hover:bg-opacity-25 w-full
                                    flex flex-row justify-start items-center
                                    select-none hover:cursor-pointer
                                "
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
