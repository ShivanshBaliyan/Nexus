import os
import uuid

import boto3


s3 = boto3.client(
    "s3",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

BUCKET = os.getenv("AWS_S3_BUCKET")
REGION = os.getenv("AWS_REGION")


def generate_upload_url(folder: str, extension: str):
    key = f"{folder}/{uuid.uuid4()}.{extension}"

    upload_url = s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": BUCKET,
            "Key": key,
            "ContentType": f"image/{extension}",
        },
        ExpiresIn=300,
    )

    public_url = (
        f"https://{BUCKET}.s3.{REGION}.amazonaws.com/{key}"
    )

    return {
        "upload_url": upload_url,
        "public_url": public_url,
        "key": key,
    }


def generate_avatar_upload_url(extension: str):
    return generate_upload_url("avatars", extension)


def generate_post_upload_url(extension: str):
    return generate_upload_url("posts", extension)