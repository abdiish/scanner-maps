import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Registro } from '../pages/models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  private _storage: Storage | null = null;

  constructor(private storage: Storage,
              private navCtrl: NavController,
              private iab: InAppBrowser) {

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

      }
  }
}
