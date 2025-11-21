import { useParams } from "react-router-dom";
import { PostIdPostComments, PostIdPostContent } from "../$postId";
import CommunityMainLayout from "../../../../layouts/communityMainLayout";
import CommunityAside from "../../__communityAside";

export default function CommentId() {
  const params = useParams();
  const communityTitle = params.communityTitle;
  const postId = params.postId;
  const commentId = params.commentId;

  return (
    <CommunityMainLayout>
      <CommunityMainLayout.Feed>
        <PostIdPostContent />
        <PostIdPostComments
          endpoint={`http://localhost:8000/api/communities/${communityTitle}/posts/${postId}/comments/${commentId}/comments`}
        />
      </CommunityMainLayout.Feed>

      <CommunityMainLayout.Aside>
        <CommunityAside />
      </CommunityMainLayout.Aside>
    </CommunityMainLayout>
  );
}
