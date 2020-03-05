/**
* @modified by Blueberry
* @author Charlie Gerard / http://charliegerard.github.io reference
*/

const services = {
  fnirsService: {
    name: 'fnirs service',
    uuid: '0f0e0d0c-0b0a-0908-0706-050403020100' 
  }
}

const characteristics = {
  commandCharacteristic: {
    name: 'write characteristic',
    uuid: '1f1e1d1c-1b1a-1918-1716-151413121110'
  },
  fnirsCharacteristic: {
    name: 'read fnirs data characteristic',
    uuid: '3f3e3d3c-3b3a-3938-3736-353433323130'
  }
}

var _this;
var state = {};

class BlueberryWebBluetooth{
  constructor(name){
    _this = this;
    this.name = name;
    this.services = services;
    this.characteristics = characteristics;

    this.standardServer;
  }

  connect(){
    return navigator.bluetooth.requestDevice({
      filters: [
        {name: this.name},
        {
          services: [services.fnirsService.uuid]
        }
      ]
    })
    .then(device => {
      console.log('Device discovered', device.name);
      return device.gatt.connect();
    })
    .then(server => {
      console.log('server device: '+ Object.keys(server.device));

      this.getServices([services.fnirsService], [characteristics.commandCharacteristic, characteristics.fnirsCharacteristic], server);
    })
    .catch(error => {console.log('error',error)})
  }

  getServices(requestedServices, requestedCharacteristics, server){
    this.standardServer = server;

    requestedServices.filter((service) => {

      //start up control command service
      if(service.uuid == services.fnirsService.uuid){
        _this.getControlService(requestedServices, requestedCharacteristics, this.standardServer);
      }
    })
  }

  getControlService(requestedServices, requestedCharacteristics, server){
      let controlService = requestedServices.filter((service) => { return service.uuid == services.fnirsService.uuid});
      let commandChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.commandCharacteristic.uuid});

      // Before having access to fNIRS data, we need to indicate to the Blueberry that we want to receive this data.
      return server.getPrimaryService(controlService[0].uuid)
      .then(service => {
        console.log('getting service: ', controlService[0].name);
        return service.getCharacteristic(commandChar[0].uuid);
      })
      // .then(characteristic => {
      //   console.log('getting characteristic: ', commandChar[0].name);
      //   // return new Buffer([0x11]); //start hex value to write to device
      //   // The values passed in the buffer indicate that we want to receive all data without restriction;
      //   let commandValue = new Uint8Array([0x11]);
      //   characteristic.writeValue(commandValue);
      // })
      .then(_ => {
        let fnirsService = requestedServices.filter((service) => {return service.uuid == services.fnirsService.uuid});

        if(fnirsService.length > 0){
          console.log('getting service: ', fnirsService[0].name);
          _this.getfNIRSData(fnirsService[0], characteristics.fnirsCharacteristic, server);
        }
      })
      .catch(error =>{
        console.log('error: ', error);
      })
  }

  handlefNIRSDataChanged(event){
    //byteLength of fNIRSdata
    let fNIRSData = event.target.value
    
    //data from [2,3,4,5]
    //let valueHBO = event.target.value.getInt32(2);

    //or
    var u8HBO = new Uint8Array([fNIRSData[6],fNIRSData[7],fNIRSData[8],fNIRSData[9]]); // original array
    var u32bytesHBO = u8HBO.buffer.slice(-4); // last four bytes as a new `ArrayBuffer`

    var countHBO = 0;
    // assuming the array has at least four elements
    for(var i = u8HBO.length - 4; i <= u8HBO.length - 1 ; i++)
    {
        countHBO = countHBO << 8 + u8HBO[i];
    }

    // var valueHBO = new Uint32Array(u32bytesHBO)[0] * 10000 + 20000;
    var valueHBO = countHBO;
    let valueHBR = 0; //event.target.value.getInt32(6);

    var data = {
      fNIRS: {
        HBO: valueHBO,
        HBR: valueHBR
      }
    }

    state = {
      fNIRS: data.fNIRS
    }

    _this.onStateChangeCallback(state);
  }

  little2big(i) {
    return (i&0xff)<<24 | (i&0xff00)<<8 | (i&0xff0000)>>8 | (i>>24)&0xff;
  }

  onStateChangeCallback() {}

  getfNIRSData(service, characteristic, server){
    return server.getPrimaryService(service.uuid)
    .then(newService => {
      console.log('getting characteristic: ', characteristic.name);
      return newService.getCharacteristic(characteristic.uuid)
    })
    .then(char => {
      char.startNotifications().then(res => {
        char.addEventListener('characteristicvaluechanged', _this.handlefNIRSDataChanged);
      })
    })
  }

  onStateChange(callback){
    _this.onStateChangeCallback = callback;
  }
}
