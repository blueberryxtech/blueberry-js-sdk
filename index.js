window.onload = function(){
  let button = document.getElementById("connect");
  let message = document.getElementById("message");
  let chart = document.getElementById("chart");
  var time = 0;
  var data={dataset:[],labels:[]};                        //Empty Dataset for start

  forwardData()

  if ( 'bluetooth' in navigator === false ) {
      button.style.display = 'none';
      message.innerHTML = 'This browser doesn\'t support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API" target="_blank">Web Bluetooth API</a> :(';
  }

  let fnirsData;

	var initialised = false;
	var timeout = null;

  button.onclick = function(e){
    //need to put exact device name here
    var blueberryController = new BlueberryWebBluetooth("blubry");
    blueberryController.connect();

    blueberryController.onStateChange(function(state){

      fNIRSData = state.fNIRS;
      
      displayData();

    });
  }

  function displayData(){
    
    if(fNIRSData){

      var hBODiv = document.getElementsByClassName('HBO-data')[0];
      hBODiv.innerHTML = fNIRSData.HBO;

      // var hBRDiv = document.getElementsByClassName('HBR-data')[0];
      // hBRDiv.innerHTML = fNIRSData.HBR;

      //update chart
      timer = 20;                                         //Refresh time basely 20ms, 50Hz
      secondsTillReset  = 10;
      date  = new Date();
      hour  = date.getHours();  if(hour<10){  hour= '0'+hour; }
      minutes = date.getMinutes();  if(minutes<10){ minutes=  '0'+minutes;  }
      seconds = date.getSeconds();  if(seconds<10){ seconds=  '0'+seconds;  }
      time  = hour+':'+minutes+':'+seconds;                             //Cheate H:i:s

      if (data.dataset.length != 100) {
        data.dataset.push(fNIRSData.HBO);           //Then remove the first and add a new
        data.labels.push(time);
      } else {
        data.dataset.shift();
        data.labels.shift(); 
        data.dataset.push(fNIRSData.HBO);           //Then remove the first and add a new
        data.labels.push(time);
      }
      draw(data);
      
    }

  }

  function forwardData() {
    console.log('forward data')
    const socket = io('http://localhost:3002');
    console.log(socket)

    // socket.emit('hello', 'world');
    const rawInt = 100

    setInterval(() => {
      socket.emit('chat_message', {data: rawInt});
    }, 2000 )
  }
}
