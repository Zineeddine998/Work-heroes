const method ='GET';
const url='https://jobs.github.com/positions.json?description=python&full_time=true&location=sf';

var xhr = new XMLHttpRequest();
xhr.open( "GET", url );

//   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//   xhr.withCredentials = true;
//   xhr.setRequestHeader( 'Content-Type', _contenttype );
//   xhr.setRequestHeader( 'CrossDomain', 'true' );


xhr.addEventListener( 'load',  function () {
       xhr.responseJSON = JSON.parse( xhr.responseText );
       alert( xhr.responseJSON);
});

xhr.onerror = function(e) { 
      alert("Ajax request error");
};

xhr.send( JSON.stringify({}) );