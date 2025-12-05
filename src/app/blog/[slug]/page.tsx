import { getPostBySlug } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="container mx-auto py-10 px-4 max-w-3xl">
            <Button asChild variant="outline" className="mb-6">
                <Link href="/">← Back to Home</Link>
            </Button>

            <h1 className="text-4xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

            <div className="text-gray-500 mb-8">
                {new Date(post.date).toLocaleDateString()}
            </div>

            {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                <img
                    src={post._embedded["wp:featuredmedia"][0].source_url}
                    alt={post.title.rendered}
                    className="w-full h-auto object-cover rounded-lg mb-8"
                />
            )}

            <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
        </article>
    );
}
