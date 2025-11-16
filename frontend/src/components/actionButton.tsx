type ActionButtonProps = {
  content: string;
  classNames?: string;
};

export default function ActionButton({
  content,
  classNames,
}: ActionButtonProps) {
  return (
    <button
      className={`
            ${classNames ?? ""}
            px-[1em] py-[0.25em] text-white text-sm font-bold font-inter bg-red-500 rounded-[1rem]
            transition-all duration-[100ms] hover:bg-red-800 hidden sm:block
        `}
    >
      {content}
    </button>
  );
}
