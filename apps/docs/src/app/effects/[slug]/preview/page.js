import { notFound } from"next/navigation";
import { getEffectBySlug, getAllEffectSlugs } from"@/lib/registry";
import { getEffectConfig } from"@/lib/effect-configs";
import { FullscreenPreview } from"./fullscreen-preview";

export async function generateStaticParams() {
 const slugs = getAllEffectSlugs();
 return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
 const { slug } = await params;
 const effect = getEffectBySlug(slug);

 if (!effect) {
 return { title:"Preview Not Found" };
 }

 return {
 title: `${effect.title} Preview | Hyperiux UI`,
 description: `Live preview of ${effect.title}`,
 };
}

export default async function PreviewPage({ params }) {
 const { slug } = await params;
 const effect = getEffectBySlug(slug);

 if (!effect) {
 notFound();
 }

 const config = getEffectConfig(slug);

 return <FullscreenPreview slug={slug} effect={effect} config={config} />;
}
