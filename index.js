window.onload = function(){
  let buttonConnectA = document.getElementById("connectA");
  let buttonConnectB = document.getElementById("connectB");
  let buttonTintLvl1 = document.getElementById("ctrlLCD1");
  let buttonTintLvl5 = document.getElementById("ctrlLCD5");
  let buttonStartClass = document.getElementById("startClassification");
  let buttonStopClass = document.getElementById("stopClassification");
  let message = document.getElementById("message");
  let chartA = document.getElementById("chartA");
  let chartB = document.getElementById("chartB");

  var timeA = 0;
  var timeB = 0;
  var lastDataA = 0.0;
  var lastDataB = 0.0;
  var dataA={labels: [],dataset: []};
  var dataB={labels: [],dataset: []};
                           //Empty Dataset for start
  var blueberryControllerA = new BlueberryWebBluetoothA("blueberry-70");
  var blueberryControllerB = new BlueberryWebBluetoothB("blueberry-6c");

  if ( 'bluetooth' in navigator === false ) {
      button.style.display = 'none';
      message.innerHTML = 'This browser doesn\'t support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API" target="_blank">Web Bluetooth API</a> :(';
  }

  let fnirsDataA;
  let fnirsDataB;

	var initialised = false;
	var timeout = null;
  var dataCountA = 0;
  var dataCountB = 0;

  buttonConnectA.onclick = function(e){
    //need to put exact device name here
    blueberryControllerA.connect();

    blueberryControllerA.onStateChange(function(state){

      fNIRSDataA = stateA.fNIRS;
      
      displayDataA();

    });
  }

  buttonConnectB.onclick = function(e){
    //need to put exact device name here
    blueberryControllerB.connect();

    blueberryControllerB.onStateChange(function(state){

      fNIRSDataB = stateB.fNIRS;
      
      displayDataB();

    });
  }

  buttonTintLvl1.onclick = function(e){

    blueberryController.ctrlCommand(0x20);
    console.log('tint change lvl 1');

  }

  buttonTintLvl5.onclick = function(e){

    blueberryController.ctrlCommand(0x99);
    console.log('tint change lvl 5');

  }

  buttonStartClass.onclick = function(e){

    blueberryController.ctrlCommand(0xC1);

  }

  buttonStopClass.onclick = function(e){

    blueberryController.ctrlCommand(0xC0);

  }

  function displayDataA(){
    
    if(fNIRSDataA){

      // HBOlong: valueHBOlong,
      // HBOshort: valueHBOshort,
      // HBTlong: valueHBTlong,
      // HBTshort: valueHBTshort
      dataCountA += 1;

      //update 2 times per second
      if (dataCountA % 50 == 0){
          var hemo1Div = document.getElementsByClassName('hemo1-data')[0];
          hemo1Div.innerHTML = fNIRSData.HBOlong;

          var MentalLoadDiv = document.getElementsByClassName('mental-load-data')[0];
          MentalLoadDiv.innerHTML = fNIRSData.MentalLoad;
      }

      //update 5 times a second from 100Hz Sample Rate
      if (dataCountA % 2 == 0){

        //console.log('data plot');
        //if (fNIRSData.HBOlong > 10){

          //update chart
          var date = new Date();
          let hour  = date.getHours();  if(hour<10){  hour= '0'+hour; }
          let minutes = date.getMinutes();  if(minutes<10){ minutes=  '0'+minutes;  }
          let seconds = date.getSeconds();  if(seconds<10){ seconds=  '0'+seconds;  }
          timeA  = hour+':'+minutes+':'+seconds;                             //Cheate H:i:s

          if (Math.abs(lastDataA - fNIRSDataA.HBOlong) <= 2000){

            if (dataA.dataset.length != 100) {
              dataA.dataset.push(fNIRSDataA.HBOlong);           //Then remove the first and add a new
              //data.dataset[1].push(fNIRSData.HBTlong);
              dataA.labels.push(timeA);
            } else {
              dataA.dataset.shift();
              //data.dataset[1].shift();
              dataA.labels.shift(); 
              dataA.dataset.push(fNIRSDataA.HBOlong);           //Then remove the first and add a new
              //data.dataset[1].push(fNIRSData.HBTlong);
              dataA.labels.push(timeA);
            }
          }

          lastDataA = fNIRSDataA.HBOlong

          drawA(dataA);
        //}
      }
      
    }

  }

  function displayDataB(){
    
    if(fNIRSDataB){

      // HBOlong: valueHBOlong,
      // HBOshort: valueHBOshort,
      // HBTlong: valueHBTlong,
      // HBTshort: valueHBTshort
      dataCountB += 1;

      //update 5 times a second from 100Hz Sample Rate
      if (dataCountB % 2 == 0){

        //console.log('data plot');
        //if (fNIRSData.HBOlong > 10){

          //update chart
          var date = new Date();
          let hour  = date.getHours();  if(hour<10){  hour= '0'+hour; }
          let minutes = date.getMinutes();  if(minutes<10){ minutes=  '0'+minutes;  }
          let seconds = date.getSeconds();  if(seconds<10){ seconds=  '0'+seconds;  }
          timeB  = hour+':'+minutes+':'+seconds;                             //Cheate H:i:s

          if (Math.abs(lastDataB - fNIRSDataB.HBOlong) <= 2000){

            if (dataB.dataset.length != 100) {
              dataB.dataset.push(fNIRSDataB.HBOlong);           //Then remove the first and add a new
              //data.dataset[1].push(fNIRSData.HBTlong);
              dataB.labels.push(timeB);
            } else {
              dataB.dataset.shift();
              //data.dataset[1].shift();
              dataB.labels.shift(); 
              dataB.dataset.push(fNIRSDataB.HBOlong);           //Then remove the first and add a new
              //data.dataset[1].push(fNIRSData.HBTlong);
              dataB.labels.push(timeB);
            }

          }

          lastDataB = fNIRSDataB.HBOlong

          drawB(dataB);
        //}
      }
      
    }

  }

}
