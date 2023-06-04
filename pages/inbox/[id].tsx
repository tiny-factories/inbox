import React, { Fragment, useState } from "react";
import type { GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";

import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await prisma.inbox.findUnique({
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
  return {
    props: post,
    revalidate: 10,
  };
};

const Inbox: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  console.log(props);
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;

  return (
    <Layout>
      <div className="py-9">
        <div className="font-bold ">Inbox {props.name}</div>
        <div className="">{props?.description || "No Description"}</div>
      </div>
      <ul role="list" className="space-y-6">
        {props.Post.map((d, i) => (
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
