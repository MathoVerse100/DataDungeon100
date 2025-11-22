import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { QueryParams } from "../pages/communities/$communityTitle/$postId";

export default function CommunityCreateComment(
  adjustedQueryParams: QueryParams & { endpoint: string }
) {
  const [textareaHeight, setTextareaHeight] = useState(80);
  function handleTextareaHeight(event: ChangeEvent<HTMLTextAreaElement>) {
    if (event.target?.scrollHeight > event.target?.clientHeight) {
      setTextareaHeight(event.target?.scrollHeight);
    }
  }

  const [createCommentSettings, setCreateCommentSettings] = useState({
    settings: "hidden",
    roundedness: "rounded-[1rem]",
  });
  const [createCommentContent, setCreateCommentContent] = useState("");
  const [createCommentError, setCreateCommentError] = useState({
    hide: true,
    content: "",
  });
  const [createCommentMutating, setCreateCommentMutating] = useState(false);

  const queryClient = useQueryClient();
  const submitCreateComment = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        adjustedQueryParams.endpoint,
        { content: createCommentContent },
        { withCredentials: true }
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "communityPostComments",
          {
            filterValue: adjustedQueryParams.filterValue,
            sortValue: adjustedQueryParams.sortValue,
          },
        ],
        exact: false,
      });
      setCreateCommentMutating(false);
      setCreateCommentError({
        hide: true,
        content: "",
      });
      setCreateCommentContent("");
    },

    onMutate: () => {
      setCreateCommentMutating(true);
    },

    onError: (error: any) => {
      setCreateCommentMutating(false);
      setCreateCommentError({
        hide: false,
        content:
          typeof error.response.data.detail === "string"
            ? "You must login to comment!"
            : "Comment must not be empty!",
      });
    },
  });

  function handleCreateCommentContent(content: string) {
    setCreateCommentContent(content);
  }

  function openCreateCommentSettings() {
    if (createCommentSettings.settings === "hidden") {
      setCreateCommentSettings({
        settings: "flex",
        roundedness: "rounded-t-[1rem] border-b-[1px] border-b-gray-800",
      });
    }
  }

  function closeCreateCommentSettings() {
    if (createCommentSettings.settings === "flex") {
      setCreateCommentSettings({
        settings: "hidden",
        roundedness: "rounded-[1rem]",
      });
    }
  }

  function handleSubmitCreateComment() {
    submitCreateComment.mutate();
  }

  return (
    <>
      {createCommentMutating ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <section className="flex flex-col justify-stretch items-stretch mt-[1em] mx-[2em]">
            <textarea
              onSelect={openCreateCommentSettings}
              onInput={(event: FormEvent<HTMLTextAreaElement>) => {
                handleCreateCommentContent(
                  (event.target as HTMLTextAreaElement).value
                );
                handleTextareaHeight(event as ChangeEvent<HTMLTextAreaElement>);
              }}
              className={`
                        outline-none w-full ${createCommentSettings.roundedness} bg-gray-800/50 text-white p-[1em]
                        text-sm overflow-hidden min-h-[5rem] h-[5rem]
                    `}
              style={{ height: `${textareaHeight}px` }}
              placeholder="Create a comment..."
              value={createCommentContent}
            ></textarea>
            <div
              className={`
                            ${createCommentSettings.settings}
                            self-end w-full h-[3em] bg-gray-800/50
                            flex-row justify-stretch items-stretch gap-[1em]
                            rounded-b-[1rem] p-[0.5em] border-t-[1px] border-t-gray-800
                        `}
            >
              <button
                onClick={handleSubmitCreateComment}
                className="
                                ml-auto mr-0 bg-blue-500 text-white font-bold text-sm rounded-[1rem] px-[1em]
                                transition-all duration-[200ms] hover:bg-blue-800 
                            "
              >
                Submit
              </button>
              <button
                onClick={closeCreateCommentSettings}
                className="
                                bg-red-500 text-white font-bold text-sm rounded-[1rem] px-[1em]
                                transition-all duration-[200ms] hover:bg-red-800 
                            "
              >
                Cancel
              </button>
            </div>
          </section>
          <div
            className={`w-full ${
              createCommentError.hide ? "hidden" : "inline-block"
            }`}
          >
            <span className="mx-[3em] mt-[1em] text-red-500 text-xs">
              {createCommentError.content}
            </span>
          </div>
        </>
      )}
    </>
  );
}
