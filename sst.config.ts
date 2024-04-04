/// <reference path="./.sst/platform/config.d.ts" />

import {FunctionArgs} from "@pulumi/aws/lambda";

export default $config({
  app(input) {
    return {
      name: "shpfy-create-app", removal: input?.stage === "production" ? "retain" : "remove", home: "aws", providers: {
        aws: {
          region: "us-east-2"
        }
      }
    };
  }, async run() {

    const shopifyApiKey = new sst.Secret("ShopifyApiKey");
    const shopifyApiSecret = new sst.Secret("ShopifyApiSecret");
    const shopifyAppUrl = new sst.Secret("ShopifyAppUrl");
    const scopes = new sst.Secret("Scopes", "write_products");
    const nodeEnv = new sst.Secret("NodeEnv", "production");
    const databaseUrl = new sst.Secret("DatabaseUrl");

    new sst.aws.Remix("MyWeb", {
      transform: {
        server: (args: FunctionArgs) => {
          return {
            ...args,
            copyFiles: [{
              from: "node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node",
              to: "lib/libquery_engine-rhel-openssl-3.0.x.so.node"
            }],
          }
        }
      },
      environment: {
        SHOPIFY_API_KEY: shopifyApiKey.value,
        SHOPIFY_API_SECRET: shopifyApiSecret.value,
        SHOPIFY_APP_URL: shopifyAppUrl.value,
        SCOPES: scopes.value,
        NODE_ENV: nodeEnv.value,
        DATABASE_URL: databaseUrl.value,
        DEBUG: "prisma*",
      }
    });
  },
});
