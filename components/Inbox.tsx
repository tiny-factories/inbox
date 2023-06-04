import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type InboxProps = {
  id: String;
  description?: String;
  createdAt: Date;
  updatedAt?: Date;
  public: Boolean;
  owners: any;
  Post: any;
};
