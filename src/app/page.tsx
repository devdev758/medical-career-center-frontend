import { getPosts } from "@/lib/wordpress";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Medical Career Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              <CardDescription className="line-clamp-3" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </CardHeader>
            <CardContent className="flex-grow">
              {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                <img
                  src={post._embedded["wp:featuredmedia"][0].source_url}
                  alt={post.title.rendered}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
