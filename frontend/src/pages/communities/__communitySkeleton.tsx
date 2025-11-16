import type { ReactNode } from "react";
import {
  exampleBannerLogo,
  exampleProfilePictureLogo,
} from "../../assets/assets";
import CommunityBanner from "../../components/communityBanner";
import CommunityMainLayout from "../../layouts/communityMainLayout";
import CommunityAsideLeaderboards from "../../components/communityAsideLeaderboards";

type CommunitySkeletonProps = {
  children: ReactNode;
};

export default function CommunitySkeleton({
  children,
}: CommunitySkeletonProps) {
  return (
    <CommunityMainLayout>
      <CommunityMainLayout.Feed>
        <CommunityBanner
          bannerBackgroundSize="cover"
          bannerBackgroundImage={exampleBannerLogo}
          iconBackgroundSize="cover"
          iconBackgroundImage={exampleProfilePictureLogo}
          communityTitle="Analytics"
          communitySubtitle="The best, uncontested community for learning, sharing ideas and asking questions related to Mathematics, Physics and Computer Science."
        />
        {children}
      </CommunityMainLayout.Feed>

      <CommunityMainLayout.Aside>
        <section className="px-[1em] py-[1em] border-b-[1px] border-b-gray-800 flex flex-col justify-start items-start gap-[0.5em]">
          <header className="text-lg font-bold text-gray-300 mb-1">
            {/* {{ community_info.title }} */}
            Analytics
          </header>
          <p className="text-sm text-gray-500">
            {/* {{ community_info.description }} */}
            This is some paragraph about this community. This is some paragraph
            about this community. This is some paragraph about this community.
            This is some paragraph about this community.
          </p>
        </section>

        <section className="px-[1em] py-[1em] border-b-[1px] border-b-gray-800 flex flex-col justify-start items-start gap-[0.5em]">
          <button
            className="
                        w-full rounded-[1rem] flex flex-row justify-center items-center
                        py-[0.5em] bg-gray-800  text-white text-sm font-inter transition-all
                        duration-[200ms] hover:bg-gray-500 hover:bg-opacity-25 hover:cursor-pointer
                    "
          >
            Guidelines
          </button>
          <button
            className="
                        w-full rounded-[1rem] flex flex-row justify-center items-center
                        py-[0.5em] bg-gray-800  text-white text-sm font-inter transition-all
                        duration-[200ms] hover:bg-gray-500 hover:bg-opacity-25 hover:cursor-pointer
                    "
          >
            Analytics
          </button>
        </section>

        <CommunityAsideLeaderboards />
      </CommunityMainLayout.Aside>
    </CommunityMainLayout>
  );
}
