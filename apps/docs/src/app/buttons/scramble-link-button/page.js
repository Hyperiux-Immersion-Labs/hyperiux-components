import ScrambleLinkButton from"@/components/Buttons/LinkButtons/ScrambleLinkButton/ScrambleLinkButton";
import { ButtonDemoShell } from"@/components/Buttons/ButtonDemoShell";

export default function Page() {
 return (
 <ButtonDemoShell
 title="Scramble Link Button"
 backgroundSrc="/assets/buttonbg/bg03.png"
 >
 <ScrambleLinkButton
 href="#"
 text="Hover me"
 className="text-[2vw] max-sm:text-[4.5vw]"
 />
 </ButtonDemoShell>
 );
}
