import * as cdk from "@aws-cdk/core";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as s3 from "@aws-cdk/aws-s3";
import { inlineSource } from "./inline-source";
import { CfnOutput, RemovalPolicy } from "@aws-cdk/core";

interface RadisAppStackProps extends cdk.StackProps {
  /** Name of the bucket which hosts the site. */
  websiteBucketName?: string;
}

export class RadisAppStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: RadisAppStackProps = {}
  ) {
    super(scope, id, props);
    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: props.websiteBucketName,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const configSource = inlineSource(
      "static/js/config.js",
      `export const apiEndpoint = "https://api.radis.app/";`
    );

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./website/build"), configSource],
      destinationBucket: websiteBucket,
      retainOnDelete: false,
    });

    new CfnOutput(this, "WebsiteBucketOutput", {
      value: websiteBucket.bucketWebsiteUrl,
    });
  }
}
