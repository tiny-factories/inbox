import React from "react";
import type { GetStaticProps } from "next";
import Link from "next/link";

import Layout from "../components/Layout";
// import Post, { PostProps } from "../components/Post";
import { InboxProps } from "../components/Inbox";
import prisma from "../lib/prisma";

type Props = {
  feed: InboxProps[];
};

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.inbox.findMany({
    include: {
      Post: { select: { content: true } },
    },
  });
  const serializedFeedData = feed.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));
  return {
    props: {
      feed: serializedFeedData, // Use the serialized feed data in props
    },
    revalidate: 10,
  };
};

const Home: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Inboxes </h1>
        {props.feed.map((d, i) => (
          <div key={i} className="m-3 p-3 border-4">
            <div className="">
              <Link href={`/inbox/${d.id}`}>
                <div className="font-bold hover:underline">{d.name} →</div>
              </Link>
              Maybe Add Children here
              {/* <div className="">
                {props.feed.map((d, i) => (
                  <li key={i} className="relative flex gap-x-4"></li>
                ))}
              </div> */}
            </div>
          </div>
        ))}

        {/* <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main> */}
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
