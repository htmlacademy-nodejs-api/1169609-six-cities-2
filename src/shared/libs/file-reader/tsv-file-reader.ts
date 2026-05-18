import { FileReader } from './file-reader.interface.js';
import EventEmitter from 'node:events';


export class TSVFileReader extends EventEmitter implements FileReader {

  constructor(
    private readonly filename: string
  ) {
    super();
  }

  public read(): void {
    // Код для работы с потоками
  }

}
