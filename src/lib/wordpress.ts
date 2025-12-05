const WORDPRESS_API_URL = "https://medicalcareercenter.org/wp-json/wp/v2";

export type Post = {
    id: number;
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
    excerpt: { rendered: string };
    date: string;
    _embedded?: {
        "wp:featuredmedia"?: Array<{ source_url: string }>;
        author?: Array<{ name: string }>;
    };
};

export async function getPosts(): Promise<Post[]> {
    const res = await fetch(`${WORDPRESS_API_URL}/posts?_embed`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch posts");
    }
    return res.json();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const res = await fetch(`${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch post");
    }
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : null;
}
