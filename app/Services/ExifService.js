const Sharp = require('sharp');
const exif = require('exif-parser');

class ExifService {
  static async getImageExif(file) {
    return await new Promise(((resolve, reject) => {
      let chunks = [];
      let fileBuffer;
      file.stream.on('data', (chunk) => {
        chunks.push(chunk); // push data chunk to array
      });
      file.stream.once('end', () => {
        fileBuffer = Buffer.concat(chunks);
        resolve(fileBuffer);
      });
      file.stream.once('error', () => {
        reject();
      });
    })).then((fileBuffer) => {
      return exif.create(fileBuffer).parse().tags
    }).catch((error) => {
      return null;
    })
  }
}

module.exports = ExifService
