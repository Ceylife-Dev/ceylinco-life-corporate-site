import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Tag } from "@/components/ui";
import { placeholderPages } from "@/content/navigation";

/*
 * PLACEHOLDER pages. Every internal link in the header menus (and Get a quote,
 * and Search) lands here, so nothing shows an error while the real pages are
 * built. When a real page exists, create its own folder (for example
 * src/app/products/life-insurance/page.tsx) and it takes over automatically.
 */

type Params = Promise<{ slug: string[] }>;

const pathFromSlug = (slug: string[]) => `/${slug.join("/")}`;
const findPage = (slug: string[]) => placeholderPages().find((page) => page.href === pathFromSlug(slug));

/** Tells Next.js which addresses exist, so they are prepared in advance. */
export function generateStaticParams() {
  return placeholderPages().map((page) => ({ slug: page.href.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = findPage((await params).slug);
  return { title: page?.title };
}

/** Reads the address, so it sits inside <Suspense> (Next.js asks for this on any page that reads `params`). */
async function PlaceholderContent({ params }: { params: Params }) {
  const page = findPage((await params).slug);
  if (!page) notFound();

  return (
    <>
      <h1>{page.title}</h1>
      <p className="max-w-prose text-ink-muted">
        This page has not been designed yet. It exists so the link you followed has somewhere to go.
      </p>
    </>
  );
}

export default function PlaceholderPage({ params }: { params: Params }) {
  return (
    <main id="main-content" className="mx-auto flex max-w-page flex-col items-start gap-4 px-4 py-16 md:px-6 md:py-24">
      <Tag tone="outline">Placeholder page</Tag>
      <Suspense>
        <PlaceholderContent params={params} />
      </Suspense>
    </main>
  );
}
