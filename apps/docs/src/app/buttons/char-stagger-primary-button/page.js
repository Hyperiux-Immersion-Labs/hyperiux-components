import CharStaggerPrimaryBtn from"@/components/Buttons/PrimaryButtons/CharStaggerPrimaryBtn/CharStaggerPrimaryBtn";
import { ButtonDemoShell } from"@/components/Buttons/ButtonDemoShell";

export default function Page() {
 return (
 <ButtonDemoShell
 title="Character Stagger Primary Button"
 backgroundSrc="/assets/buttonbg/link-btns-bg-img.jpg"
 >
 <CharStaggerPrimaryBtn
 href="#"
 text="Hover me"
 bgClassName="rounded-full bg-[#ff6b00]"
 className="text-[1.2vw] max-sm:text-[4.5vw]"
 />
 </ButtonDemoShell>
 );
}
