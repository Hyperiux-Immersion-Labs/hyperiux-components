import CharStaggerLinkBtn from"@/components/Buttons/LinkButtons/CharStaggerLinkBtn/CharStaggerLinkBtn";
import { ButtonDemoShell } from"@/components/Buttons/ButtonDemoShell";

export default function Page() {
 return (
 <ButtonDemoShell
 title="Character Stagger Button"
 backgroundSrc="/assets/buttonbg/stones.png"
 >
 <CharStaggerLinkBtn
 href="#"
 showLine
 text="Hover me"
 hoverColor="#ff6b00"
 className="text-[2vw] max-sm:text-[4.5vw]"
 />
 </ButtonDemoShell>
 );
}
