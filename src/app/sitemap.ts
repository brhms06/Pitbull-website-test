import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { fetchPublicDogsServer, fetchPublishedBlogPostsServer } from '@/lib/db.server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dogs, posts] = await Promise.all([fetchPublicDogsServer(), fetchPublishedBlogPostsServer()]);

  const staticRoutes = ['', '/about', '/dogs', '/reserve', '/contact', '/blog', '/privacy', '/terms'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const dogRoutes = dogs.map((dog) => ({
    url: `${site.url}/dogs/${dog.id}`,
    lastModified: new Date(),
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...dogRoutes, ...blogRoutes];
}
