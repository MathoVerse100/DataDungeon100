import NavButton from "./navButton";

import { moreOptionsLogo } from "../assets/assets";
import ActionButton from "./actionButton";

type CommunityBannerProps = {
  bannerClassNames?: string;
  bannerBackgroundXPosition?: string;
  bannerBackgroundYPosition?: string;
  bannerBackgroundSize: string;
  bannerBackgroundImage: string;
  iconClassNames?: string;
  iconBackgroundXPosition?: string;
  iconBackgroundYPosition?: string;
  iconBackgroundSize: string;
  iconBackgroundImage: string;
  communityTitle: string;
  communitySubtitle: string;
};

export default function CommunityBanner(props: CommunityBannerProps) {
  return (
    <>
      <section
        className={`
            ${props.bannerClassNames}
            pl-[2em] w-[100%] h-[10rem] bg-gray-500
        `}
        style={{
          backgroundImage: `url(${props.bannerBackgroundImage})`,
          backgroundSize: props.bannerBackgroundSize ?? "cover",
          backgroundPosition:
            props.bannerBackgroundXPosition && props.bannerBackgroundYPosition
              ? `${props.bannerBackgroundXPosition} ${props.bannerBackgroundYPosition}`
              : "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="h-[100%] flex flex-row justify-start items-center gap-[1em] translate-y-[50%]">
          <div
            className="
                    h-[75%] aspect-[1/1] overflow-hidden rounded-[50%]
                    border-[5px] border-black transition-all duration-[100ms] hover:cursor-pointer
                    hover:shadow-[0_0_5px_rgb(200,138,4),0_0_10px_rgb(200,138,4),0_0_20px_rgb(200,138,4)]
                "
            style={{
              backgroundImage: `url(${props.iconBackgroundImage})`,
              backgroundSize: props.iconBackgroundSize ?? "cover",
              backgroundPosition:
                props.iconBackgroundXPosition && props.iconBackgroundYPosition
                  ? `${props.iconBackgroundXPosition} ${props.iconBackgroundYPosition}`
                  : "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div className="relative top-[2rem] pr-[2em] flex-1">
            <span className="text-white text-3xl font-bold text-gray-200 leading-[2em] hidden [@media(min-width:480px)]:block">
              {props.communityTitle}
            </span>
            <p className="hidden sm:block absolute text-gray-400 text-[0.75rem] w-[calc(100%-5em)] break-words text-wrap">
              {props.communitySubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="absolute right-[2em] sm:right-0 mt-2 p-2 flex flex-row justify-end items-center gap-[1em]">
        <ActionButton content="Join" />
        <ActionButton content="On" />

        <NavButton
          type="circle"
          content=""
          logo={moreOptionsLogo}
          iconSize="75%"
          classNames="h-[2em]"
        />
      </section>

      <section className="[@media(min-width:480px)]:mt-[3rem] mt-[4rem] px-[2em] py-[1em]">
        <span className="text-white text-3xl font-bold text-gray-200 leading-[2em] [@media(min-width:480px)]:hidden">
          {props.communityTitle}
        </span>
        <p className="block sm:hidden text-gray-400 text-[0.75rem] break-words text-wrap">
          {props.communitySubtitle}
        </p>
      </section>
    </>
  );
}
