import { Children, isValidElement } from "react";

import SidebarSkeleton from "../components/sidebarSkeleton";
import SidebarMenuGroup from "../components/sidebarMenuGroup";
import NavButton from "../components/navButton";
import SearchBar from "../components/searchBar";

import TopNavbar from "../components/topNavbar";
import type { ReactNode } from "react";

import {
  homeLogo,
  exploreLogo,
  oneLogo,
  libraryLogo,
  communitiesLogo,
  universityLogo,
  monkLogo,
  projectsLogo,
  storageLogo,
  studyZoneLogo,
  historyLogo,
  helpLogo,
  settingsLogo,
  tosLogo,
  menuLogo,
  chatsLogo,
  lightDarkModeLogo,
  languageLogo,
  tripleDotsLogo,
  bellLogo
} from "../assets/assets"

type LayoutProps = {
  hideInnerSidebar?: boolean;
  children: ReactNode;
};

const InnerSidebar = ({ children }: { children: ReactNode }) => <>{children}</>;
const Main = ({ children }: { children: ReactNode }) => <>{children}</>;

export default function Layout({
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
        <div className="w-[50%] aspect-[1/1] h-auto bg-white/50 rounded-[50%]"></div>

        <SidebarMenuGroup
          header_content=""
          buttons={[
            {
              type: "expand",
              content: "Home",
              logo: homeLogo,
              iconSize: "cover",
              url: '/home'
            },
            {
              type: "expand",
              content: "Explore",
              logo: exploreLogo,
              iconSize: "cover",
              url: '/explore'
            },
            {
              type: "expand",
              content: "Find People",
              logo: exploreLogo,
              iconSize: "cover",
              url: '/find_people'
            },
            {
              type: "expand",
              content: "Login",
              logo: oneLogo,
              iconSize: "cover",
              url: '/login'
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
              url: '/library'
            },
            {
              type: "expand",
              content: "Communities",
              logo: communitiesLogo,
              iconSize: "cover",
              url: '/communities'
            },
            {
              type: "expand",
              content: "University",
              logo: universityLogo,
              iconSize: "cover",
              url: '/university'
            },
            {
              type: "expand",
              content: "MonK",
              logo: monkLogo,
              iconSize: "cover",
              url: '/monk'
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
              url: '/projects'
            },
            {
              type: "expand",
              content: "Storage",
              logo: storageLogo,
              iconSize: "cover",
              url: '/storage'
            },
            {
              type: "expand",
              content: "Study Zone",
              logo: studyZoneLogo,
              iconSize: "cover",
              url: '/study_zone'
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
              url: '/history'
            },
            {
              type: "expand",
              content: "Help",
              logo: helpLogo,
              iconSize: "cover",
              url: '/help'
            },
            {
              type: "expand",
              content: "Settings",
              logo: settingsLogo,
              iconSize: "cover",
              url: '/settings'
            },
            {
              type: "expand",
              content: "ToS",
              logo: tosLogo,
              iconSize: "cover",
              url: '/tos'
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

          <div className="flex-1 flex flex-row justify-center items-start">
            {main}
          </div>
        </div>
      </div>
    </div>
  );
}

Layout.InnerSidebar = InnerSidebar;
Layout.Main = Main;
