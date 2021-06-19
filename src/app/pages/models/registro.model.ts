
export class Registro {

    public format:  string;
    public text:    string;
    public type:    string;
    public icon:    string;
    public created: Date; 
    
    
    //Formato y texto vinen del Barcode Data
    constructor(format: string, text: string) {

        this.format  = format;
        this.text    = this.text;
        this.created = new Date(); //Determino fecha de creacion

        this.determinarTipo(); //Determina el tipo
    }

    private determinarTipo(){

        const inicioTexto = this.text.substr(0,4);
        console.log('TIPO', inicioTexto);

        switch(inicioTexto){

            case 'http':
                this.type = 'http';
                this.icon = 'pin';
            break;

            case 'geo:':
                this.type = 'geo';
                this.icon = 'map';
            break;

            default:
                this.type = 'No reconocido';
                this.icon = 'create'
            

        }
    }
}