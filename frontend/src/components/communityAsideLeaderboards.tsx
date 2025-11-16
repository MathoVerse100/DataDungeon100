import {
  eightLogo,
  exploreLogo,
  fiveLogo,
  fourLogo,
  gridLogo,
  nineLogo,
  oneLogo,
  sevenLogo,
  sixLogo,
  tenLogo,
  threeLogo,
  twoLogo,
} from "../assets/assets";

export default function CommunityAsideLeaderboards() {
  const rankings = [
    oneLogo,
    twoLogo,
    threeLogo,
    fourLogo,
    fiveLogo,
    sixLogo,
    sevenLogo,
    eightLogo,
    nineLogo,
    tenLogo,
  ];

  const users = Array.from({ length: 10 }).map((_) => {
    return {
      firstName: "Amro",
      lastName: "Alshaban",
      metric: "Likes",
      value: "254.6K",
    };
  });

  return (
    <section className="px-[1em] py-[1em] border-b-[1px] border-b-gray-800 flex flex-col justify-start items-start gap-[0.5em]">
      <header className="text-lg font-bold text-gray-300 mb-1">
        Leaderboard
      </header>
      <div className="w-full flex flex-row justify-between items-center">
        <button
          className="
                        text-xs font-bold text-white font-mono p-2 bg-amber-800
                        flex flex-row justify-center items-center rounded-[1rem] 
                        transition-all duration-[200ms] hover:bg-yellow-800/50
                    "
        >
          Daily
        </button>
        <button
          className="
                        text-xs font-bold text-white font-mono p-2
                        flex flex-row justify-center items-center rounded-[1rem] 
                        transition-all duration-[200ms] hover:bg-gray-500/25
                    "
        >
          Weekly
        </button>
        <button
          className="
                        text-xs font-bold text-white font-mono p-2
                        flex flex-row justify-center items-center rounded-[1rem] 
                        transition-all duration-[200ms] hover:bg-gray-500/25
                    "
        >
          Monthly
        </button>
      </div>

      <div className="mt-[1em] w-full h-[2rem] flex flex-row justify-between items-center">
        <span className="text-white text-md font-bold font-[cursive]">
          Most Likes
        </span>
        <button
          className="
                        text-white h-full aspect-[1/1] rounded-[50%] overflow-hidden
                        transition-all duration-[100ms] hover:bg-gray-500/25
                    "
          style={{
            backgroundImage: `url(${gridLogo})`,
            backgroundSize: "50%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></button>
      </div>

      <div className="relative w-full flex flex-col justify-stretch items-center gap-[1em]">
        {rankings.map((ranking, index) => {
          return (
            <section
              key={index}
              className="
                        w-full flex-1 flex flex-row justify-start items-center gap-[0.5em] rounded-[1rem] px-1
                        transition-all duration-[100ms] hover:bg-gray-500/25 hover:cursor-pointer
                    "
            >
              <a
                className="
                            text-white h-[3rem] aspect-[1/1] rounded-[50%]
                            "
                style={{
                  backgroundImage: `url(${exploreLogo})`,
                  backgroundSize: "75%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></a>
              <div className="flex-1 flex flex-col justify-start items-start">
                <span className="block text-white text-[0.75rem] font-bold">
                  {users[index].firstName} {users[index].lastName}
                </span>
                <span className="block text-white text-[0.75rem] italic font-mono">
                  {users[index].metric}: {users[index].value}
                </span>
              </div>
              <img
                className="
                            h-[2em] aspect-[1/1]
                        "
                src={ranking}
              ></img>
            </section>
          );
        })}
      </div>
    </section>
  );
}
