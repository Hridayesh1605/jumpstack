import axios from 'axios';
import Link from 'next/link';

export default function Home({ blogs }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Blog Posts</h1>
      {blogs.map(blog => (
        <div key={blog.id} style={{ marginBottom: '2rem' }}>
          <h2>
            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h2>
          {blog.image && (
            <img
              src={blog.image.url}
              alt={blog.title}
              style={{ width: '300px', height: 'auto' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const res = await axios.get('http://localhost:1337/api/blogs?populate=image');
  const blogs = res.data.data.map(item => ({
    id: item.id,
    title: item.attributes.title,
    slug: item.attributes.slug,
    content: item.attributes.content,
    image: item.attributes.image?.data?.attributes || null,
  }));

  return { props: { blogs }, revalidate: 10 };
}
