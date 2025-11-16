import { exploreLogo } from "../../assets/assets";
import CommunityPostCard from "../../components/communityPostCard";
import CommunitySkeleton from "./__communitySkeleton";
import FilterDropdowns from "./__filterDropdowns";

export default function CommunityTitle() {
  return (
    <CommunitySkeleton>
      <FilterDropdowns />
      {Array.from({ length: 10 }).map((_) => {
        return (
          <CommunityPostCard
            userProfilePicture={exploreLogo}
            firstName="Amro"
            lastName="Alshaban"
            username="amro_alshaban"
            title="Show that, for all positive integers N, sqrt(N) is an integer or an irrational number. How do I prove this?"
            tags={["Mathematics", "Physics", "Computer Science"]}
            content="

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. 


Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. 


Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Coobla Coobla dee!
        "
            likes={12025}
            dislikes={4325}
          />
        );
      })}
    </CommunitySkeleton>
  );
}
