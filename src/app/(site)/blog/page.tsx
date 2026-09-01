import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { blogPosts } from '@/data/blog';
import { site } from '@/data/site';

const heroImg = 'https://placedog.net/1400/700?id=96';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest articles about American Bully puppies, care tips, and breeder news.',
};

export default function BlogPage() {
  const publishedPosts = blogPosts.filter((p) => p.published);

  const blogPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `Blog | ${site.name}`,
    url: `${site.url}/blog`,
    publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: `${site.url}/logo.svg` } },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${site.url}/blog` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([blogPageSchema, breadcrumbJsonLd]) }} />
      <PageHero title="Our Blog" subtitle="Tips, news, and everything you need to know about American Bully puppies." image={heroImg} breadcrumb="Blog" />

      <section className="container-page py-14 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post) => (
            <article key={post.id} className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-video overflow-hidden">
                <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
                  <img src={post.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-semibold text-forest-600">
                  {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <Link href={`/blog/${post.slug}`} className="mt-2 block">
                  <h2 className="text-xl font-extrabold leading-tight text-forest-800 transition group-hover:text-forest">{post.title}</h2>
                </Link>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/80">{post.excerpt}</p>
                <div className="mt-auto pt-6">
                  <Link href={`/blog/${post.slug}`} className="btn-ghost px-0 text-sm">
                    Read article &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
