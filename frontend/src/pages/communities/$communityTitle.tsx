import { exploreLogo } from "../../assets/assets";
import CommunityPostCard from "../../components/communityPostCard";
import CommunitySkeleton from "./__communitySkeleton";
import FilterDropdowns from "./__filterDropdowns";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
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

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["communityPosts"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8000/spa/communities/posts/${communityTitle}`,
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
    <>
      <FilterDropdowns />
      {data.map((post: Post, index: number) => {
        return (
          <CommunityPostCard
            key={index}
            userProfilePicture={exploreLogo}
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
