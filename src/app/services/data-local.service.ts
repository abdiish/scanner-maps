import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Registro } from '../pages/models/registro.model';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(private storage: Storage) {

    //caragar registros
    this.storage.get('registros')
      .then(registros => {
         this.guardados = registros || [];
    });

   }

   async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
  }


  guardarRegistro(format: string, text: string){

    const nuevoRegistro = new Registro(format, text);

    this.guardados.unshift(nuevoRegistro);

    console.log(this.guardados);

    this.storage.set('registros', this.guardados);
  }
}
