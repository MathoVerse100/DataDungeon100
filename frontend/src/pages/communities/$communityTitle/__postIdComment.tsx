import { useState } from "react";
import {
  dislikesLogo,
  exploreLogo,
  likesLogo,
  replyLogo,
} from "../../../assets/assets";
import PostReactionButton from "../../../components/postReactionButton";
import CommunityCreateComment from "../../../components/communityCreateComment";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface CommentObject {
  id: number;
  community_title: string;
  user_id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  parent_id: number | null;
  depth: number;
  post_id: number;
  created_at: string;
  last_updated_at: string;
  content: string;
  likes: number;
  dislikes: number;
  is_root: boolean;
  replies: CommentObject[] | [];
}

type PostIdCommentProps = {
  comment: CommentObject & {
    replies: CommentObject[] | [];
  };
};

export default function PostIdComment({ comment }: PostIdCommentProps) {
  const params = useParams();
  const communityTitle = params.communityTitle;
  const postId = params.postId;

  const navigate = useNavigate();

  const [fullText, setFullText] = useState(false);
  function handleFullText() {
    setFullText(!fullText);
  }

  const [commentSideHighlighter, setCommentSideHighlighter] =
    useState("bg-slate-800");

  const [createReply, setCreateReply] = useState("hidden");

  function changeCommentSideHighlighter() {
    if (commentSideHighlighter === "bg-slate-800") {
      setCommentSideHighlighter("bg-[oklch(55.1%_0.027_264.364)]");
    } else {
      setCommentSideHighlighter("bg-slate-800");
    }
  }

  function handleCreateReply() {
    if (createReply === "hidden") {
      setCreateReply("block");
    } else {
      setCreateReply("hidden");
    }
  }

  const { isError, data, error } = useQuery({
    queryKey: ["communityCommentReaction", comment.id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/comments/${comment.id}/main`
        );

        return response.data;
      } catch (error) {
        return null;
      }
    },
  });

  if (isError) {
    console.log(error);
  }

  const queryClient = useQueryClient();
  const submitCommentLikeReaction = useMutation({
    mutationKey: ["communityCommentLikesReaction", comment.id],
    mutationFn: async () => {
      const response = await axios.post(
        `http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/comments/${comment.id}/reaction`,
        { name: "likes" },
        { withCredentials: true }
      );

      console.log(response.data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityCommentReaction", comment.id],
      });
    },

    onMutate: () => {
      console.log("IS mutating");
    },

    onError: () => {
      navigate("/login");
    },
  });

  const submitCommentDislikeReaction = useMutation({
    mutationKey: ["communityCommentDislikesReaction", comment.id],
    mutationFn: async () => {
      const response = await axios.post(
        `http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/comments/${comment.id}/reaction`,
        { name: "dislikes" },
        { withCredentials: true }
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityCommentReaction", comment.id],
      });
    },

    onMutate: () => {
      console.log("IS mutating");
    },

    onError: () => {
      navigate("/login");
    },
  });

  return (
    <div className="comment flex flex-col justify-stretch items-stretch">
      <div
        className="
                    px-[1em] [@media(min-width:480px)]:px-[2em] py-[0.25em] w-[100%]
                    transition-all duration-[200ms]
                "
      >
        <section className="w-[100%] flex flex-row justify-start items-center gap-[0.5em]">
          <a
            className="
                            text-white h-[2rem] aspect-[1/1] rounded-[50%]
                        "
            style={{
              backgroundImage: `url(${exploreLogo})`,
              backgroundSize: "75%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></a>
          <span className="text-white text-[0.75rem] font-bold">
            {comment.first_name} {comment.last_name}
          </span>
          <span className="text-gray-500 text-[0.75rem]">
            {new Date(comment.created_at)
              .toISOString()
              .substring(0, 16)
              .replace("T", " | ")}
          </span>
        </section>
        <section className="flex flex-row justify-stretch items-stretch gap-[0.5em]">
          <div
            className="relative w-[2em] my-[0.25em] flex justify-stretch items-stretch rounded-[1em]"
            onMouseOver={changeCommentSideHighlighter}
            onMouseOut={changeCommentSideHighlighter}
          >
            <div className="flex-1 h-full"></div>
            <div className={`w-[0.5px] h-full ${commentSideHighlighter}`}></div>
            <div className="flex-1 h-full"></div>
          </div>
          <div className="flex-1 {% if comment.depth == 2 %}mb-[1em]{% endif %}">
            <article
              className="
                                text-sm text-gray-400 font-sans break-words text-wrap whitespace-pre-wrap
                            "
            >
              {comment.content.length <= 600 || fullText
                ? comment.content
                : `${comment.content.slice(0, 600)}.....`}
            </article>
            {comment.content.length > 600 ? (
              <button
                className="text-blue-700 hover:underline hover:text-blue-500 hover:cursor-pointer"
                onClick={handleFullText}
              >
                {fullText ? "Collapse" : "Read more..."}
              </button>
            ) : (
              <></>
            )}
            <section className="mt-[0.5em] w-[100%] flex flex-row justify-start items-center gap-[1em]">
              <PostReactionButton
                logo={likesLogo}
                iconXCoordinate="50%"
                iconYCoordinate="40%"
                reactionValue={data?.like ?? 0}
                onClick={() => submitCommentLikeReaction.mutate()}
              />

              <PostReactionButton
                logo={dislikesLogo}
                iconXCoordinate="50%"
                iconYCoordinate="75%"
                reactionValue={data?.dislike ?? 0}
                onClick={() => submitCommentDislikeReaction.mutate()}
              />
              <button
                className={`
                    flex flex-row justify-stretch items-center gap-[0.5em] p-[0.5em] h-[2.25em] hover:cursor-pointer hover:bg-gray-500/25
                    active:bg-gray-800/50 pointer-events-auto rounded-[1rem]
                  `}
                onClick={handleCreateReply}
              >
                <img src={replyLogo} className="h-full w-auto"></img>
                <p className="text-gray-400 text-sm font-bold font-mono">
                  Reply
                </p>
              </button>
              <button
                className={`
                    flex flex-row justify-stretch items-center gap-[0.5em] p-[0.5em] h-[2.25em] hover:cursor-pointer hover:bg-gray-500/25
                    active:bg-gray-800/50 pointer-events-auto rounded-[1rem]
                  `}
                onClick={() => {
                  navigate(
                    `/communities/${communityTitle}/${postId}/${comment.id}`
                  );
                }}
              >
                <img src={replyLogo} className="h-full w-auto"></img>
                <p className="text-gray-400 text-sm font-bold font-mono">
                  View All
                </p>
              </button>
            </section>
          </div>
        </section>

        {comment.depth === 2 ? (
          <button
            onClick={() => {
              navigate(
                `/communities/${communityTitle}/${postId}/${comment.id}`
              );
            }}
            className="ml-[2.5em] mt-[0.25em] w-full flex flex-row justify-start items-stretch text-blue-600 underline hover:cursor-pointer hover:text-blue-600"
          >
            <span className="text-sm">Open Replies...</span>
          </button>
        ) : (
          <></>
        )}

        {comment.depth !== 0 ? (
          <div
            className={`${
              comment.depth === 2 ? "mb-[0.25em]" : ""
            } ${createReply}`}
          >
            <CommunityCreateComment
              filterValue="likes"
              sortValue="descending"
              endpoint={`http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/comments/${comment.id}/comments`}
            />
          </div>
        ) : (
          <></>
        )}

        {comment.is_root ? (
          <button
            className="
                        mx-[3em] mt-[0.5em] py-[0.25em] px-[2em] w-[12em] hover:cursor-pointer
                        rounded-[1rem] flex flex-row justify-center items-center
                        bg-gray-800 text-white text-xs font-sans font-bold transition-all
                        duration-[100ms] hover:bg-gray-500/25 active:scale-[0.95]
                    "
          >
            View full thread
          </button>
        ) : (
          <></>
        )}

        {comment.depth === 0 ? (
          <div className={`${createReply}`}>
            <CommunityCreateComment
              filterValue="likes"
              sortValue="descending"
              endpoint={`http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/comments/${comment.id}/comments`}
            />
          </div>
        ) : (
          <></>
        )}
      </div>

      {comment.replies && comment.depth < 2 ? (
        <div className="flex-1 flex flex-row justify-stretch items-stretch">
          <div className="relative w-[1.5em] [@media(min-width:480px)]:w-[2.5em] text-white flex flex-col justify-start items-end"></div>

          <div className="flex-1">
            {comment.replies.map((reply, index: number) => {
              return <PostIdComment key={index} comment={reply} />;
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
