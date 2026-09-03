import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { fetchPublishedBlogPostsServer } from '@/lib/db.server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchPublishedBlogPostsServer();

  const staticRoutes = [
    '',
    '/about',
    '/dogs',
    '/reserve',
    '/contact',
    '/blog',
    '/privacy',
    '/terms',
    '/faq',
    '/puppy-delivery',
    '/testimonials',
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...blogRoutes];
}
