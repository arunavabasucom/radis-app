import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import {
  DeploymentSourceContext,
  ISource,
  SourceConfig,
} from "@aws-cdk/aws-s3-deployment";
import {
  AssetOptions,
  Construct,
  CustomResource,
  Duration,
  RemovalPolicy,
} from "@aws-cdk/core";
import { Bucket } from "@aws-cdk/aws-s3";
import { Provider } from "@aws-cdk/custom-resources";
import { RetentionDays } from "@aws-cdk/aws-logs";

// https://stackoverflow.com/a/66084764
export function inlineSource(
  path: string,
  content: string,
  options?: AssetOptions
): ISource {
  return {
    bind: (
      scope: Construct,
      context?: DeploymentSourceContext
    ): SourceConfig => {
      if (!context) {
        throw new Error("To use a inlineSource, context must be provided");
      }

      // Find available ID
      let id = 1;
      while (scope.node.tryFindChild(`InlineSource${id}`)) {
        id++;
      }

      const bucket = new Bucket(scope, `InlineSource${id}StagingBucket`, {
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      });

      const fn = new Function(scope, `InlineSource${id}Lambda`, {
        runtime: Runtime.NODEJS_14_X,
        handler: "index.handler",
        code: Code.fromAsset("./lib/inline-lambda"),
        timeout: Duration.seconds(30),
      });

      bucket.grantReadWrite(fn);

      const myProvider = new Provider(scope, `InlineSource${id}Provider`, {
        onEventHandler: fn,
        logRetention: RetentionDays.ONE_DAY,
      });

      const resource = new CustomResource(
        scope,
        `InlineSource${id}CustomResource`,
        {
          serviceToken: myProvider.serviceToken,
          properties: { bucket: bucket.bucketName, path, content },
        }
      );

      // Sets the s3 deployment to depend on the deployed file
      context.handlerRole.node.addDependency(resource);

      bucket.grantRead(context.handlerRole);

      return {
        bucket: bucket,
        zipObjectKey: "index.zip",
      };
    },
  };
}
