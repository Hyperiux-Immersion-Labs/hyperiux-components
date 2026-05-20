import React from "react";
import CodeBlock from "../DetailPage/CodeBlock";
import ImageComp from "../DetailPage/ImageComp";
import Heading from "../Articles/Heading";
import Heading2 from "../Articles/Heading2";
import Para from "../Articles/Para";
import List from "../Articles/List";
import LineBreak from "../Articles/LineBreak";
import Takeaways from "../Articles/Takeaways";

const Content = () => {
  const jsSnippet = `
// Push neighbors outward
neighbors.forEach(n => {
  const dx = n.pos.x - pos.x, dy = n.pos.y - pos.y;
  const d = Math.hypot(dx, dy) || 1;
  const push = Math.max(0, 70 - d) / 70;
  n.targetPos = {
    x: n.originalPos.x + (dx / d) * 20 * push,
    y: n.originalPos.y + (dy / d) * 20 * push,
  };
});

// Easing back to rest
pos.x += (targetPos.x - pos.x) * 0.1;
pos.y += (targetPos.y - pos.y) * 0.1;
`.trim();

  const jsSnippet2 = `
const alpha = Math.max(0, 1 - dist / 300);
ctx.strokeStyle = "rgba(0,0,0,{alpha})";
`.trim();

  const jsSnippet3 = `
dx += (mx - x - dx) * 0.035;
dy += (my - y - dy) * 0.035;
angle = Math.atan2(dy, dx);
`.trim();

  const jsSnippet4 = `
const d = Math.hypot(dx, dy) || 1;
const ux = dx / d, uy = dy / d;
ctx.moveTo(x, y);
ctx.lineTo(x + ux * 30, y + uy * 30);
`.trim();

  const jsSnippet5 = `
if (mouseInside && L < Lmax) L = Math.min(L + 0.05, Lmax);
if (!mouseInside && L > 0)    L = Math.max(L - 0.05, 0);

if (L === 0) {
  ctx.arc(x, y, 2, 0, Math.PI * 2);
} else {
  const d = Math.hypot(dx, dy) || 1;
  ctx.lineTo(x + (dx/d) * L, y + (dy/d) * L);
}
`.trim();

  const jsSnippet6 = `
const dx = mx - x, dy = my - y;
const angle = Math.atan2(dy, dx);
const dist  = Math.hypot(dx, dy);
`.trim();

  const jsSnippet7 = `
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  items.forEach(o => {
    o.update(mx, my);
    o.draw(ctx);
  });
  requestAnimationFrame(loop);
}
`.trim();

  return (
    <section className="!pb-0 article-body overflow-x-hidden" id="article">
      <div className="space-y-[3vw] mobile:space-y-[10vw]">
        <div className="space-y-[1vw] mobile:space-y-[3vw]">
          <Heading text={"When Simple Vectors Create Magic"} />
          <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
            <Para
              text={
                "This is not WebGL. No particle physics. No frameworks doing the heavy lifting. Just raw canvas, direction vectors, and the subtle physics of interaction."
              }
            />
            <Para
              text={
                "At its core is a grid of agents - dots, arrows, or lines - that react to your cursor in real time."
              }
            />
            <Para
              text={
                "And with just three principles, the entire system comes to life:"
              }
            />
            <List
              items={[
                "<span class='font-medium'>Direction</span>: Where is the mouse? → atan2(dy, dx)",
                "<span class='font-medium'>Distance</span>: How far away? → hypot(dx, dy)",
                "<span class='font-medium'>Easing</span>: Move smoothly → interpolate frame by frame",
              ]}
            />
            <Para
              text={
                "From these alone emerge five distinct interaction modes - each with its own personality, rhythm, and visual identity."
              }
            />
          </div>
        </div>

        <LineBreak />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading text={"Arrow Grid - A Breathing Field"} />
          <Para
            text={
              "What you see: a dense canvas of arrows, all pointing toward the mouse. Hover near one, and nearby arrows push away, like air disturbed by presence."
            }
          />
          <Heading2 text={"How it works"} />
          <Para text={"Each arrow stores:"} />
          <List
            items={[
              "<span class='font-medium'>originalPos</span>: its anchor point",
              "<span class='font-medium'>targetPos</span>: where it is currently being pulled",
              "<span class='font-medium'>pos</span>: where it is now",
            ]}
          />
          <Para
            text={
              "On hover, nearby arrows are gently displaced outward, then eased back."
            }
          />
        </div>

        <CodeBlock code={jsSnippet} language="javascript" />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading2 text={"Why it feels right"} />
          <Para
            text={
              "Immediate direction plus local displacement gives it weight and softness - like ripples on cloth."
            }
          />
        </div>

        <ImageComp
          src={"/assets/articles/arrows/dynamic-arrow.png"}
          alt={"dynamic-arrows"}
        />

        <LineBreak />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading text={"Arrow Opacity - A Dynamic Spotlight"} />
          <Para
            text={
              "What you see: a halo of clarity around the mouse. Arrows closest to the cursor glow; those farther out fade to silence."
            }
          />
          <Heading2 text={"How it works"} />
          <Para
            text={
              "Using the same rotation logic, a radial alpha gradient is layered in."
            }
          />
        </div>

        <CodeBlock code={jsSnippet2} language="javascript" />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading2 text={"Why it feels right"} />
          <Para
            text={
              "Your eye is drawn where the density is highest. The motion becomes focus, not just form."
            }
          />
        </div>

        <ImageComp
          src={"/assets/articles/arrows/opacity-arrow.png"}
          alt={"opacity-arrows"}
        />

        <LineBreak />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading text={"Arrow Limit - Mass and Momentum"} />
          <Para
            text={
              "What you see: a sparse field of larger arrows, each with subtle inertia. They do not snap - they lean, lag, and follow like heavy objects caught in fluid."
            }
          />
          <Heading2 text={"How it works"} />
          <Para
            text={
              "Instead of computing angle instantly, the vector is eased before rotation:"
            }
          />
        </div>

        <CodeBlock code={jsSnippet3} language="javascript" />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading2 text={"Why it feels right"} />
          <Para text={"This is motion with weight. Small inertia creates big realism."} />
        </div>

        <LineBreak />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading text={"Vector Lines - Direction, Stripped Bare"} />
          <Para
            text={
              "What you see: minimalist lines radiating toward the cursor. No easing. No scaling. Just movement distilled into geometry."
            }
          />
          <Heading2 text={"How it works"} />
          <Para
            text={
              "The distance vector is converted into a unit vector and drawn as a short segment."
            }
          />
        </div>

        <CodeBlock code={jsSnippet4} language="javascript" />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading2 text={"Why it feels right"} />
          <Para text={"The most honest expression of vector motion. Clean. Directional. Exact."} />
        </div>

        <ImageComp
          src={"/assets/articles/arrows/particle-lines.png"}
          alt={"particle-lines"}
        />

        <LineBreak />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading text={"Particle Morph - Dots That Stretch Into Lines"} />
          <Para
            text={
              "What you see: at rest, it is a grid of dots. Move your cursor in, and each dot transforms - growing a small tail, like a compass needle finding its north."
            }
          />
          <Heading2 text={"How it works"} />
          <Para
            text={
              "A global L controls line length. On cursor enter, it eases up. On exit, it eases back down."
            }
          />
        </div>

        <CodeBlock code={jsSnippet5} language="javascript" />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading2 text={"Why it feels right"} />
          <Para
            text={
              "You do not just see a state change - you feel it through gradual elongation. From particle to pointer."
            }
          />
        </div>

        <ImageComp src={"/assets/articles/arrows/particles.png"} alt={"particles"} />

        <LineBreak />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading text={"The Mental Model Shared by All"} />
          <Para text={"At the core of each variation is the same loop:"} />
        </div>

        <CodeBlock code={jsSnippet6} language="javascript" />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <List
            items={[
              "Angle drives rotation",
              "Distance controls falloff, alpha, or scale",
              "Easing makes it human",
            ]}
          />
        </div>

        <LineBreak />

        <div className="space-y-[1vw] tablet:space-y-[2.5vw] mobile:space-y-[3vw]">
          <Heading text={"The Universal Loop"} />
          <Para
            text={
              "Every variation shares a frame loop that clears the canvas, updates logic, and redraws with new data:"
            }
          />
        </div>

        <CodeBlock code={jsSnippet7} language="javascript" />

        <LineBreak />

        <Takeaways content={takeawaysContent} />
      </div>
    </section>
  );
};

export default Content;

const takeawaysContent = {
  heading: "Final Thought: Interaction by Intuition",
  para: "Three basic inputs - direction, distance, easing - become a toolkit for emotion, weight, and feeling.",
  list: [
    "With just canvas and code, you can create an entire language of motion.",
    "The strongest interactions often come from the simplest rules.",
    "And it all begins with one vector.",
  ],
};