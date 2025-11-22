import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dislikesLogo, exploreLogo, likesLogo } from "../../../assets/assets";
import Dropdown from "../../../components/dropdown";
import PostReactionButton from "../../../components/postReactionButton";
import CommunityMainLayout from "../../../layouts/communityMainLayout";
import CommunityAside from "../__communityAside";
import PostIdComment, { type CommentObject } from "./__postIdComment";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import CommunityCreateComment from "../../../components/communityCreateComment";

export type QueryParams = {
  filterValue: "likes" | "dislikes" | "created_at";
  sortValue: "ascending" | "descending";
};

export function PostIdPostContent() {
  const navigate = useNavigate();

  const params = useParams();
  const communityTitle = params.communityTitle;
  const postId = params.postId;

  const [fullText, setFullText] = useState(false);
  function handleFullText() {
    setFullText(!fullText);
  }

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["communityPostContent"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/main`
      );
      return response.data;
    },
  });

  const queryClient = useQueryClient();
  const submitPostLikeReaction = useMutation({
    mutationKey: ["communityPostLikesReaction", postId],
    mutationFn: async () => {
      const response = await axios.post(
        `http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/reaction`,
        { name: "likes" },
        { withCredentials: true }
      );

      console.log(response.data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityPostContent"],
      });
    },

    onMutate: () => {
      console.log("IS mutating");
    },

    onError: () => {
      navigate("/login");
    },
  });

  const submitPostDislikeReaction = useMutation({
    mutationKey: ["communityPostDislikesReaction", postId],
    mutationFn: async () => {
      const response = await axios.post(
        `http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/reaction`,
        { name: "dislikes" },
        { withCredentials: true }
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityPostContent"],
      });
    },

    onMutate: () => {
      console.log("IS mutating");
    },

    onError: () => {
      navigate("/login");
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
    <div
      className="
            px-[1em] [@media(min-width:480px)]:px-[2em] py-[1em] w-[100%]
            transition-all duration-[200ms] border-b-[1px] border-b-gray-800
        "
    >
      <section className="w-[100%] flex flex-row justify-start items-center gap-[0.5em]">
        <a
          className="
                    text-white h-[3rem] aspect-[1/1] rounded-[50%]
                "
          style={{
            backgroundImage: `url(${exploreLogo})`,
            backgroundSize: "75%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></a>
        <div className="flex-1 flex flex-col justify-start items-start">
          <span className="text-white text-[1rem] font-bold">
            {data.first_name} {data.last_name}
          </span>
          <span className="text-gray-400 text-[0.75rem] font-bold font-[cursive]">
            <span>Community:</span>{" "}
            <span className="px-[0.75em] text-[0.75em] bg-red-500 rounded-[1rem] text-white -translate-y-[25%]">
              {data.community_title}
            </span>
          </span>
        </div>
      </section>
      <section className="py-[1em] flex flex-col justify-start items-start gap-[1em]">
        <header className="text-white font-bold text-lg sm:text-xl font-roboto">
          {data.title}
        </header>
        <div className="flex flex-row justify-start items-center gap-[1em] flex-wrap">
          {data.tags.map((tag: string, index: number) => {
            return (
              <span
                key={index}
                className="
                            px-2 py-1 rounded-[1rem] text-white font-inter text-xs font-bold
                        "
                style={{
                  backgroundColor: "rgb(65, 59, 255)",
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
        <article
          className="
                        text-sm text-gray-400 break-words text-wrap
                    "
        >
          {data.content.length <= 600 || fullText
            ? data.content
            : `${data.content.slice(0, 600)}.....`}
        </article>
        {data.content.length > 600 ? (
          <button
            className="text-blue-700 hover:underline hover:text-blue-500 hover:cursor-pointer"
            onClick={handleFullText}
          >
            {fullText ? "Collapse" : "Read more..."}
          </button>
        ) : (
          <></>
        )}
      </section>
      <section className="w-[100%] flex flex-row justify-start items-center gap-[1em]">
        <PostReactionButton
          logo={likesLogo}
          iconXCoordinate="50%"
          iconYCoordinate="40%"
          reactionValue={data.likes}
          onClick={() => submitPostLikeReaction.mutate()}
        />

        <PostReactionButton
          logo={dislikesLogo}
          iconXCoordinate="50%"
          iconYCoordinate="75%"
          reactionValue={data.dislikes}
          onClick={() => submitPostDislikeReaction.mutate()}
        />
      </section>
    </div>
  );
}

export function PostIdPostComments({ endpoint }: { endpoint: string }) {
  const queryParamsFiltersPrettyMapping = {
    created_at: "Creation Date",
    likes: "Likes",
    dislikes: "Dislikes",
  };

  const params = useParams();
  const commentId = params.commentId ?? 0;

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
    queryKey: ["communityPostComments", commentId, queryParams],
    queryFn: async () => {
      const response = await axios.get(
        `${endpoint}?filter=${queryParams.filterValue}&sort=${queryParams.sortValue}`
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

      {data.map((comment: CommentObject, index: number) => {
        return <PostIdComment key={index} comment={comment} />;
      })}
    </>
  );
}

export default function PostId() {
  const params = useParams();
  const communityTitle = params.communityTitle;
  const postId = params.postId;

  return (
    <CommunityMainLayout>
      <CommunityMainLayout.Feed>
        <PostIdPostContent />
        <CommunityCreateComment
          filterValue="likes"
          sortValue="descending"
          endpoint={`http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/comments`}
        />
        <PostIdPostComments
          endpoint={`http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/comments`}
        />
      </CommunityMainLayout.Feed>

      <CommunityMainLayout.Aside>
        <CommunityAside />
      </CommunityMainLayout.Aside>
    </CommunityMainLayout>
  );
}
