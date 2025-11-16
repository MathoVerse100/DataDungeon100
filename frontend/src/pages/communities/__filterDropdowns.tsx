import CommunityFeedFilterDropdown from "../../components/communityFeedFilterDropdown";
import Dropdown from "../../components/dropdown";

export default function FilterDropdowns() {
  return (
    <div className="mt-[1rem] [@media(min-width:480px)]:mt-[2rem] px-[2em] py-[1em] bg-black sticky top-0 flex flex-row justify-stretch items-center gap-[0.75em] border-b-[1px] border-b-gray-800">
      <CommunityFeedFilterDropdown title="Sort By" isSmallCompatible={false}>
        <Dropdown
          defaultDisplay="Hot"
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
      </CommunityFeedFilterDropdown>
      <CommunityFeedFilterDropdown title="Sort By" isSmallCompatible={false}>
        <Dropdown
          defaultDisplay="Hot"
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
      </CommunityFeedFilterDropdown>
      <CommunityFeedFilterDropdown title="Sort By" isSmallCompatible={false}>
        <Dropdown
          defaultDisplay="Hot"
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
      </CommunityFeedFilterDropdown>
      <CommunityFeedFilterDropdown title="Sort By" isSmallCompatible={true}>
        <Dropdown
          defaultDisplay="Hot"
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
      </CommunityFeedFilterDropdown>
    </div>
  );
}
