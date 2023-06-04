import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

// FIX: Make one types folder
type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

export type InboxProps = {
  id: String;
  name: String;
  description?: String;
  createdAt: Date;
  updatedAt?: Date;
  public: Boolean;
  owners: any;
  Post: PostProps[]; // Use the ChildAttributes type for Post
};
