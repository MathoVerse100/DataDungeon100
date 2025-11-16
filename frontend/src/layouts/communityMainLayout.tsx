import { Children, isValidElement, type ReactNode } from "react";

type CommunityMainLayoutProps = {
  children: ReactNode;
};

const Feed = ({ children }: { children: ReactNode }) => <>{children}</>;
const Aside = ({ children }: { children: ReactNode }) => <>{children}</>;

export default function CommunityMainLayout({
  children,
}: CommunityMainLayoutProps) {
  let feed: ReactNode = null;
  let aside: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement<{ children: ReactNode }>(child)) return;

    if (child.type === CommunityMainLayout.Feed) feed = child.props.children;
    if (child.type === CommunityMainLayout.Aside) aside = child.props.children;
  });

  return (
    <>
      <div
        className="
          relative flex-1 min-w-[15rem] max-w-[90rem] border-r border-r-gray-800
          h-[calc(100vh-4.6875rem)]
          overflow-y-auto overflow-x-hidden
          [scrollbar-gutter:stable]
          [scrollbar-width:thin] [scrollbar-color:#555_#111]
          [&::-webkit-scrollbar]:w-[8px]
          [&::-webkit-scrollbar-track]:bg-[#111]
          [&::-webkit-scrollbar-thumb]:bg-[#555]
          [&::-webkit-scrollbar-thumb:hover]:bg-[#666]
          [&::-webkit-scrollbar-button]:hidden
      "
      >
        {feed}
      </div>
      <aside
        className="
              w-[15rem] h-[calc(100vh-4.6875rem)] hidden lg:block
              flex flex-col justify-start items-start scrollbar-hide
              overflow-x-hidden
          "
      >
        {aside}
      </aside>
    </>
  );
}

CommunityMainLayout.Feed = Feed;
CommunityMainLayout.Aside = Aside;
