import React, { useState } from "react";
import type { GetStaticProps } from "next";
import Router from "next/router";

import prisma from "../lib/prisma";

import { InboxProps } from "../components/Inbox";
import Layout from "../components/Layout";
import Dropdown from "../components/SelectUserDropdown";

type Inbox = {
  feed: InboxProps[];
};

const CreatePost: React.FC = (props) => {
  const [inbox, setInbox] = useState([]);
  const [content, setContent] = useState("");
  console.log(props);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { inbox, content };
      await fetch(`/api/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <div>Post to Inbox</div>
          <select
            name="inbox"
            id="inbox"
            onChange={(e) => setInbox(e.target.value)}
          >
            {" "}
            <option key="00" value="">
              -- Inbox --
            </option>
            {props.inbox.map((d, i) => (
              <option key={i} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <input disabled={!content || !inbox} type="submit" value="Share" />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        select {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const inbox = await prisma.inbox.findMany({
    where: {},
  });
  return {
    props: {
      inbox, // Wrap the inbox array inside the props object
    },
    revalidate: 10,
  };
};

export default CreatePost;
