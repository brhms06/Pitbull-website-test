'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAllBlogPosts, deleteBlogPost, importSeedBlogPosts, setBlogPostPublished, type AdminBlogPost } from '@/lib/db';
import { ArrowRightIcon, MegaphoneIcon } from '@/components/Icons';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await fetchAllBlogPosts());
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (post: AdminBlogPost) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteBlogPost(post.rowId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.');
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (post: AdminBlogPost) => {
    setBusy(true);
    try {
      await setBlogPostPublished(post.rowId, !post.published, post.publishedAt);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change visibility.');
    } finally {
      setBusy(false);
    }
  };

  const onImport = async () => {
    setBusy(true);
    try {
      await importSeedBlogPosts();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-800">Blog</h1>
          <p className="mt-1 text-muted">
            {loading ? 'Loading…' : `${posts.length} post${posts.length === 1 ? '' : 's'}`} — published posts appear on the live site.
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary">
          Write a post <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-sand/50" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <MegaphoneIcon className="h-12 w-12 text-forest-300" />
          <p className="text-lg font-semibold text-forest-800">No posts yet</p>
          <p className="max-w-md text-sm text-muted">Write your first post, or import the sample posts to get started quickly. You can edit or delete them afterwards.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/admin/blog/new" className="btn-primary">
              Write a post
            </Link>
            <button type="button" onClick={onImport} disabled={busy} className="btn-ghost disabled:opacity-60">
              {busy ? 'Importing…' : 'Import sample posts'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-sand bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand/50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Post</th>
                <th className="px-4 py-3">Live</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {posts.map((post) => (
                <tr key={post.rowId} className="hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={post.featuredImage || 'https://placehold.co/80x80?text=Post'} alt={post.title} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-forest-800">{post.title || 'Untitled post'}</p>
                        <p className="text-xs text-muted">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => togglePublish(post)}
                      disabled={busy}
                      title={post.published ? 'Tap to hide from the website' : 'Tap to publish to the website'}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-60 ${
                        post.published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-ember text-white hover:bg-ember-600'
                      }`}
                    >
                      {post.published ? 'Live ✓' : 'Publish'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link href={`/admin/blog/${post.rowId}/edit`} className="btn-ghost px-3 py-1.5 text-xs">
                        Edit
                      </Link>
                      <button type="button" onClick={() => onDelete(post)} disabled={busy} className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
