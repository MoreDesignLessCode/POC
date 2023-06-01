import { Uuid,Result, IContext,IStorageProvider} from '@coe/apip-api-types'
import { Attachments} from '../../models';
import * as Pg from 'pg';
import { connectToBlobService } from '../../utils/azure.blob.storage';


export class AttachmentPgStorageProvider implements IStorageProvider<Attachments> {
  client: Pg.Client;
  columns =
    'id, given_name, middle_name, family_name, created_at, modified_at, deleted_at, created_by, modified_by, deleted_by';

  constructor() {
    const connString = `postgresql://${process.env.FEEDBACK_DAS_DB_USER}:${process.env.FEEDBACK_DAS_DB_PASSWORD}@${process.env.FEEDBACK_DAS_DB_HOST}:${process.env.FEEDBACK_DAS_DB_PORT}/${process.env.FEEDBACK_DAS_DB_NAME}`;

    this.client = new Pg.Client({
      connectionString: connString,
    });
    this.client.connect();
  }
  all(context: IContext): Promise<Result<Attachments>> {

    throw new Error('Method not implemented.');
  }
  create = async (entity: any, context: IContext): Promise<any> => {
    // throw new Error('Method not implemented.');
    // const chunks = [];
    // for await (const chunk of entity.file) {
    //   chunks.push(chunk);
    // }
    // const fileContent = Buffer.concat(chunks);
    //  const base64content=Buffer.from(fileContent).toString('base64')
    const mimeType = entity.mimetype;
    // const dataURI = `data:${mimeType};base64,${base64content}`      

    let attachmentId = Uuid();
    let path: string = attachmentId + ':' + entity.filename
    const file = entity.file;
    let res = await this.uploadImage(file, path, "Test User");
    const insertAttachment = await this.client.query(
      'INSERT INTO feedbackmktpl.attachments (id,created_at,created_by,name,path,mimetype) VALUES ($1,$2,$3,$4,$5,$6);',
      [
        attachmentId,
        new Date().toISOString(),
        Uuid(),
        entity.filename,
        path,
        entity.mimetype
      ]);
    const response = await this.client.query(`             
       select a.id,a.name,a.mimetype,a.path FROM feedbackmktpl.attachments a where a.id=$1 `, [attachmentId])

    return {
      type: 'ok',
      data: { type: 'resource', value: response.rows },
    };
  }


  delete(id: Uuid, context: IContext): Promise<Result<Attachments>> {
    throw new Error('Method not implemented.');
  }
  findById = async (id: Uuid, context: IContext): Promise<any> => {
    try {
      const response = await this.client.query(`             
      select a.id,a.path,a.name,a.mimetype FROM feedbackmktpl.attachments a where a.id=$1 `, [id])

      return {
        type: 'ok',
        data: { type: 'resource', value: response.rows[0] },
      }
    }
    catch (error) {
      return {
        type: 'error',
        data: error,
      }

    }
  }
  save(id: Uuid, entity: Attachments, context: IContext): Promise<Result<Attachments>> {
    throw new Error('Method not implemented.');
  }


  uploadImage = async (file: any, uploadPath: string, user: string) => {
    console.log(`Starting to upload image artifact to the storage | nameId:${user}`)
    const { blobServiceClient } = await connectToBlobService()
    const artifactPath = 'das-attachments/' + uploadPath

    try {
      if (process.env.AZURE_CONTAINER_NAME) {
        const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME)
        const stream = file
        const blockBlobClient = containerClient.getBlockBlobClient(artifactPath)
        const response = await blockBlobClient.uploadStream(stream)
        // const uploadBlobResponse = await blockBlobClient.upload(file, file.length)
        console.log(`Image artifact blob uploaded to storage successfully | 
              container:${process.env.AZURE_CONTAINER_NAME}, blobName:${artifactPath}, requestId:${response.requestId}, nameId:${user}`)
      }
    } catch (error) {
      console.log(`Error while uploading image artifact blob: ${artifactPath} to container: ${process.env.AZURE_CONTAINER_NAME} | nameId:${user} - `, error)
      throw error
    }
    return uploadPath

  }
  streamToBuffer = async (readableStream: any) => {
    return new Promise((resolve, reject) => {
      const chunks: any[] = []
      readableStream.on('data', (data: any) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data))
      })
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      readableStream.on('error', reject)
    })
  }

  getImage = async (blobName: string, user: string) => {
    console.log(`Starting to get image artifact from storage | blobName:${blobName}, nameId:${user}`)
    const { blobServiceClient } = await connectToBlobService()
    let downloadedImageBuffer: any
    let downloadedImage: any

    try {
      blobName = 'das-attachments/' + blobName
      if (process.env.AZURE_CONTAINER_NAME) {
        const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)
        const downloadBlockBlobResponse = await blockBlobClient.download();
        downloadedImageBuffer = await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
        downloadedImage = downloadedImageBuffer.toString()
        console.log(`Image artifact blob fetched from storage successfully | container:${process.env.AZURE_CONTAINER_NAME}, blobName:${blobName}, nameId:${user}`)
      }
    } catch (error) {
      console.log(`Error while fetching image artifact blob: ${blobName} | container:${process.env.AZURE_CONTAINER_NAME}, nameId:${user} - `, error)
      throw error
    }
    return downloadedImage
  }
}
