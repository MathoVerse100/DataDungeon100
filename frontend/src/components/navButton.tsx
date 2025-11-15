export type NavButtonProps = {
  type: "circle" | "expand";
  logo: string;
  iconSize: string;
  content: string;
  classNames?: string;
};

export default function NavButton(props: NavButtonProps) {
  return (
    <a
      className={`
                ${
                  props.type === "circle"
                    ? "h-[100%] aspect-[1/1] rounded-[50%]"
                    : "px-2 py-2.5 w-[100%] flex flex-row justify-start items-center gap-[1em] rounded-[1rem]"
                }
                transition-all duration-[200ms]
                hover:bg-gray-900 cursor-pointer active:duration-[100ms] active:scale-[1.05] overflow-hidden
                hover:scale-[1.1] hover:duration-[500ms] hover:ease-[cubic-bezier(0,1.5,.5,1)]
                ${props.classNames ?? ""}
            `}
    >
      <div
        className="h-[100%] aspect-[1/1] flex flex-row justify-start items-center rounded-[50%]"
        style={{
          backgroundImage: `url(${props.logo})`,
          backgroundSize: props.iconSize,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {props.type === "circle" ? null : (
        <div className="flex-1 flex flex-row justify-start items-center">
          <span className="text-white font-inter text-xs">{props.content}</span>
        </div>
      )}
    </a>
  );
}
