const aws = require("aws-sdk");
const s3 = new aws.S3({ apiVersion: "2006-03-01" });
const fs = require("fs");
var archive = require("archiver")("zip");

exports.handler = async function (event, ctx) {
  await new Promise((resolve) => fs.unlink("/tmp/index.zip", resolve));

  const output = fs.createWriteStream("/tmp/index.zip");

  const closed = new Promise((resolve, reject) => {
    output.on("close", resolve);
    output.on("error", reject);
  });

  archive.pipe(output);
  archive.append(event.ResourceProperties.content, {
    name: event.ResourceProperties.path,
  });

  archive.finalize();
  await closed;

  await s3
    .upload({
      Bucket: event.ResourceProperties.bucket,
      Key: "index.zip",
      Body: fs.createReadStream("/tmp/index.zip"),
    })
    .promise();
};
