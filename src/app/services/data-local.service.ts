import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Registro } from '../pages/models/registro.model';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  private _storage: Storage | null = null;

  constructor(private storage: Storage,
              private navCtrl: NavController,
              private iab: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer) {

    this.init();
    this.cargarStorage();
    //caragar registros
   /*  this.storage.get('registros')
      .then(registros => {
         this.guardados = registros || [];
    }); */

   }

   async init() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async cargarStorage(){

    this.guardados = await this.storage.get('registros') || [];
  
  }


  async guardarRegistro(format: string, text: string){

    await this.cargarStorage();

    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    console.log(this.guardados);
    this._storage.set('registros', this.guardados);
    this.abrirRegistro(nuevoRegistro);

  }

  abrirRegistro(registro: Registro){

      this.navCtrl.navigateForward('/tabs/tab2');

      switch(registro.type){

        case 'http':
          //aabrir navegador web
          this.iab.create(registro.text, '_system');
          break;
        
          case 'geo':
            //aabrir navegador web
            this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
            break;

      }
  }

  enviarCorreo(){

    const arrTemp= [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);
    this.guardados.forEach(registro =>{
      
      const linea = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',', '')}\n`;
      
      arrTemp.push(linea);
    });

    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico(text: string){

    //Verificar si existe archivo
    this.file.checkFile(this.file.dataDirectory,'registros.csv')
      .then(existe => {
        console.log('Existe archivo', existe);
        return this.escribirEnArchivo(text);
      })
      .catch(err =>{
        return this.file.createFile(this.file.dataDirectory,'registro.csv', false)
                .then(creado => this.escribirEnArchivo(text))
                .catch(err2 => console.log('No se pudo crear el archivo', err2));
      });

  }

async  escribirEnArchivo(text: string){

    await this.file.writeExistingFile(this.file.dataDirectory,'registros.csv', text);

    const archivo = `${this.file.dataDirectory}registros.csv`;

    const email = {
      to: 'ing.ti.upmh@gmail.com',
      /* cc: 'erika@mustermann.de',
      bcc: ['john@doe.com', 'jane@doe.com'], */
      attachments: [
        archivo
      ],
      subject: 'Backup Sacans',
      body: 'Backup Sacans Ionic ',
      isHtml: true
    };
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
