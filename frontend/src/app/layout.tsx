import { Children, isValidElement } from "react";

import SidebarSkeleton from "../components/sidebarSkeleton";
import SidebarMenuGroup from "../components/sidebarMenuGroup";
import NavButton from "../components/navButton";
import SearchBar from "../components/searchBar";

import homeLogo from "../assets/home.png";
import exploreLogo from "../assets/explore.png";
import oneLogo from "../assets/one.png";
import libraryLogo from "../assets/monk.png";
import communitiesLogo from "../assets/community.png";
import universityLogo from "../assets/university.png";
import monkLogo from "../assets/monk.png";
import projectsLogo from "../assets/projects.png";
import storageLogo from "../assets/storage.png";
import studyZoneLogo from "../assets/study_zone.png";
import historyLogo from "../assets/history.png";
import helpLogo from "../assets/help.png";
import settingsLogo from "../assets/settings.png";
import tosLogo from "../assets/tos.png";
import menuLogo from "../assets/menu.png";
import chatsLogo from "../assets/chats.png";
import lightDarkModeLogo from "../assets/light_dark_mode.png";
import languageLogo from "../assets/language.png";
import bellLogo from "../assets/bell.png";
import tripleDotsLogo from "../assets/triple_dots.png";
import TopNavbar from "../components/topNavbar";
import type { ReactNode } from "react";

type LayoutProps = {
  hideInnerSidebar?: boolean;
  mainBodyLimited?: boolean;
  children: ReactNode;
};

const InnerSidebar = ({ children }: { children: ReactNode }) => <>{children}</>;
const Main = ({ children }: { children: ReactNode }) => <>{children}</>;

export default function Layout({
  mainBodyLimited = false,
  hideInnerSidebar = true,
  children,
}: LayoutProps) {
  let innerSidebar: ReactNode = null;
  let main: ReactNode = null;

  Children.forEach(children, (child) => {
    if (!isValidElement<{ children: ReactNode }>(child)) return;

    if (child.type === Layout.InnerSidebar) innerSidebar = child.props.children;
    if (child.type === Layout.Main) main = child.props.children;
  });

  return (
    <div className="flex flex-row justify-stretch items-stretch">
      <SidebarSkeleton outer={true}>
        <div className="w-[50%] aspect-[1/1] h-auto bg-white bg-opacity-50 rounded-[50%]"></div>

        <SidebarMenuGroup
          header_content=""
          buttons={[
            {
              type: "expand",
              content: "Home",
              logo: homeLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "Explore",
              logo: exploreLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "Find People",
              logo: exploreLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "Login",
              logo: oneLogo,
              iconSize: "cover",
            },
          ]}
        />

        <SidebarMenuGroup
          header_content="Discovery"
          buttons={[
            {
              type: "expand",
              content: "Library",
              logo: libraryLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "Communities",
              logo: communitiesLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "University",
              logo: universityLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "MonK",
              logo: monkLogo,
              iconSize: "cover",
            },
          ]}
        />
        <SidebarMenuGroup
          header_content="Personal"
          buttons={[
            {
              type: "expand",
              content: "Projects",
              logo: projectsLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "Storage",
              logo: storageLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "Study Zone",
              logo: studyZoneLogo,
              iconSize: "cover",
            },
          ]}
        />
        <SidebarMenuGroup
          header_content="Configuration"
          buttons={[
            {
              type: "expand",
              content: "History",
              logo: historyLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "Help",
              logo: helpLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "Settings",
              logo: settingsLogo,
              iconSize: "cover",
            },
            {
              type: "expand",
              content: "ToS",
              logo: tosLogo,
              iconSize: "cover",
            },
          ]}
        />
      </SidebarSkeleton>

      <div className="flex flex-col justify-stretch items-stretch flex-1">
        <TopNavbar>
          <NavButton type="circle" logo={menuLogo} iconSize="50%" content="" />
          <SearchBar />
          <div className="flex-1 hidden [@media(min-width:480px)]:block"></div>
          <div className="h-full w-full flex-[0_0_0] flex flex-row justify-stretch items-center gap-[1em]">
            <NavButton
              type="circle"
              logo={chatsLogo}
              iconSize="50%"
              content=""
              classNames="hidden sm:block"
            />
            <NavButton
              type="circle"
              logo={lightDarkModeLogo}
              iconSize="75%"
              content=""
              classNames="hidden sm:block"
            />
            <NavButton
              type="circle"
              logo={languageLogo}
              iconSize="50%"
              content=""
              classNames="hidden sm:block"
            />
            <NavButton
              type="circle"
              logo={bellLogo}
              iconSize="50%"
              content=""
              classNames="hidden sm:block"
            />
            <NavButton
              type="circle"
              logo={tripleDotsLogo}
              iconSize="50%"
              content=""
              classNames="block sm:hidden"
            />
          </div>
        </TopNavbar>
        <div className="flex flex-row justify-stretch items-stretch flex-1">
          {!hideInnerSidebar ? (
            <SidebarSkeleton outer={false}>{innerSidebar}</SidebarSkeleton>
          ) : (
            <></>
          )}

          <div className="flex-1 flex flex-row justify-stretch items-start">
            {mainBodyLimited ? (
              <>
                <div className="hidden 2xl:block 2xl:flex-1"></div>
                <div className="max-w-[100rem] flex flex-row justify-stretch items-center">
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
                    {main}
                  </div>
                </div>
                <div className="hidden 2xl:block 2xl:flex-1"></div>
              </>
            ) : (
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
                {main}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Layout.InnerSidebar = InnerSidebar;
Layout.Main = Main;
