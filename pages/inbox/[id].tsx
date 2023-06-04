import React, { Fragment, useState } from "react";
import type { GetStaticProps, GetStaticPaths } from "next";
import ReactMarkdown from "react-markdown";

import Layout from "../../components/Layout";
import Router from "next/router";
import { InboxProps } from "../../components/Inbox";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";

type Props = {
  serializedFeedData: InboxProps[];
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const feed = await prisma.inbox.findMany({
    // FIX: should replace with .findUnique
    where: {
      id: String(params?.id),
    },
    include: {
      Post: {
        select: {
          content: true,
          Comment: {
            select: {
              text: true,
            },
          },
        },
      },
    },
  });

  const serializedFeedData = feed.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));
  console.log(serializedFeedData);

  return {
    props: { serializedFeedData },
    revalidate: 10,
  };
};

const Inbox: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  // const userHasValidSession = Boolean(session);
  // const postBelongsToUser = session?.user?.email === props.author?.email;
  return (
    <Layout>
      <div className="py-9">
        <div className="font-bold ">
          Inbox {props?.serializedFeedData[0].name || "No Name"}
        </div>
        <div className="">
          {props?.serializedFeedData[0].description || "No Description"}
        </div>
      </div>
      <ul role="list" className="space-y-6">
        {props.serializedFeedData[0].Post.map((d, i) => (
          <li key={i} className="relative flex gap-x-4">
            <div className="absolute left-0 top-0 flex w-6 justify-center">
              <div className="w-px bg-gray-200" />
            </div>
            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white"></div>
            <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
              <span className="font-medium text-gray-900">
                <ReactMarkdown children={d.content} />
              </span>
            </p>
            <time
              dateTime=""
              className="flex-none py-0.5 text-xs leading-5 text-gray-500"
            >
              Date{" "}
            </time>
          </li>

          // <div key={i} className="">
          //   <ReactMarkdown children={d.text} />
          // </div>
        ))}
      </ul>
    </Layout>
  );
};

export default Inbox;
