import {
  exampleBannerLogo,
  exampleProfilePictureLogo,
} from "../../assets/assets";
import CommunityBanner from "../../components/communityBanner";
import CommunityMainLayout from "../../layouts/communityMainLayout";
import CommunityAsideLeaderboards from "../../components/communityAsideLeaderboards";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import type { ReactNode } from "react";

type CommunitySkeletonProps = {
  children: ReactNode;
};

function CommunityHeader() {
  const params = useParams();
  const communityTitle = params.communityTitle;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["communityHeader"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/spa/communities/main/${communityTitle}`,
        { withCredentials: true }
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <h1 className="text-white font-roboto text-lg font-bold">
        Error! {error.message}
      </h1>
    );
  }

  return (
    <CommunityBanner
      bannerBackgroundSize="cover"
      bannerBackgroundImage={exampleBannerLogo}
      iconBackgroundSize="cover"
      iconBackgroundImage={exampleProfilePictureLogo}
      communityTitle={data.title}
      communitySubtitle={data.subtitle}
    />
  );
}

export default function CommunitySkeleton({
  children,
}: CommunitySkeletonProps) {
  const params = useParams();
  const communityTitle = params.communityTitle;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["communityHeader"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/spa/communities/main/${communityTitle}`,
        { withCredentials: true }
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <h1 className="text-white font-roboto text-lg font-bold">
        Error! {error.message}
      </h1>
    );
  }

  return (
    <CommunityMainLayout>
      <CommunityMainLayout.Feed>
        <CommunityHeader />
        {children}
      </CommunityMainLayout.Feed>

      <CommunityMainLayout.Aside>
        <section className="px-[1em] py-[1em] border-b-[1px] border-b-gray-800 flex flex-col justify-start items-start gap-[0.5em]">
          <header className="text-lg font-bold text-gray-300 mb-1">
            {data.title}
          </header>
          <p className="text-sm text-gray-500">{data.description}</p>
        </section>

        <section className="px-[1em] py-[1em] border-b-[1px] border-b-gray-800 flex flex-col justify-start items-start gap-[0.5em]">
          <button
            className="
                        w-full rounded-[1rem] flex flex-row justify-center items-center
                        py-[0.5em] bg-gray-800  text-white text-sm font-inter transition-all
                        duration-[200ms] hover:bg-gray-500/25 hover:cursor-pointer
                    "
          >
            Guidelines
          </button>
          <button
            className="
                        w-full rounded-[1rem] flex flex-row justify-center items-center
                        py-[0.5em] bg-gray-800  text-white text-sm font-inter transition-all
                        duration-[200ms] hover:bg-gray-500/25 hover:cursor-pointer
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
