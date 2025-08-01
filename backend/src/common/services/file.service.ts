import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadFileServiceS3 {
	private s3_client: S3Client;
	constructor(private readonly config_service: ConfigService) {
		const region = config_service.get<string>('AWS_S3_REGION');
		const accessKeyId = config_service.get<string>('AWS_S3_ACCESS_KEY_ID');
		const secretAccessKey = config_service.get<string>('AWS_S3_SECRET_ACCESS_KEY');

		if (!region || !accessKeyId || !secretAccessKey) {
			throw new Error('Missing AWS S3 configuration');
		}

		this.s3_client = new S3Client({
			region,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});
	}
	async uploadFileToPublicBucket(
		path: string,
		{ file, file_name }: { file: Express.Multer.File; file_name: string },
	) {
		const bucket_name = this.config_service.get('AWS_S3_PUBLIC_BUCKET');
		const key = `${path}/${Date.now().toString()}-${file_name}`;
		await this.s3_client.send(
			new PutObjectCommand({
				Bucket: bucket_name,
				Key: key,
				Body: file.buffer,
                ContentType: file.mimetype,
				ACL: 'public-read',
				ContentLength: file.size, // calculate length of buffer
			}),
		);

		return `https://${bucket_name}.s3.amazonaws.com/${key}`;
	}
}
