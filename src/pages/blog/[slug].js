import axios from 'axios';

export default function BlogPost({ blog }) {
  if (!blog) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{blog.title}</h1>
      {blog.image && (
        <img
          src={blog.image.url}
          alt={blog.title}
          style={{ width: '500px', height: 'auto' }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}

export async function getStaticPaths() {
  const res = await axios.get('http://localhost:1337/api/blogs');
  const paths = res.data.data.map(blog => ({
    params: { slug: blog.attributes.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const res = await axios.get(
    `http://localhost:1337/api/blogs?filters[slug][$eq]=${params.slug}&populate=image`
  );
  const blogData = res.data.data[0];

  if (!blogData) return { notFound: true };

  const blog = {
    title: blogData.attributes.title,
    content: blogData.attributes.content,
    image: blogData.attributes.image?.data?.attributes || null,
  };

  return { props: { blog }, revalidate: 10 };
}
