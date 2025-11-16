import type { ReactNode } from "react";

type TopNavbarProps = {
  children: ReactNode;
};

export default function TopNavbar({ children }: TopNavbarProps) {
  return (
    <div
      className="h-[4.6875rem] w-full bg-gray-950 bg-opacity-25 border-b-[1px] border-b-gray-500
                p-[0.75em] flex flex-row justify-stretch items-center gap-[1em] text-white"
    >
      {children}
    </div>
  );
}
