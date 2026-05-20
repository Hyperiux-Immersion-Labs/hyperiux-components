import LinkButton from"@/components/Buttons/LinkButtons/LinkButton/LinkButton";
import { ButtonDemoShell } from"@/components/Buttons/ButtonDemoShell";

export default function Page() {
 return (
 <ButtonDemoShell
 title="Link Button"
 backgroundSrc="/assets/buttonbg/new-bg-img.jpg"
 >
 <LinkButton
 text="Hover me"
 href="#"
 iconClassName="size-[2vw] mt-[0.2vw] max-sm:size-[4vw]"
 className="text-[2vw] hover:text-[#ff6b00] max-sm:text-[4.5vw]"
 />
 </ButtonDemoShell>
 );
}
