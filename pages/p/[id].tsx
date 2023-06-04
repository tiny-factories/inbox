import React, { Fragment, useState } from "react";
import type { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";

import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";

import prisma from "../../lib/prisma";

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const serializedCreatedAt = createdAt.toISOString();
  const serializedUpdatedAt = updatedAt.toISOString();

  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      Comment: {
        select: {
          text: true,
        },
      },
    },
  });

  return {
    props: {
      content: String,
      createdAt: serializedCreatedAt,
      updatedAt: serializedUpdatedAt,
    },
    revalidate: 10,
  };
};

const Post: React.FC<PostProps> = (props, { currentDate }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <div>
          <ReactMarkdown children={props.content} />

          <p>By {props?.author?.name || "Unknown author"}</p>
        </div>
        List Commenents
        <ul role="list" className="space-y-6">
          {props.Comment.map((d, i) => (
            <li key={i} className="relative flex gap-x-4">
              <div className="absolute left-0 top-0 flex w-6 justify-center">
                <div className="w-px bg-gray-200" />
              </div>
              <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white"></div>
              <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                <span className="font-medium text-gray-900">
                  <ReactMarkdown children={d.text} />
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
        {/* New comment form */}
        <div className="mt-6 flex gap-x-3">
          <div className="h-6 w-6 flex-none rounded-full bg-gray-50"></div>
          <form action="#" className="relative flex-auto">
            <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label htmlFor="comment" className="sr-only">
                I DO NTO WORK YET
              </label>
              <textarea
                rows={2}
                name="comment"
                id="comment"
                className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Add your comment..."
                defaultValue={""}
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
              <button
                type="submit"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Comment
              </button>
            </div>
          </form>
        </div>{" "}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
    </Layout>
  );
};

export default Post;
