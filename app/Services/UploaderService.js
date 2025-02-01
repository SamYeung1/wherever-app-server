const Drive = use('Drive')
const Env = use('Env')
const Sharp = require('sharp');

class UploaderService {
  static async uploadImage(file, path, filename, resize = 2000) {
    const pipeline = Sharp()
    pipeline.jpeg({quality: 100})
    pipeline.resize(resize)
    const bitmap = await file.stream.pipe(pipeline).toBuffer()
    const result = await Drive.put(`${path}${filename}.jpg`, Buffer.from(bitmap), {
      ContentType: 'image/jpeg',
      ACL: 'public-read'
    })
    return `${path}${filename}.jpg`
  }

  static async deleteImage(path) {
    return await Drive.delete(path)
  }

  static async getUrl(path) {
    return await Drive.getSignedUrl(path,parseInt(Env.get('S3_SIGN_EXPIRY')));
  }
}

module.exports = UploaderService
