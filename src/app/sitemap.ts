import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { blogPosts } from '@/data/blog';
import { fetchPublicDogsServer } from '@/lib/db.server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dogs = await fetchPublicDogsServer();

  const staticRoutes = ['', '/about', '/dogs', '/contact', '/blog', '/privacy', '/terms'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const dogRoutes = dogs.map((dog) => ({
    url: `${site.url}/dogs/${dog.id}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts
    .filter((p) => p.published)
    .map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    }));

  return [...staticRoutes, ...dogRoutes, ...blogRoutes];
}
