import NavButton from "./navButton";
import type { NavButtonProps } from "./navButton";

type SidebarMenuGroupProps = {
  header_content: string;
  buttons: NavButtonProps[];
};

export default function SidebarMenuGroup({
  header_content,
  buttons,
}: SidebarMenuGroupProps) {
  return (
    <section className="w-[100%] flex flex-col justify-start items-stretch">
      <header className="mb-[0.5em] text-white font-inter text-[0.6rem] uppercase tracking-wide opacity-70">
        {header_content}
      </header>

      {buttons.map((button, index) => {
        return (
          <NavButton
            key={index}
            type={button.type}
            logo={button.logo}
            iconSize={button.iconSize}
            content={button.content}
            url={button.url ?? ""}
          />
        );
      })}
    </section>
  );
}
