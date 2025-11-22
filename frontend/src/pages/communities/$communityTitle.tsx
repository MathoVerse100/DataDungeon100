import { exploreLogo } from "../../assets/assets";
import CommunityPostCard from "../../components/communityPostCard";
import CommunitySkeleton from "./__communitySkeleton";
// import FilterDropdowns from "./__filterDropdowns";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CommunityFeedFilterDropdown from "../../components/communityFeedFilterDropdown";
import { useState } from "react";
import type { QueryParams } from "./$communityTitle/$postId";
import Dropdown from "../../components/dropdown";

interface Post {
  community_title: string;
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  title: string;
  tags: string[];
  content: string;
  likes: number;
  dislikes: number;
}

function CommunityTitlePosts() {
  const params = useParams();
  const communityTitle = params.communityTitle;

  const queryParamsFiltersPrettyMapping = {
    created_at: "Creation Date",
    likes: "Likes",
    dislikes: "Dislikes",
  };

  const queryParamsSortsPrettyMapping = {
    ascending: "↑",
    descending: "↓",
  };

  const [queryParams, setQueryParams] = useState<QueryParams>({
    filterValue: "likes",
    sortValue: "descending",
  });

  function handleQueryParams({
    filter,
    sort,
  }: {
    filter: "likes" | "dislikes" | "created_at";
    sort: "ascending" | "descending";
  }) {
    setQueryParams({ filterValue: filter, sortValue: sort });
  }

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["communityPosts", queryParams],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/api/communities/${communityTitle}/posts?filter=${queryParams.filterValue}&sort=${queryParams.sortValue}`
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
    <>
      <div className="[@media(min-width:480px)]:mt-[2rem] px-[0.5em] py-[1em] bg-black sticky top-0 flex flex-row justify-stretch items-center border-b-[1px] border-b-gray-800">
        <CommunityFeedFilterDropdown title="" isSmallCompatible={false}>
          <Dropdown
            className="mx-[2em] mt-[0.5em]"
            defaultDisplay={`${
              queryParamsFiltersPrettyMapping[queryParams.filterValue]
            } ${queryParamsSortsPrettyMapping[queryParams.sortValue]}`}
            sections={[
              {
                name: "Filter By",
                default: "Likes",
                options: [
                  {
                    name: "Created At",
                    onClick: () =>
                      handleQueryParams({
                        filter: "created_at",
                        sort: queryParams.sortValue,
                      }),
                  },
                  {
                    name: "Likes",
                    onClick: () =>
                      handleQueryParams({
                        filter: "likes",
                        sort: queryParams.sortValue,
                      }),
                  },
                  {
                    name: "Dislikes",
                    onClick: () =>
                      handleQueryParams({
                        filter: "dislikes",
                        sort: queryParams.sortValue,
                      }),
                  },
                ],
              },
              {
                name: "Sort By",
                default: "Likes",
                options: [
                  {
                    name: "Ascending",
                    onClick: () =>
                      handleQueryParams({
                        filter: queryParams.filterValue,
                        sort: "ascending",
                      }),
                  },
                  {
                    name: "Descending",
                    onClick: () =>
                      handleQueryParams({
                        filter: queryParams.filterValue,
                        sort: "descending",
                      }),
                  },
                ],
              },
            ]}
          />
        </CommunityFeedFilterDropdown>
        <CommunityFeedFilterDropdown title="" isSmallCompatible={true}>
          <Dropdown
            className="mx-[2em] mt-[2em]"
            defaultDisplay={`${
              queryParamsFiltersPrettyMapping[queryParams.filterValue]
            } ${queryParamsSortsPrettyMapping[queryParams.sortValue]}`}
            sections={[
              {
                name: "Filter By",
                default: "Likes",
                options: [
                  {
                    name: "Created At",
                    onClick: () =>
                      handleQueryParams({
                        filter: "created_at",
                        sort: queryParams.sortValue,
                      }),
                  },
                  {
                    name: "Likes",
                    onClick: () =>
                      handleQueryParams({
                        filter: "likes",
                        sort: queryParams.sortValue,
                      }),
                  },
                  {
                    name: "Dislikes",
                    onClick: () =>
                      handleQueryParams({
                        filter: "dislikes",
                        sort: queryParams.sortValue,
                      }),
                  },
                ],
              },
              {
                name: "Sort By",
                default: "Likes",
                options: [
                  {
                    name: "Ascending",
                    onClick: () =>
                      handleQueryParams({
                        filter: queryParams.filterValue,
                        sort: "ascending",
                      }),
                  },
                  {
                    name: "Descending",
                    onClick: () =>
                      handleQueryParams({
                        filter: queryParams.filterValue,
                        sort: "descending",
                      }),
                  },
                ],
              },
            ]}
          />
        </CommunityFeedFilterDropdown>
      </div>

      {data.map((post: Post, index: number) => {
        return (
          <CommunityPostCard
            key={index}
            userProfilePicture={exploreLogo}
            communityTitle={post.community_title.toLowerCase()}
            postId={post.id}
            firstName={post.first_name}
            lastName={post.last_name}
            username={post.username}
            title={post.title}
            tags={post.tags}
            content={post.content}
            likes={post.likes}
            dislikes={post.dislikes}
          />
        );
      })}
    </>
  );
}

export default function CommunityTitle() {
  return (
    <CommunitySkeleton>
      <CommunityTitlePosts />
    </CommunitySkeleton>
  );
}
