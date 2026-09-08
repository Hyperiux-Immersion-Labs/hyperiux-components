// Built using Hyperiux Vault: https://vault.hyperiux.com
import InformationDrawerComp, { type InformationDrawerCompProps, type TeamMember } from "./InformationDrawerComp";


export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "1",
    slug: "amara-okafor",
    title: "Amara Okafor",
    content:
      "<p>Amara leads brand strategy, turning ambiguous briefs into positioning that clients can actually build a company around. She spends the first two weeks of every engagement asking questions most agencies skip, and it shows in how quickly the work converges.</p><p>Before joining, she ran strategy teams at two design studios in London and Lagos, working across finance, hospitality, and consumer tech. She's most interested in the gap between what a brand says about itself and what its product actually does.</p><p>Outside of client work, Amara mentors early-career strategists and writes occasionally about positioning frameworks that don't collapse the moment a competitor copies them.</p>",
    featuredImage: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portrait-1.png",
    teams: {
      designation: "Head of Strategy",
      linkedin: "https://www.linkedin.com",
    },
  },
  {
    id: "2",
    slug: "daniel-reyes",
    title: "Daniel Reyes",
    content:
      "<p>Daniel designs interfaces that hold up under real usage, not just in a showcase reel. Motion, type, and grid systems are his daily tools, and he'd rather ship a slightly less flashy interaction that never jitters than a spectacular one that breaks on the third viewport size he tests.</p><p>He came up through in-house product teams before moving into studio work, which shows in how much he cares about states most designers skip - empty, loading, error, and the ugly middle of a long list. Every project he leads gets a pass for those before it ships.</p><p>He's currently obsessed with reducing the gap between design files and shipped code, and spends a fair amount of time building small internal tools to close it.</p>",
    featuredImage: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portrait-2.png",
    teams: {
      designation: "Design Director",
      linkedin: "https://www.linkedin.com",
    },
  },
  {
    id: "3",
    slug: "priya-menon",
    title: "Priya Menon",
    content:
      "<p>Priya builds the animation and interaction layer for every project, from scroll choreography to micro-interactions that make a page feel alive. Her rule of thumb: if you notice the animation before you notice what it's telling you, it's wrong.</p><p>She works closely with design from the earliest wireframes rather than being handed a finished comp to animate, which is why so much of the studio's motion work reads as intentional instead of decorative. Performance budgets are non-negotiable on her projects - nothing ships if it drops frames on a mid-range phone.</p><p>When she's not tuning easing curves, she's usually deep in a rabbit hole about how physical materials move, which somehow always ends up back in a spring config.</p>",
    featuredImage: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portrait-3.png",
    teams: {
      designation: "Lead Motion Engineer",
      linkedin: "https://www.linkedin.com"
    },
  },
  {
    id: "4",
    slug: "marcus-lindqvist",
    title: "Marcus Lindqvist",
    content:
      "<p>Marcus runs client relationships end to end, keeping ambitious timelines honest and every project shipping on schedule. He's the person who tells a client their launch date is unrealistic in week one, which tends to save everyone a much worse conversation in week eleven.</p><p>His background is split between agency production and a few years running operations at a small product company, so he understands both sides of the table - what a studio needs to do great work, and what a client actually needs to justify the spend internally.</p><p>He keeps every project's scope, budget, and timeline visible to the whole team at all times, on the theory that surprises are the only real project risk worth worrying about.</p>",
    featuredImage: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portrait-4.png",
    teams: {
      designation: "Producer",
      linkedin: "https://www.linkedin.com"
    },
  },
  {
    id: "5",
    slug: "sofia-almeida",
    title: "Sofia Almeida",
    content:
      "<p>Sofia writes the copy and content strategy behind every brand voice we ship, working closely with strategy and design from day one rather than being brought in at the end to fill placeholder text. That's usually the difference between a headline that fits the layout and one that fits the brand.</p><p>She's written for everything from three-person startups to companies going through a full rebrand, and has a particular interest in how a brand's voice needs to flex across a homepage, a support email, and an error message without losing its identity in any of them.</p><p>She also runs the studio's internal writing guidelines, which exist mostly so five different people don't invent five different ways to describe the same product feature.</p>",
    featuredImage: "https://pub-8abee449136941f5b0a1cd2c014534e9.r2.dev/vault-listing-images/assets-images/portrait-5.png",
    teams: {
      designation: "Content Lead",
      linkedin: "https://www.linkedin.com"
    },
  }
];

export default function InformationDrawer(props: Omit<InformationDrawerCompProps, "teams">) {
  return <InformationDrawerComp teams={DEFAULT_TEAM} {...props} />;
}
