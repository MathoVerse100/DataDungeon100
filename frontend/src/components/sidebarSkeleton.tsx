import type { ReactNode } from "react";

type SidebarSkeletonProps = {
  children: ReactNode;
  outer: boolean;
};

export default function SidebarSkeleton({
  children,
  outer = true,
}: SidebarSkeletonProps) {
  return (
    <div
      className={`
        ${
          outer
            ? `
              hidden xl:flex flex-col justify-start items-center gap-[1em] p-[1em] h-[100vh] w-[12rem]
              bg-gray-800 bg-opacity-25 border-r-[1px] border-r-gray-500
              overflow-y-auto overflow-x-hidden scrollbar-hide
          `
            : `
            hidden md:flex flex-col justify-start items-center gap-[2em] p-[1em] h-[calc(100vh-4.6875rem)] w-[12rem]  
            bg-gray-800 bg-opacity-25 border-r-[1px] border-r-gray-500
            overflow-y-auto overflow-x-hidden scrollbar-hide
          `
        }                
      `}
    >
      {children}
    </div>
  );
}
