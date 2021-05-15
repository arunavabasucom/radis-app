import * as cdk from "@aws-cdk/core";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as s3 from "@aws-cdk/aws-s3";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import { inlineSource } from "./inline-source";
import { Duration } from "@aws-cdk/core";

export class RadisAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const calculateSpectrumFunction = new lambda.DockerImageFunction(
      this,
      "CalculateSpectrumFunction",
      {
        functionName: "CalculateSpectrumFunction",
        code: lambda.DockerImageCode.fromImageAsset("./lib/radis-lambda"),
        tracing: lambda.Tracing.PASS_THROUGH,
        memorySize: 1024 * 5,
        timeout: Duration.seconds(30),
        environment: {
          HOME: "/tmp",
        },
        reservedConcurrentExecutions: 3,
      }
    );

    const api = new apigw.LambdaRestApi(this, "RadisApi", {
      handler: calculateSpectrumFunction,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
      },
      deployOptions: {
        tracingEnabled: true,
      },
    });

    const calculateSpectrum = api.root.addResource("calculate-spectrum");
    calculateSpectrum.addMethod("POST");

    const websiteBucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: "radis.app",
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    const configSource = inlineSource(
      "static/js/config.js",
      `export const apiEndpoint = "${api.url}";`
    );

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./website/build"), configSource],
      destinationBucket: websiteBucket,
      retainOnDelete: false,
    });
  }
}
