import ArrowBgFillPrimaryBtn from "@/components/Buttons/PrimaryButtons/ArrowBgFillPrimaryBtn/ArrowBgFillPrimaryBtn";
import { ButtonDemoShell } from "@/components/Buttons/ButtonDemoShell";

export default function Page() {
    return (
        <ButtonDemoShell
            title="Arrow Fill Button"
            backgroundSrc="/assets/buttonbg/image01.png"
        >
            <ArrowBgFillPrimaryBtn
                className="bg-[#ff6b00]"
                href="#"
                btnText="Hover me"
            />
        </ButtonDemoShell>
    );
}
