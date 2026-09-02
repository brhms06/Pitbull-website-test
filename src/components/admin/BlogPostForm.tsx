'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { PartialBlock } from '@blocknote/core';
import {
  createBlogPost,
  updateBlogPost,
  fetchBlogPostByRowId,
  uploadBlogImage,
  slugify,
  type BlogPostInput,
} from '@/lib/db';
import { site } from '@/data/site';
import { ArrowRightIcon } from '@/components/Icons';

const BlockNoteEditor = dynamic(() => import('./BlockNoteEditor'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-sand/50" />,
});

const empty: BlogPostInput = {
  slug: '',
  title: '',
  excerpt: '',
  contentJson: [],
  contentHtml: '',
  featuredImage: '',
  ogImage: '',
  metaTitle: '',
  metaDescription: '',
  tags: [],
  author: site.name,
  published: false,
  publishedAt: null,
};

/**
 * Build a readable message from whatever a failed save throws. Supabase returns
 * a plain object ({ message, code, details, hint }) rather than an Error, so an
 * `e instanceof Error` check always falls through to a vague message and hides
 * the real cause. This surfaces the actual reason on the page.
 */
function readError(e: unknown): string {
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object') {
    const o = e as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
    const parts = [o.message, o.details, o.hint].filter((p): p is string => typeof p === 'string' && p.trim().length > 0);
    const text = parts.join(' — ');
    if (text) return o.code ? `${text} (code ${String(o.code)})` : text;
  }
  return 'Save failed. Please try again.';
}

/** Reject if a promise doesn't settle in time, so a stalled upload or DB write surfaces a clear error instead of hanging on "Saving…" forever. */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s. Check your internet connection, or try a smaller file.`)), ms),
    ),
  ]);
}

export default function BlogPostForm({ rowId }: { rowId?: string }) {
  const router = useRouter();
  const editing = Boolean(rowId);

  const [form, setForm] = useState<BlogPostInput>(empty);
  const [tagsText, setTagsText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!rowId) return;
    fetchBlogPostByRowId(rowId)
      .then((post) => {
        if (!post) {
          setError('Post not found.');
          return;
        }
        setForm({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          contentJson: post.contentJson,
          contentHtml: post.contentHtml,
          featuredImage: post.featuredImage,
          ogImage: post.ogImage,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          tags: post.tags,
          author: post.author,
          published: post.published,
          publishedAt: post.publishedAt,
        });
        setTagsText(post.tags.join(', '));
        setSlugTouched(true);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load.'))
      .finally(() => setLoading(false));
  }, [rowId]);

  const set = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onTitle = (value: string) => {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const fail = (msg: string) => {
      setError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (!form.title.trim()) {
      fail('Please enter a title.');
      return;
    }
    setSaving(true);
    try {
      const slug = (form.slug || slugify(form.title)).trim();
      let featuredImage = form.featuredImage;
      if (imageFile) {
        featuredImage = await withTimeout(uploadBlogImage(imageFile, slug), 120000, 'Image upload');
      }
      const payload: BlogPostInput = {
        ...form,
        slug,
        featuredImage,
        tags: tagsText.split(',').map((s) => s.trim()).filter(Boolean),
        publishedAt: form.publishedAt ?? (form.published ? new Date().toISOString() : null),
      };
      if (rowId) await withTimeout(updateBlogPost(rowId, payload), 30000, 'Saving to database');
      else await withTimeout(createBlogPost(payload), 30000, 'Saving to database');
      router.push('/admin/blog');
      router.refresh();
    } catch (e) {
      setSaving(false);
      fail(readError(e));
    }
  };

  if (loading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-sand/50" />;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/blog" className="text-sm font-semibold text-forest-600 hover:underline">
        ← Back to blog
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold text-forest-800">{editing ? `Edit ${form.title || 'post'}` : 'Write a new post'}</h1>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Basics */}
          <section className="card space-y-4 p-6">
            <h2 className="text-lg font-extrabold text-forest-800">Basics</h2>
            <Field label="Title" required>
              <input className="input" value={form.title} onChange={(e) => onTitle(e.target.value)} />
            </Field>
            <Field label="Slug" hint="Used in the post URL">
              <input
                className="input"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Excerpt" hint="Shown on the blog list and used as a fallback description">
              <textarea rows={2} className="input" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
            </Field>
            <Field label="Author">
              <input className="input" value={form.author} onChange={(e) => set('author', e.target.value)} />
            </Field>
            <label className="flex items-center gap-3 text-sm font-semibold text-forest-800">
              <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="h-5 w-5 rounded border-sand text-forest focus:ring-forest" />
              Published (visible on the live site)
            </label>
          </section>

          {/* Content */}
          <section className="card space-y-4 p-6">
            <h2 className="text-lg font-extrabold text-forest-800">Content</h2>
            <BlockNoteEditor
              key={rowId ?? 'new'}
              initialContent={form.contentJson.length > 0 ? (form.contentJson as PartialBlock[]) : undefined}
              uploadFile={(file) => uploadBlogImage(file, form.slug || slugify(form.title) || 'post')}
              onChange={(blocks, html) => setForm((f) => ({ ...f, contentJson: blocks, contentHtml: html }))}
            />
          </section>
        </div>

        <aside className="space-y-6">
          {/* Featured image */}
          <section className="card space-y-4 p-6">
            <h2 className="text-lg font-extrabold text-forest-800">Featured image</h2>
            {(form.featuredImage || imageFile) && (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.featuredImage}
                alt=""
                className="h-40 w-full rounded-xl object-cover"
              />
            )}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-sand bg-cream/40 px-4 py-6 text-center transition hover:border-forest/40">
              <span className="text-sm font-semibold text-forest-800">{form.featuredImage || imageFile ? 'Replace image' : 'Click to upload'}</span>
              <span className="text-xs text-muted">JPG or PNG</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) setImageFile(file);
                }}
              />
            </label>
          </section>

          {/* SEO */}
          <section className="card space-y-4 p-6">
            <h2 className="text-lg font-extrabold text-forest-800">SEO</h2>
            <Field label="Meta title" hint={`${form.metaTitle.length}/60 — leave blank to use the title`}>
              <input className="input" value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} />
            </Field>
            <Field label="Meta description" hint={`${form.metaDescription.length}/160 — leave blank to use the excerpt`}>
              <textarea rows={3} className="input" value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} />
            </Field>
            <Field label="Tags" hint="Comma separated, e.g. puppy care, breed info">
              <input className="input" value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
            </Field>
          </section>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-70">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Publish post'}
              {!saving && <ArrowRightIcon className="h-5 w-5" />}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">
        {label} {required && <span className="text-ember">*</span>}
        {hint && <span className="ml-1 font-normal text-muted">— {hint}</span>}
      </span>
      {children}
    </label>
  );
}
