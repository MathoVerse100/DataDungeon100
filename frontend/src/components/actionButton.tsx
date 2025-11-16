type ActionButtonProps = {
  content: string;
};

export default function ActionButton({ content }: ActionButtonProps) {
  return (
    <button
      className={`
            {{ class_names }}
            px-[1em] py-[0.25em] text-white text-sm font-bold font-inter bg-red-500 rounded-[1rem]
            transition-all duration-[100ms] hover:bg-red-800 hidden sm:block
        `}
    >
      {content}
    </button>
  );
}
