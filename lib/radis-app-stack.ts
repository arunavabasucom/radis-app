import * as cdk from "@aws-cdk/core";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as s3 from "@aws-cdk/aws-s3";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as efs from "@aws-cdk/aws-efs";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";
import { inlineSource } from "./inline-source";
import { Duration, RemovalPolicy } from "@aws-cdk/core";

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

    // Get the default vpc
    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true,
    });

    const fs = new efs.FileSystem(this, "FileSystem", {
      vpc,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const accessPoint = fs.addAccessPoint("AccessPoint", {
      createAcl: {
        ownerGid: "1001",
        ownerUid: "1001",
        permissions: "750",
      },
      path: "/export/lambda",
      posixUser: {
        gid: "1001",
        uid: "1001",
      },
    });

    const calculateSpectrumFunction = new lambda.DockerImageFunction(
      this,
      "CalculateSpectrumFunction",
      {
        functionName: "CalculateSpectrumFunction",
        code: lambda.DockerImageCode.fromImageAsset("./lib/radis-lambda"),
        tracing: lambda.Tracing.PASS_THROUGH,
        memorySize: 10_240,
        timeout: Duration.seconds(30),
        environment: {
          HOME: "/mnt/msg",
        },
        reservedConcurrentExecutions: 3,
        vpc,
        filesystem: lambda.FileSystem.fromEfsAccessPoint(
          accessPoint,
          "/mnt/msg"
        ),
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
      bucketName: props.websiteBucketName,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
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
