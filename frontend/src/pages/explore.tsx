import SidebarMenuGroup from "../components/sidebarMenuGroup";
import Layout from "../layouts/layout";

import {
  homeLogo,
  exploreLogo,
  studyZoneLogo,
  communitiesLogo,
  projectsLogo,
} from "../assets/assets";

export default function Explore() {
  return (
    <Layout mainBodyLimited={false} hideInnerSidebar={false}>
      <Layout.InnerSidebar>
        <SidebarMenuGroup
          header_content="Global Feed"
          buttons={[
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Topic1",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "Topic2",
            },
            {
              type: "expand",
              logo: studyZoneLogo,
              iconSize: "cover",
              content: "Topic3",
            },
            {
              type: "expand",
              logo: communitiesLogo,
              iconSize: "cover",
              content: "Topic4",
            },
            {
              type: "expand",
              logo: projectsLogo,
              iconSize: "cover",
              content: "Topic5",
            },
          ]}
        />
        <SidebarMenuGroup
          header_content="Blogs"
          buttons={[
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Topic1",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "Topic2",
            },
            {
              type: "expand",
              logo: studyZoneLogo,
              iconSize: "cover",
              content: "Topic3",
            },
            {
              type: "expand",
              logo: communitiesLogo,
              iconSize: "cover",
              content: "Topic4",
            },
            {
              type: "expand",
              logo: projectsLogo,
              iconSize: "cover",
              content: "Topic5",
            },
          ]}
        />
        <SidebarMenuGroup
          header_content="News"
          buttons={[
            {
              type: "expand",
              logo: homeLogo,
              iconSize: "cover",
              content: "Topic1",
            },
            {
              type: "expand",
              logo: exploreLogo,
              iconSize: "cover",
              content: "Topic2",
            },
            {
              type: "expand",
              logo: studyZoneLogo,
              iconSize: "cover",
              content: "Topic3",
            },
            {
              type: "expand",
              logo: communitiesLogo,
              iconSize: "cover",
              content: "Topic4",
            },
            {
              type: "expand",
              logo: projectsLogo,
              iconSize: "cover",
              content: "Topic5",
            },
          ]}
        />
      </Layout.InnerSidebar>

      <Layout.Main>
        <h1 className="text-yellow-500 font-bold">
          Some home inner sidebar buttons
        </h1>
      </Layout.Main>
    </Layout>
  );
}
