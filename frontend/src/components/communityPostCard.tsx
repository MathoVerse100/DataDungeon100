import PostReactionButton from "./postReactionButton";

import { likesLogo } from "../assets/assets";
import { dislikesLogo } from "../assets/assets";
import { useNavigate } from "react-router-dom";

type CommunityPostCardProps = {
  userProfilePicture: string;
  postId: number;
  communityTitle: string;
  firstName: string;
  lastName: string;
  username: string;
  title: string;
  tags: string[];
  content: string;
  likes: number;
  dislikes: number;
};

export default function CommunityPostCard({
  userProfilePicture,
  postId,
  communityTitle,
  firstName,
  lastName,
  username,
  title,
  tags,
  content,
  likes,
  dislikes,
}: CommunityPostCardProps) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/communities/${communityTitle}/${postId}`);
  }

  return (
    <div
      className={`
                px-[2em] py-[1em] w-[100%] block
                transition-all duration-[200ms] hover:cursor-pointer hover:bg-gray-900/25
                border-b-[1px] border-b-gray-800
            `}
      onClick={handleClick}
    >
      <section className="w-[100%] flex flex-row justify-start items-center gap-[0.5em]">
        <a
          className="
                        text-white h-[3rem] aspect-[1/1] rounded-[50%]
                    "
          style={{
            backgroundImage: `url(${userProfilePicture})`,
            backgroundSize: "75%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></a>
        <div className="flex-1 flex flex-col justify-start items-start">
          <span className="text-white text-[1rem] font-bold">
            {firstName} {lastName}
          </span>
          <span className="text-white text-[0.75rem] text-gray-500">
            {username}
          </span>
        </div>
      </section>
      <section className="py-[1em] flex flex-col justify-start items-start gap-[1em]">
        <header className="text-white font-bold text-lg sm:text-xl font-roboto">
          {title}
        </header>
        <div className="flex flex-row justify-start items-center gap-[1em] flex-wrap">
          {tags.map((tag, index) => {
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
          {content}
        </article>
      </section>
      <section
        className="w-[100%] flex flex-row justify-start items-center gap-[1em]"
        onClick={(event) => event.stopPropagation()}
      >
        <PostReactionButton
          logo={likesLogo}
          iconXCoordinate="50%"
          iconYCoordinate="40%"
          reactionValue={likes}
        />
        <PostReactionButton
          logo={dislikesLogo}
          iconXCoordinate="50%"
          iconYCoordinate="75%"
          reactionValue={dislikes}
        />
      </section>
    </div>
  );
}
