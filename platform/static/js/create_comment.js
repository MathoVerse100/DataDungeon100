// platform/static/ts/create_comment.ts
document.addEventListener("DOMContentLoaded", () => {
  const create_comments = document.querySelectorAll(".create_comment");
  create_comments.forEach((create_comment) => {
    const textarea = create_comment.querySelector("textarea");
    const comment_configs = create_comment.querySelector(".comment_configs");
    const dropdown = document.querySelector(".dropdown");
    textarea?.addEventListener("input", () => {
      if (textarea.scrollHeight > textarea.clientHeight) {
        textarea.style.height = textarea.scrollHeight + "px";
      }
    });
    document.addEventListener("click", (event) => {
      if (event.target === textarea) {
        textarea.style.borderBottomLeftRadius = "0";
        textarea.style.borderBottomRightRadius = "0";
        comment_configs.style.display = "flex";
      }
    });
    comment_configs.querySelector(".comment_cancel")?.addEventListener("click", () => {
      textarea.value = "";
      comment_configs.style.display = "none";
      textarea.style.borderBottomLeftRadius = "1rem";
      textarea.style.borderBottomRightRadius = "1rem";
    });
    comment_configs.querySelector(".comment_submit")?.addEventListener("click", (event) => {
      const communityTitle = comment_configs.querySelector(".comment_submit").dataset.communityTitle?.toLowerCase();
      const postId = Number(
        comment_configs.querySelector(".comment_submit").dataset.postId
      );
      fetch(
        `/api/communities/posts/${encodeURIComponent(
          communityTitle
        )}/${encodeURIComponent(postId)}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            content: textarea?.value
          }),
          credentials: "include"
        }
      ).then((response) => response.json()).then((data) => {
        const user_info = JSON.parse(data.user_info);
        const element = `
          <div class="comment mt-[2em] flex flex-col justify-stretch items-stretch">
              <div
                  class="
                      px-[1em] [@media(min-width:480px)]:px-[2em] py-[0.5em] w-[100%]
                      transition-all duration-[200ms]
                  "
              >
                  <section class="w-[100%] flex flex-row justify-start items-center gap-[0.5em]">
                      <a
                          href="http://localhost:8000/assets/library.png"
                          class="
                              text-white h-[2rem] aspect-[1/1] rounded-[50%]
                          "
                          style="
                              background-image: url('http://localhost:8000/assets/library.png');
                              background-size: 75%;
                              background-position: center;
                              background-repeat: no-repeat;
                          "
                      >
                      </a>
                      <span class="text-white text-[0.75rem] font-bold">${user_info.first_name} ${user_info.last_name}</span>
                      <span class="text-gray-500 text-[0.75rem]">2025/05/16 23:34:09</span>
                  </section>
                  <section class="flex flex-row justify-stretch items-stretch gap-[0.5em]">
                      <div
                          class="relative w-[2em] my-[0.25em] flex justify-stretch items-stretch rounded-[1em]"
                          onmouseover="
                              this.querySelector('.comment-highlighter').style.backgroundColor = 'oklch(55.1% 0.027 264.364)';
                          "
                          onmouseout="
                              this.querySelector('.comment-highlighter').style.backgroundColor = 'oklch(27.9% 0.041 260.031)';
                          "
                      >
                          <div class="flex-1 h-full"></div>
                          <div class="comment-highlighter w-[0.5px] h-full bg-slate-800"></div>
                          <div class="flex-1 h-full"></div>
                      </div>
                      <div class="flex-1">
                          <article
                              class="
                                  text-sm text-gray-400 font-sans break-words text-wrap whitespace-pre-wrap
                              "
                          >${textarea?.value}</article>
                          <section class="mt-[0.5em] w-[100%] flex flex-row justify-start items-center gap-[1em]">
                            <div 
                                class="
                                    h-[1.5em] [@media(min-width:480px)]:h-[2em] flex flex-row justify-stretch items-stretch gap-[0.5em]
                                "
                                onclick="event.stopPropagation();"
                            >
                                <button 
                                    class="
                                        aspect-[1/1] rounded-[50%] transition-all duration-[100ms]
                                        hover:cursor-pointer hover:bg-gray-500 hover:bg-opacity-25
                                        active:bg-gray-800 active:bg-opacity-50
                                    "
                                    style="
                                        background-image: url('http://localhost:8000/assets/like.png');
                                        background-size: 60%;
                                        background-position: 50% 40%;
                                        background-repeat: no-repeat;
                                    "
                                ></button>
                                <span class="flex-1 self-center text-gray-300 text-xs [@media(min-width:480px)]:text-sm font-sans font-bold">0</span>
                            </div>
                            <div 
                                class="
                                    h-[1.5em] [@media(min-width:480px)]:h-[2em] flex flex-row justify-stretch items-stretch gap-[0.5em]
                                "
                                onclick="event.stopPropagation();"
                            >
                                <button 
                                    class="
                                        aspect-[1/1] rounded-[50%] transition-all duration-[100ms]
                                        hover:cursor-pointer hover:bg-gray-500 hover:bg-opacity-25
                                        active:bg-gray-800 active:bg-opacity-50
                                    "
                                    style="
                                        background-image: url('http://localhost:8000/assets/dislike.png');
                                        background-size: 60%;
                                        background-position: 50% 75%;
                                        background-repeat: no-repeat;
                                    "
                                ></button>
                                <span class="flex-1 self-center text-gray-300 text-xs [@media(min-width:480px)]:text-sm font-sans font-bold">0</span>
                            </div>
                          </section>
                      </div>
                  </section>

                  <a
                      class="
                          mx-[3em] mt-[0.5em] py-[0.25em] px-[2em] w-[12em]
                          rounded-[1rem] flex flex-row justify-center items-center
                          bg-gray-800 text-white text-xs font-sans font-bold transition-all
                          duration-[100ms] hover:bg-gray-500 hover:bg-opacity-25 active:scale-[0.95]
                      "
                      href='/communities/analytics/post_id/comments/comment_id/thread/2'
                  >
                      View full thread
                  </a>
              </div>
          </div>
        `;
        const temp = document.createElement("template");
        temp.innerHTML = element.trim();
        const tempElement = temp.content.firstChild;
        dropdown?.after(tempElement);
        textarea.value = "";
        comment_configs.style.display = "none";
        textarea.style.borderBottomLeftRadius = "1rem";
        textarea.style.borderBottomRightRadius = "1rem";
      }).catch((error) => console.error("Error:", error));
    });
  });
});
//# sourceMappingURL=create_comment.js.map
