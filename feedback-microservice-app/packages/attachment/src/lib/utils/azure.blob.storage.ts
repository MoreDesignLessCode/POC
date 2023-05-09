import { DefaultAzureCredential } from '@azure/identity'
import { BlobServiceClient } from '@azure/storage-blob'

export const connectToBlobService = async () => {
  const storageAccount = process.env.AZURE_STORAGE_ACCOUNT_NAME
  const defaultAzureCredential = new DefaultAzureCredential()
  const blobServiceClient = new BlobServiceClient(
    `https://${storageAccount}.blob.core.windows.net`,
    defaultAzureCredential
  )

  return { blobServiceClient, defaultAzureCredential }
}