import { type MouseEvent } from "react";

type ActionButtonProps = {
  content: string;
  classNames?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function ActionButton({
  content,
  classNames,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      className={`
            ${classNames ?? ""}
            px-[1em] py-[0.25em] text-white text-sm font-bold font-inter rounded-[1rem]
            transition-all duration-[100ms] hidden sm:block hover:pointer-cursor
        `}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
