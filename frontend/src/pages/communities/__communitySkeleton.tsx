import {
  exampleBannerLogo,
  exampleProfilePictureLogo,
} from "../../assets/assets";
import CommunityBanner from "../../components/communityBanner";
import CommunityMainLayout from "../../layouts/communityMainLayout";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import type { ReactNode } from "react";
import CommunityAside from "./__communityAside";

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
  return (
    <CommunityMainLayout>
      <CommunityMainLayout.Feed>
        <CommunityHeader />
        {children}
      </CommunityMainLayout.Feed>

      <CommunityMainLayout.Aside>
        <CommunityAside />
      </CommunityMainLayout.Aside>
    </CommunityMainLayout>
  );
}
