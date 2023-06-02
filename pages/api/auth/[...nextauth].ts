import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from 'next-auth/providers/github'
import DiscordProvider from "next-auth/providers/discord";

import prisma from '../../../lib/prisma'


const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};
