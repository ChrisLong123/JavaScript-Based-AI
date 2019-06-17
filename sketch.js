$("#model-selector").change(function () {
  showSelected($("#model-selector").val());
  console.log($("#model-selector").val() + " has been selected.");
});

async function showSelected(name) {
  if (name === "Webcam") {
    $("#image-selector").hide();
    $("#predict-button").hide();
    $("#selected-image").hide();
    $("#video").show();
    const video = document.getElementById('video');

    // Create a webcam capture
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        console.log("Webcam enabled...")
      })

    // Initialize the Image Classifier method with MobileNet passing the video as the
    // second argument and the getClassification function as the third
    ml5.imageClassifier('MobileNet', video)
      .then(classifier => loop(classifier))

    const loop = (classifier) => {
      classifier.predict()
        .then(results => {
        $("#prediction-list").empty();
        //$("#prediction-list").append((1) + ". " + results[0].className + " : " + results[0].probability.toFixed(4) + "<br>");
        let i = 0;
	    //$("#prediction-list").empty().show();
	    for (i; i < 3; i++)
	    {
	        //console.log(i);
	    	$("#prediction-list").append((i + 1) + ". " + results[i].className + " : " + results[i].probability.toFixed(4) + "<br>");
	    }
	    if($("#model-selector").val() === "Webcam") {
          loop(classifier) // Call again to create a loop
	    }
        })
    }
  }

  
  else if (name === "Image Select") {
    $("#image-selector").show();
    $("#predict-button").show();
    $("#selected-image").show();
    $("#video").hide();
    $("#prediction-list").empty();

    try{
    	video.srcObject.getTracks()[0].stop();
   		console.log("Webcam disabled...");
    }
    catch
    {

    }


  }
  else {
    throw new Error("Unknown Classifier type");
  }
}

$("#image-selector").change(function () {
  let reader = new FileReader();
  reader.onload = function () {
    let dataURL = reader.result;
    $('#selected-image').attr("src", dataURL);
  }
  let file = $("#image-selector").prop("files")[0];
  reader.readAsDataURL(file);
})

const classifier = ml5.imageClassifier('MobileNet', function() {
        console.log('Model Loaded!');
      });

$("#predict-button").click(async function () {
  let image = $("#selected-image").get(0);
  classifier.predict(image, 5, function(err, results) {
      let i = 0;
      $("#prediction-list").empty().show();
      for (i; i < 5; i++)
      {
        console.log(results[i].className + ":" + results[i].probability.toFixed(6));
         $("#prediction-list").append((i + 1) + ". " + results[i].className + " : " + results[i].probability.toFixed(6) + "<br>");

      }
  });
})
