import { Outlet } from "react-router-dom";
import Layout from "../layouts/layout";
import SidebarMenuGroup from "../components/sidebarMenuGroup";
import {
  communitiesLogo,
  exploreLogo,
  homeLogo,
  projectsLogo,
  settingsLogo,
  studyZoneLogo,
} from "../assets/assets";

export default function Communities() {
  return (
    <Layout hideInnerSidebar={false}>
      <Layout.InnerSidebar>
        <SidebarMenuGroup
          header_content=""
          buttons={[
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Browse",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "History",
            },
            {
              type: "expand",
              logo: studyZoneLogo,
              iconSize: "cover",
              content: "+ Post",
            },
            {
              type: "expand",
              logo: communitiesLogo,
              iconSize: "cover",
              content: "+ Create",
            },
          ]}
        />
        <SidebarMenuGroup
          header_content="Favorites"
          buttons={[
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Community 1",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "Community 2",
            },
            {
              type: "expand",
              logo: studyZoneLogo,
              iconSize: "cover",
              content: "Community 3",
            },
            {
              type: "expand",
              logo: communitiesLogo,
              iconSize: "cover",
              content: "Community 4",
            },
            {
              type: "expand",
              logo: settingsLogo,
              iconSize: "cover",
              content: "View Al;",
            },
          ]}
        />
        <SidebarMenuGroup
          header_content="Recently Opened"
          buttons={[
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Community 1",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "Community 2",
            },
            {
              type: "expand",
              logo: studyZoneLogo,
              iconSize: "cover",
              content: "Community 3",
            },
            {
              type: "expand",
              logo: communitiesLogo,
              iconSize: "cover",
              content: "Community 4",
            },
            {
              type: "expand",
              logo: projectsLogo,
              iconSize: "cover",
              content: "View All",
            },
          ]}
        />
        <SidebarMenuGroup
          header_content="Following"
          buttons={[
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Community 1",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "Community 2",
            },
            {
              type: "expand",
              logo: studyZoneLogo,
              iconSize: "cover",
              content: "Community 3",
            },
            {
              type: "expand",
              logo: communitiesLogo,
              iconSize: "cover",
              content: "Community 4",
            },
            {
              type: "expand",
              logo: projectsLogo,
              iconSize: "cover",
              content: "View All",
            },
          ]}
        />
        <SidebarMenuGroup
          header_content=""
          buttons={[
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Your Communities",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "Saved Posts",
            },
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Your Communities",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "Saved Posts",
            },
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Your Communities",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "Saved Posts",
            },
          ]}
        />
      </Layout.InnerSidebar>

      <Layout.Main>
        <Outlet />
      </Layout.Main>
    </Layout>
  );
}
