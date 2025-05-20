import { v4 as uuidV4 } from "uuid";
import type { FileType } from "../utils/validators";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const uploadFileToS3 = async ({
  fileName,
  contentType,
  file,
}: {
  file: Buffer;
  fileName: string;
  contentType: string;
}) => {
  try {
    const key = `product-uploads/${uuidV4()}-${fileName}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: key,
      ContentType: contentType,
      Body: file,
    });

    const fileStatus = await s3Client.send(putObjectCommand);

    if (fileStatus["$metadata"].httpStatusCode !== 200) {
      console.log("Error sending file to AWS!");

      return null;
    }

    return `${process.env.AWS_CLOUD_FRONT_STREAM_URL}/${key}#1`;
  } catch (err) {
    console.log("Error sending file to AWS!");

    return null;
  }
};

export const uploadFiles = async (parsedFiles: FileType[]) => {
  const imageUrls = await Promise.all(
    parsedFiles.map(async (image: FileType) => {
      if (Buffer.isBuffer(image.buffer)) {
        const url = await uploadFileToS3({
          file: image.buffer,
          fileName: image.fileName,
          contentType: image.contentType,
        });

        if (!url) return null;

        return url;
      } else {
        return null;
      }
    })
  );

  // Filter out any failed uploads
  const validImageUrls = imageUrls.filter((url) => url !== null);

  return validImageUrls;
};
