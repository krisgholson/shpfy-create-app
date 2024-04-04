import {PrismaClient} from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

// HACK set the PRISMA_QUERY_ENGINE_LIBRARY when in AWS_EXECUTION_ENV.
// Will not work local if set as environment variable in sst.config.ts
if (process.env.AWS_EXECUTION_ENV) {
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = "libquery_engine-rhel-openssl-3.0.x.so.node"
}

const prisma: PrismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

export default prisma;
