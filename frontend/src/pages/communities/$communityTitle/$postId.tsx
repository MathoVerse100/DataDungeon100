import { useQuery } from "@tanstack/react-query";
import { dislikesLogo, exploreLogo, likesLogo } from "../../../assets/assets";
import Dropdown from "../../../components/dropdown";
import PostReactionButton from "../../../components/postReactionButton";
import CommunityMainLayout from "../../../layouts/communityMainLayout";
import CommunityAside from "../__communityAside";
import PostIdComment, { type CommentObject } from "./__postIdComment";
import axios from "axios";
import { useParams } from "react-router-dom";

export function PostIdPostContent() {
  const params = useParams();
  const communityTitle = params.communityTitle;
  const postId = params.postId;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["communityPostContent"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/spa/communities/posts/${communityTitle}/${postId}`
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
                        text-sm text-gray-400 break-words text-wrap line-clamp-5
                    "
        >
          {data.content}
        </article>
        <span className="text-blue-700 hover:underline hover:text-blue-500 hover:cursor-pointer">
          Read more...
        </span>
      </section>
      <section className="w-[100%] flex flex-row justify-start items-center gap-[1em]">
        <PostReactionButton
          logo={likesLogo}
          iconXCoordinate="50%"
          iconYCoordinate="40%"
          reactionValue={data.likes}
        />

        <PostReactionButton
          logo={dislikesLogo}
          iconXCoordinate="50%"
          iconYCoordinate="75%"
          reactionValue={data.dislikes}
        />
      </section>
    </div>
  );
}

export function PostIdPostComments({ endpoint }: { endpoint: string }) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["communityPostComments"],
    queryFn: async () => {
      const response = await axios.get(endpoint);
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
      <section className="flex flex-col justify-stretch items-stretch mt-[1em] mx-[2em]">
        <textarea
          className="
                        outline-none w-full rounded-[1rem] bg-gray-800 bg-opacity-50 text-white p-[1em]
                        text-sm overflow-hidden min-h-[5rem] h-[5rem]
                    "
          placeholder="Create a comment..."
        ></textarea>
        <div
          className="
                            hidden
                            self-end w-full h-[3em] bg-gray-800 bg-opacity-50
                            flex-row justify-stretch items-stretch gap-[1em]
                            rounded-b-[1rem] p-[0.5em] border-t-[1px] border-t-gray-800
                        "
        >
          <button
            className="
                                ml-auto mr-0 bg-blue-500 text-white font-bold text-sm rounded-[1rem] px-[1em]
                                transition-all duration-[200ms] hover:bg-blue-800 
                            "
          >
            Submit
          </button>
          <button
            className="
                                bg-red-500 text-white font-bold text-sm rounded-[1rem] px-[1em]
                                transition-all duration-[200ms] hover:bg-red-800 
                            "
          >
            Cancel
          </button>
        </div>
      </section>
      <Dropdown
        className="mx-[2em] mt-[2em]"
        defaultDisplay="Likes"
        sections={[
          {
            name: "Sort By",
            default: "Likes",
            options: [
              {
                name: "Hot",
              },
              {
                name: "New",
              },
              {
                name: "Old",
              },
              {
                name: "Likes",
              },
              {
                name: "Dislikes",
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
        <PostIdPostComments
          endpoint={`http://localhost:8000/spa/communities/posts/${communityTitle}/${postId}/comments`}
        />
      </CommunityMainLayout.Feed>

      <CommunityMainLayout.Aside>
        <CommunityAside />
      </CommunityMainLayout.Aside>
    </CommunityMainLayout>
  );
}
