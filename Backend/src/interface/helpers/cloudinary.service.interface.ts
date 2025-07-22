export interface ICloudinaryService {
  generateSignature(): {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
  };
}
