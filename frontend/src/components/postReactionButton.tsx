type PostReactionButtonProps = {
  classNames?: string;
  logo: string;
  iconXCoordinate: string;
  iconYCoordinate: string;
  reactionValue: number;
};

export default function PostReactionButton({
  classNames,
  logo,
  iconXCoordinate,
  iconYCoordinate,
  reactionValue,
}: PostReactionButtonProps) {
  return (
    <div
      className={`
                ${classNames ?? ""}
                h-[1.5em] [@media(min-width:480px)]:h-[2em] flex flex-row justify-stretch items-stretch gap-[0.5em]
            `}
    >
      <button
        className="
                    aspect-[1/1] rounded-[50%] transition-all duration-[100ms]
                    hover:cursor-pointer hover:bg-gray-500/25
                    active:bg-gray-800/50
                "
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: "60%",
          backgroundPosition: `${iconXCoordinate} ${iconYCoordinate}`,
          backgroundRepeat: "no-repeat",
        }}
      ></button>
      <span className="flex-1 self-center text-gray-300 text-xs [@media(min-width:480px)]:text-sm font-sans font-bold">
        {reactionValue}
      </span>
    </div>
  );
}
