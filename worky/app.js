const fs = require("fs");
const url = require("url");
const http = require("http");
const https = require("https");

const port = process.env.PORT || 8080;
const server = http.createServer();

server.on("listening", listen_handler);
server.listen(port);
function listen_handler(){
    console.log(`Now Listening on Port ${port}`);
}

server.on("request", request_handler);
function request_handler(req, res){
    console.log(`New Request from ${req.socket.remoteAddress} for ${req.url}`);
    if(req.url === "/"){
        const form = fs.createReadStream("index.html");
		res.writeHead(200, {"Content-Type": "text/html"})
		form.pipe(res);
    }
    else if (req.url.startsWith("/search")){
		let {description, location} = url.parse(req.url,true).query;
		get_job_information(description, location, res);
    }
    else{
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end(`<h1>404 Not Found</h1>`);
    }
}

function get_job_information(description, location, res){
  const jobs_endpoint = `https://jobs.github.com/positions.json?description=${description}&location=${location}`;

if(description&&location){
	const jobs_endpoint = `https://jobs.github.com/positions.json?description=${description}&location=${location}`;

}else if(description&&!location){
  const jobs_endpoint =`https://jobs.github.com/positions.json?search=${description}`;
}

	https.request(jobs_endpoint, {method:"GET"}, process_stream)
	     .end();
	function process_stream (jobs_stream){
		let jobs_data = "";
		jobs_stream.on("data", chunk => jobs_data += chunk);
		jobs_stream.on("end", () => serve_results(jobs_data, res));
	}
}

function serve_results(jobs_data, res){
	let jobs = JSON.parse(jobs_data);
	let results = jobs.map(formatJob).join('');
  results = `

  <!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="">
  <meta name="author" content="">

  <title>Business Frontpage - Start Bootstrap Template</title>

  <!-- Bootstrap core CSS -->
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <!-- Custom styles for this template -->
  <link href="https://fonts.googleapis.com/css?family=DM+Mono&display=swap" rel="stylesheet">

</head>

<body>

  <!-- Navigation -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container">
      <a class="navbar-brand" href="#">Start Bootstrap</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home
              <span class="sr-only">(current)</span>
            </a>
          </li>
         
        </ul>
      </div>
    </div>
  </nav>

  <!-- Header -->
 <style>
   :root {
    --color1:#323232;
    --color2:#ff1e56;
    --color3:#00005c;
    --color4:#6a097d;
    --color5:#c060a1;
    --color6:#142850;
    --color7:#27496d;
  }
.btn:link,
.btn:visited{
  text-decoration: none;
  text-transform:uppercase;
  position:relative;
  top:0;
  left:0;
  padding:0.6em 1.2em;
  border-radius:100px;
  display:inline-block;
  transition: all .5s;
  color:white;
}

.btn-white{
  background:var(--color6);
  color:white;
  border: solid white;
}

.btn:hover{
   box-shadow:0px 10px 10px rgba(20,40,80,0.2);
   transform : translateY(-3px);
}

.btn:active{
  box-shadow:0px 5px 10px rgba(20,40,80,0.2)
  transform:translateY(-1px);
}

.btn-bottom-animation-1{
  animation:comeFromBottom 1s ease-out .8s;
}

.btn::after{
  content:"";
  text-decoration: none;
  text-transform:uppercase;
  position:absolute;
  width:100%;
  height:100%;
  top:0;
  left:0;
  border-radius:100px;
  display:inline-block;
  z-index:-1;
  transition: all .5s;
}

.btn-white::after {
    background:var(--color6);
}

.btn-animation-1:hover::after {
    transform: scaleX(1.4) scaleY(1.6);
    opacity: 0;
}

@keyframes comeFromBottom{
  0%{
    opacity:0;
    transform:translateY(40px);
  } 
  100%{
    opacity:1;
    transform:translateY(0);
  }
}



::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  
body {
  background-color: var(--color6);
  font-family: 'DM Mono', monospace;

  }

.cards-list {
    z-index: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  
  .card {
    margin: 1% auto;
    width: 80%;
    height: 20%;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.4s;
    position: relative;
    border-style: solid;
    background-color:var(--color7);
 
  }
  
  .card .card_image {
    width: 5em;;
    height: 5em;
    border-radius: 50%;
    position: absolute;
    top: 30%;
    left: 6%;
   transform: translate(-50%, -50%);
    
    
  }
  .card_title {
      padding-left: 19%;
      padding-top: 2%;
  }
  .card_description {
    padding-left: 19%;
    font-size: 0.8em;
    transform: translate(0%, -30%);
    
}
.card_tags {
    padding-left: 19%;
    font-size: 0.8em;
    
}
.card_action{
  padding-left: 80%;
  padding-bottom: 5%;
}
  
  .card .card_image img {
    width: inherit;
    height: inherit;
    border-radius: 40px;
    object-fit: contain;
    background-color:white;
  }
  h1 ,h2, h3, h4, h5, p{
         color: white;
  }

  ins {
    background: #83d5a8;
    height: auto;
    border-radius: .3em;
    display: inline; 
    -webkit-box-decoration-break: clone;
    -o-box-decoration-break: clone;
    box-decoration-break: clone;
    margin-left: 0.3em;
    margin-right: 0.3em;
   margin-top: 0.3em;
   margin-bottom:0.3em;
  }
  ins2 {
    background: #c060a1;
    height: auto;
    border-radius: .3em;
    display: inline; 
    -webkit-box-decoration-break: clone;
    -o-box-decoration-break: clone;
    box-decoration-break: clone;
    margin-left: 0.3em;
    margin-right: 0.3em;
   margin-top: 0.3em;
   margin-bottom:0.3em;
  }
  ins3 {
    background: #fa9191;
    height: auto;
    border-radius: .3em;
    display: inline; 
    -webkit-box-decoration-break: clone;
    -o-box-decoration-break: clone;
    box-decoration-break: clone;
    margin-left: 0.3em;
    margin-right: 0.3em;
   margin-top: 0.3em;
   margin-bottom:0.3em;
  }
  ins4 {
    background: #0779e4;
    height: auto;
    border-radius: .3em;
    display: inline; 
    -webkit-box-decoration-break: clone;
    -o-box-decoration-break: clone;
    box-decoration-break: clone;
    margin-left: 0.3em;
    margin-right: 0.3em;
   margin-top: 0.3em;
   margin-bottom:0.3em;
  }
  ins, del, ins2, ins3, ins4{
    text-decoration: none;
    display: inline-block;
    padding: 0 .3em;
  }
 </style>

  <!-- Page Content -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container">
      <a class="navbar-brand" href="#">Work heroes</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Menu Principal
              <span class="sr-only">(current)</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">A propos</a>
          </li>
         
          <li class="nav-item">
            <a class="nav-link" href="#">Contactez nous</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container">
<div class="cards-list" style="padding-top:10em;">
  
      
      ${results}
      </div>
  </div>
  <footer class="py-5 bg-dark">
    <div class="container">
      <p class="m-0 text-center text-white">Copyright &copy; Work heroes</p>
    </div>
  <!-- Footer -->
  <footer class="py-5 bg-dark">
    <div class="container">
      <p class="m-0 text-center text-white">Copyright &copy; Work heroes 2020</p>
    </div>
    <!-- /.container -->
  </footer>

  
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>

</body>

</html>
`;
  results =`${results}`;
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end(results);
  
  

	function formatJob({title, description, url, location, type, company, company_url, company_logo,created_at}){
		return `
	<div class="card 3">
        <div class="card_image">
        <img src=${company_logo} alt="">
        </div>
        <div class="card_title">
          <p>${title}</p>
        </div>
        <div class="card_description">
        <p>${location}</p>
        </div>
        <div class="card_tags">
          <p>
          <ins>${company}</ins><ins2>${created_at}</ins2><ins4>${type}</ins4>
          </p>
         </div>
         <div class="card_action">
           <div class="box">
           <a href=${url} class="btn btn-white btn-animation-1">Apply</a> 
         </div>
         
        </div>
      
      </div>`;
	}
}
