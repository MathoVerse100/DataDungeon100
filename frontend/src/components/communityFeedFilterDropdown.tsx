import type { ReactNode } from "react";

type CommunityFeedFilterDropdownProps = {
  isSmallCompatible?: boolean;
  classNames?: string;
  children: ReactNode;
  title: string;
};

export default function CommunityFeedFilterDropdown({
  isSmallCompatible = true,
  classNames,
  title,
  children,
}: CommunityFeedFilterDropdownProps) {
  return (
    <div
      className={`
                ${
                  !isSmallCompatible
                    ? "hidden [@media(min-width:480px)]:flex"
                    : "flex [@media(min-width:480px)]:hidden"
                }
                ${classNames ?? ""}
                flex-col justify-stretch items-center gap-[0]
            `}
    >
      <span className="text-[0.75rem] text-gray-500 font-bold">{title}</span>
      <div className="flex flex-row justify-start items-center">{children}</div>
    </div>
  );
}
