import { useState } from "react";
import { dislikesLogo, exploreLogo, likesLogo } from "../../../assets/assets";
import PostReactionButton from "../../../components/postReactionButton";

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
  const [commentSideHighlighter, setCommentSideHighlighter] =
    useState("bg-slate-800");
  //
  function changeCommentSideHighlighter() {
    if (commentSideHighlighter === "bg-slate-800") {
      setCommentSideHighlighter("bg-[oklch(55.1%_0.027_264.364)]");
    } else {
      setCommentSideHighlighter("bg-slate-800");
    }
  }

  return (
    <div className="comment {% if comment.depth == 0 %}mt-[2em]{% endif %} flex flex-col justify-stretch items-stretch">
      <div
        className="
                    px-[1em] [@media(min-width:480px)]:px-[2em] py-[0.5em] w-[100%]
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
            {comment.created_at}
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
              {comment.content}
            </article>
            <section className="mt-[0.5em] w-[100%] flex flex-row justify-start items-center gap-[1em]">
              <PostReactionButton
                logo={likesLogo}
                iconXCoordinate="50%"
                iconYCoordinate="40%"
                reactionValue={comment.likes}
              />

              <PostReactionButton
                logo={dislikesLogo}
                iconXCoordinate="50%"
                iconYCoordinate="75%"
                reactionValue={comment.dislikes}
              />
            </section>
          </div>
        </section>

        {comment.depth === 2 ? (
          <span className="ml-[2.5em] text-blue-700 hover:underline hover:text-blue-500 hover:cursor-pointer">
            Open replies...
          </span>
        ) : (
          <></>
        )}

        {comment.is_root ? (
          <a
            className="
                        mx-[3em] mt-[0.5em] py-[0.25em] px-[2em] w-[12em]
                        rounded-[1rem] flex flex-row justify-center items-center
                        bg-gray-800 text-white text-xs font-sans font-bold transition-all
                        duration-[100ms] hover:bg-gray-500/25 active:scale-[0.95]
                    "
          >
            View full thread
          </a>
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
