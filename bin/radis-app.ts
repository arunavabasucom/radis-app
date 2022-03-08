#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { RadisAppStack } from "../lib/radis-app-stack";

const app = new cdk.App();

new RadisAppStack(app, "RadisAppStackProd", {
  websiteBucketName: "www.radis.app",
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: "us-east-2",
  },
});
new RadisAppStack(app, "RadisAppStackPreview", {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: "us-east-2",
  },
});
