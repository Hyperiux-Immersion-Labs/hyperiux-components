// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap/dist/gsap";
import { useLenis } from "lenis/react";

export interface TeamMember {
  id: string;
  slug: string;
  title: string;
  content: string;
  featuredImage: string | { node: { sourceUrl: string } };
  teams: {
    designation: string;
    linkedin?: string;
    blackWhitePicture?: { node: { sourceUrl: string } };
    profilePicture?: string | { node: { sourceUrl: string } };
  };
}

function getImageSource(image?: string | { node?: { sourceUrl?: string } }) {
  if (typeof image === "string") return image;
  return image?.node?.sourceUrl;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

export interface InformationDrawerCompProps {
  teams?: TeamMember[] | { teams: TeamMember[] };
  /** GSAP tween duration (seconds) for the drawer panel and overlay. */
  duration?: number;
  /** GSAP ease for the drawer panel and overlay. */
  ease?: string;
  /** GSAP tween delay (seconds) for the drawer panel and overlay. */
  delay?: number;
  /** Drawer panel background color. */
  backgroundColor?: string;
  /** Drawer panel text color. */
  textColor?: string;
  /** Drawer panel width on desktop. Numbers are treated as percentages. */
  sidebarWidth?: string | number;
  /** Backdrop opacity while the drawer is open. */
  overlayOpacity?: number;
}

export default function InformationDrawerComp({
  teams,
  duration = 0.6,
  ease = "power2.inOut",
  delay = 0,
  backgroundColor = "#ffffff",
  textColor = "#111111",
  sidebarWidth = "70%",
  overlayOpacity = 0.2,
}: InformationDrawerCompProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const lenis = useLenis();
  const cardContainer = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Accept {teams: []} OR [] OR nothing.
  const teamInfo: TeamMember[] = Array.isArray(teams)
    ? teams
    : Array.isArray((teams as { teams?: TeamMember[] })?.teams)
      ? (teams as { teams: TeamMember[] }).teams
      : [];

  const handleDetail = (member: TeamMember) => {
    setSelectedMember(member);
    setDetailOpen(true);
    lenis?.stop?.();
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, member: TeamMember) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleDetail(member);
  };

  const handleClose = () => {
    setDetailOpen(false);
    setSelectedMember(null);
    lenis?.start?.();
  };

  const drawerWidth = useMemo(() => {
    if (typeof sidebarWidth === "number") return `${sidebarWidth}%`;
    return sidebarWidth;
  }, [sidebarWidth]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.to(overlayRef.current, {
      opacity: detailOpen ? overlayOpacity : 0,
      duration: prefersReducedMotion ? 0 : duration,
      ease,
      delay: prefersReducedMotion ? 0 : delay,
      overwrite: "auto",
    });
  }, [detailOpen, duration, ease, delay, overlayOpacity, prefersReducedMotion]);

  const sectionStyle = { "--information-drawer-text-color": textColor } as CSSProperties;
  const drawerStyle = {
    backgroundColor,
    color: textColor,
    width: drawerWidth,
    transform: detailOpen ? "translateX(0)" : "translateX(100%)",
    transitionDelay: prefersReducedMotion ? "0s" : `${delay}s`,
    transitionDuration: prefersReducedMotion ? "0s" : `${duration}s`,
  } as CSSProperties;

  return (
    <>
      <section
        id="meet"
        className="w-full h-full mt-[10%] pb-[8%] px-[5vw] max-md:pb-[20%] max-md:px-[6vw] max-[1025px]:px-[5vw] relative"
        style={sectionStyle}
      >
        <div className={`container ${detailOpen ? "pointer-events-none" : "pointer-events-auto"}`}>
          <h2
            data-title-anim
            className="text-[5.7vw] w-fit font-display leading-[1.1] uppercase max-md:text-[10vw] max-[1025px]:text-[6.5vw] mb-[3vw] max-md:pt-[10vw]"
          >
           Built by Different Minds
          </h2>
          <p
            data-para-anim
            className="text-[1.9vw] w-[70%] font-medium leading-[1.3] max-md:w-[90%] max-md:text-[3vw] max-[1025px]:w-[85%] max-[1025px]:text-[2.5vw]"
          >
            A multidisciplinary team of designers, developers, strategists, and creative thinkers working together to turn ambitious ideas into thoughtful digital experiences. We bring different perspectives, skills, and creative energy to every project.
          </p>

          <div className="w-full overflow-hidden max-md:overflow-x-scroll max-md:overflow-y-hidden max-md:mt-[5vw] max-md:fadeup max-[1025px]:overflow-x-scroll max-[1025px]:overflow-y-hidden">
            <div
              ref={cardContainer}
              className="grid grid-cols-3 gap-[3vw] mt-[8vw] justify-between gap-y-[3vw] max-md:flex max-md:flex-nowrap max-md:w-fit max-md:overflow-scroll max-md:gap-[5vw] max-md:h-fit max-[1025px]:flex max-[1025px]:flex-nowrap max-[1025px]:w-fit max-[1025px]:overflow-scroll max-[1025px]:gap-[4vw] max-[1025px]:h-fit"
            >
              {teamInfo.length > 0 ? (
                teamInfo.map((member) => {
                  const featuredImageSource = getImageSource(member.featuredImage);

                  return (
                  <div
                    key={member.id ?? member.slug}
                    role="button"
                    tabIndex={0}
                    className="w-full overflow-hidden fadeup"
                    onClick={() => handleDetail(member)}
                    onKeyDown={(event) => handleCardKeyDown(event, member)}
                  >
                    <div className="w-full h-[36vw] group cursor-pointer relative overflow-hidden max-md:w-[75vw] max-md:h-[100vw] max-md:shrink-0 max-[1025px]:w-[55vw] max-[1025px]:h-[70vw] max-[1025px]:shrink-0">
                      <div className="bg-black/40 absolute opacity-0 max-[1025px]:opacity-100 w-8 h-8 rounded-full backdrop-blur-lg text-white flex items-center justify-center top-3 right-3 z-10 text-[4vw] pointer-events-none max-md:opacity-100 max-md:text-[6vw] max-[1025px]:text-[3vw]">
                      <span className="absolute w-[1.5vw] h-[0.2vw] bg-white max-md:w-[3vw] max-md:h-[0.4vw] max-[1025px]:w-[1.5vw] max-[1025px]:h-[0.2vw]"></span>
                      <span className="absolute w-[0.2vw] h-[1.5vw] bg-white max-md:w-[0.4vw] max-md:h-[3vw] max-[1025px]:w-[0.2vw] max-[1025px]:h-[1.5vw]"></span>
                      </div>
                      {featuredImageSource && (
                        <Image
                          loading="lazy"
                          src={featuredImageSource}
                          alt={`${member?.title ?? "Member"} Image`}
                          fill
                          className={`object-cover group-hover:grayscale ${
                            prefersReducedMotion ? "" : "transition duration-300"
                          }`}
                        />
                      )}
                      <div className="absolute w-full px-[2vw] py-[1.5vw] z-[2] bottom-0 overflow-hidden translate-y-full bg-black/40 backdrop-blur-lg group-hover:translate-y-0 max-[1025px]:translate-y-0 duration-300 ease-out max-md:py-[3vw] max-md:px-[3vw] max-[1025px]:py-[3vw]">
                        <div className=" flex w-full justify-between h-full">
                          <div className="flex flex-col max-[1025px]:w-[100%]">
                            <h4 className="text-[1.8vw] font-display leading-[1.3] uppercase max-md:text-[6vw] max-[1025px]:text-[2.4vw]">
                              {member?.title ?? "—"}
                            </h4>
                            <p className="max-md:w-full max-md:leading-[1.3] max-md:text-[3vw] text-[1.2vw] max-[1025px]:text-[2vw]">
                              {member?.teams?.designation ?? ""}
                            </p>
                          </div>
                          <div className="max-md:flex max-md:items-center">
                            <svg
                              className="relative -rotate-[135deg] w-[2.3vw] h-[2.3vw] overflow-hidden max-md:w-[7vw] max-md:h-[7vw] max-[1025px]:w-[4vw] max-[1025px]:h-[4vw]"
                              width="19"
                              height="23"
                              viewBox="0 0 19 23"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                className="origin-center -translate-y-[110%] scale-0 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500 ease-out"
                                d="M9.44186 23C9.38605 22.9324 9.33953 22.8559 9.27442 22.7973C6.25116 19.8649 3.22791 16.9369 0.204652 14.009C0.139535 13.9459 0.0604662 13.8964 1.30208e-06 13.8468C0.576745 13.2973 1.12558 12.7748 1.66512 12.2613C3.82326 14.3514 6.01861 16.4775 8.2093 18.6036C8.23256 18.5901 8.26047 18.5811 8.28372 18.5676C8.28372 12.3829 8.28372 6.19369 8.28372 -4.68423e-07C9.09768 -4.32844e-07 9.87442 -3.98892e-07 10.6744 -3.63923e-07C10.6744 6.19369 10.6744 12.3784 10.6744 18.5901C12.893 16.4369 15.0884 14.3108 17.2651 12.2027C17.8465 12.7568 18.3907 13.2838 19 13.8739C18.9488 13.9009 18.8558 13.9324 18.7907 13.9955C15.7581 16.9279 12.7302 19.8649 9.70233 22.7973C9.64186 22.8559 9.5907 22.9324 9.53488 23C9.50698 23 9.47442 23 9.44186 23Z"
                                fill="#ffffff"
                              />
                              <path
                                className="origin-center group-hover:scale-0 group-hover:translate-y-[110%] transition-all duration-500 ease-out"
                                d="M9.44186 23C9.38605 22.9324 9.33953 22.8559 9.27442 22.7973C6.25116 19.8649 3.22791 16.9369 0.204652 14.009C0.139535 13.9459 0.0604662 13.8964 1.30208e-06 13.8468C0.576745 13.2973 1.12558 12.7748 1.66512 12.2613C3.82326 14.3514 6.01861 16.4775 8.2093 18.6036C8.23256 18.5901 8.26047 18.5811 8.28372 18.5676C8.28372 12.3829 8.28372 6.19369 8.28372 -4.68423e-07C9.09768 -4.32844e-07 9.87442 -3.98892e-07 10.6744 -3.63923e-07C10.6744 6.19369 10.6744 12.3784 10.6744 18.5901C12.893 16.4369 15.0884 14.3108 17.2651 12.2027C17.8465 12.7568 18.3907 13.2838 19 13.8739C18.9488 13.9009 18.8558 13.9324 18.7907 13.9955C15.7581 16.9279 12.7302 19.8649 9.70233 22.7973C9.64186 22.8559 9.5907 22.9324 9.53488 23C9.50698 23 9.47442 23 9.44186 23Z"
                                fill="#ffffff"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })
              ) : (
                <p className="col-span-full py-10">No team members yet.</p>
              )}
            </div>
          </div>
        </div>

        <div
          data-lenis-prevent
          id="team-detail"
          className={`fixed inset-0 z-[204] overflow-visible bg-transparent detail-section ${
            detailOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            ref={overlayRef}
            onClick={handleClose}
            className={`absolute inset-0 bg-[#000000] detail-overlay opacity-0 ${
              detailOpen ? "pointer-events-auto opacity-100" : "pointer-events-none"
            }`}
          ></div>
          <div
            ref={drawerRef}
            className="fixed inset-y-0 right-0 z-[205] flex flex-col gap-[2vw] overflow-y-auto overflow-x-hidden px-[5vw] pointer-events-auto transition-transform ease-in-out max-md:!w-full max-md:gap-[5vw] max-[1025px]:!w-full max-[1025px]:gap-[3vw]"
            style={drawerStyle}
          >
            <TeamDetail teams={teamInfo} member={selectedMember} handleClose={handleClose} textColor={textColor} />
          </div>
        </div>
      </section>
    </>
  );
}

function TeamDetail({
  member,
  handleClose,
  teams,
  textColor,
}: {
  member: TeamMember | null;
  handleClose: () => void;
  teams: TeamMember[];
  textColor: string;
}) {
  if (!member) return null;

  const memberIndex = teams.findIndex((item) => item.id === member.id);
  const featuredImageSource = getImageSource(member.featuredImage);
  const profileImageSource = getImageSource(member.teams.profilePicture);

  return (
    <>
      <div className="w-full flex justify-between pt-[10%] max-md:pt-[20%]">
        <button
          type="button"
          aria-label="Close"
          className="w-[3vw] h-[3vw] cursor-pointer relative flex items-center justify-center rounded-full border border-current max-md:w-[11vw] max-md:h-[11vw] max-[1025px]:w-[7vw] max-[1025px]:h-[7vw] "
          onClick={handleClose}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[45%] h-[45%]">
            <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-[1.5vw] max-md:text-[5.5vw] max-[1025px]:text-[2.5vw]">
          {memberIndex + 1}/{teams.length}
        </span>
      </div>
      <div className="w-full h-[1px] py-[0.01vw] bg-current lineDraw max-md:my-[4vw] max-md:py-[0.1vw] max-[1025px]:my-[2vw]"></div>
      <div className="w-full flex gap-[2vw] max-md:flex-col max-md:gap-[5vw]">
        {featuredImageSource && (
          <div className="w-[25vw] rounded-xl overflow-hidden h-[30vw] relative max-md:w-[90vw] max-md:h-[120vw] max-[1025px]:w-[40vw] max-[1025px]:h-[50vw]">
            <Image
              src={featuredImageSource}
              alt={`${member.title} Image`}
              className="object-cover object-top"
              fill
            />
          </div>
        )}
        <div className="max-[1025px]:w-[30%]">
          <h2 className="text-[4vw]  font-display leading-[1.1] max-md:text-[12vw] max-md:mb-[2vw] max-[1025px]:text-[7.5vw]">
            {member.title}
          </h2>
          <p className="text-[1.2vw] font-medium max-md:text-[5.5vw] max-[1025px]:text-[3vw]">
            {member.teams.designation}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-[1.5vw] text-[1.5vw] font-medium max-md:text-[5.5vw] max-md:gap-[4vw] max-[1025px]:text-[3vw] max-[1025px]:gap-[2vw]">
        <div className="space-y-[1.5vw] max-md:space-y-[3vw] leading-[1.4]" dangerouslySetInnerHTML={{ __html: member.content }} />

        <div className="flex gap-[2vw] items-end mt-[1vw] mb-[5%] max-md:mb-[10%] max-[1025px]:mb-[10%] max-md:gap-[6vw] max-[1025px]:gap-[4vw]">
          {member.teams.linkedin && (
            <Link
              target="_blank"
              href={member.teams.linkedin}
              className="opacity-55 hover:opacity-100 duration-300 w-[1.5vw] max-[1025px]:w-[4vw] max-md:w-[6vw]"
              style={{ color: textColor }}
            >
              <svg viewBox="0 0 37 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.8072 35.3548C12.7917 35.2159 12.7686 35.0769 12.7686 34.938C12.7686 27.2802 12.7686 19.6146 12.7686 11.9568C12.7686 11.8178 12.7686 11.6789 12.7686 11.5091C15.4241 11.5091 18.0487 11.5091 20.7043 11.5091C20.7043 12.5975 20.7043 13.6783 20.7043 14.7667C20.7352 14.7822 20.7583 14.7976 20.7892 14.813C20.9127 14.6664 21.0362 14.5197 21.1675 14.3807C22.6496 12.7287 24.3711 11.4087 26.602 11.0536C30.2688 10.4824 34.4374 11.895 36.1434 16.4882C36.5835 17.6847 36.8382 18.9199 36.9231 20.1936C36.9308 20.3171 36.9694 20.4406 37.0003 20.5641C37.0003 25.4969 37.0003 30.422 37.0003 35.3548C34.3525 35.3548 31.7124 35.3548 29.0646 35.3548C29.0646 35.185 29.0569 35.0229 29.0569 34.8531C29.0569 30.8543 29.0646 26.8479 29.0492 22.8491C29.0414 22.0617 28.972 21.2589 28.833 20.4792C28.3775 17.9858 26.4168 16.7352 23.9542 17.3296C22.225 17.7465 20.766 19.5297 20.7506 21.3438C20.7274 25.991 20.7352 30.6305 20.7352 35.2776C20.7352 35.3008 20.7429 35.3317 20.7506 35.3548C18.0951 35.3548 15.455 35.3548 12.8072 35.3548Z" />
                <path d="M0.478818 35.355C0.471098 35.2006 0.463379 35.0462 0.463379 34.8918C0.463379 27.2571 0.463379 19.6147 0.463379 11.9801C0.463379 11.8257 0.463379 11.679 0.463379 11.5015C3.1112 11.5015 5.72813 11.5015 8.41455 11.5015C8.41455 19.4526 8.41455 27.4038 8.41455 35.355C5.77445 35.355 3.12663 35.355 0.478818 35.355Z" />
                <path d="M4.59731e-05 4.12196C0.00776555 2.05311 1.40501 0.416562 3.45842 0.0923393C4.79391 -0.116089 6.08308 -0.00801527 7.21014 0.794821C8.62282 1.80609 9.13231 3.24965 8.83897 4.91708C8.54562 6.60767 7.44944 7.64981 5.80517 8.08211C4.70127 8.37545 3.59737 8.32913 2.52435 7.91228C0.957274 7.29471 -0.00767361 5.83571 4.59731e-05 4.12196Z" />
              </svg>
            </Link>
          )}
        </div>

        {profileImageSource && (
          <div className="w-[62vw] overflow-hidden rounded-xl h-[35vw] relative mb-[5%] max-md:w-[90vw] max-md:h-[90vw] max-md:mb-[10%] max-[1025px]:mb-[10%] max-[1025px]:w-[70vw] max-[1025px]:h-[50vw]">
            <Image
              src={profileImageSource}
              loading="lazy"
              alt={`${member.title} Featured Image`}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </>
  );
}
