var name;
var destination;
var firstArrival;
var frequency;
var database;
var trainFirebaseData;
var newFirebaseData;
var time;
var clock;
$(document).ready(function() {
  // Running Clock at the top
  function runningClock() {
    time = moment().format("hh:mm:ss A");
    $("#time").text(time);
  }
  //  Call function with setInterval
  clock = setInterval(runningClock, 1000);

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDY-SkTqn58ofKqP9fJQmDJsD_f2GEX4zM",
    authDomain: "choo-choo-12818.firebaseapp.com",
    databaseURL: "https://choo-choo-12818.firebaseio.com",
    projectId: "choo-choo-12818",
    storageBucket: "choo-choo-12818.appspot.com",
    messagingSenderId: "1014760958378"
  };
  firebase.initializeApp(config);

  database = firebase.database();

  $("#submitButton").on("click", function(event) {
    event.preventDefault();

    //  Grab Input values IF the conditon above is true
    name = $("#trainNameInput")
      .val()
      .trim();
    destination = $("#destinationInput")
      .val()
      .trim();
    firstArrival = $("#firstTrainTimeInput")
      .val()
      .trim();
    frequency = $("#frequencyInput")
      .val()
      .trim();

    console.log(firstArrival);

    //  Link and assign variable for firebase
    trainFirebaseData = {
      DatatrainName: name,
      Datadest: destination,
      DatafirstArrival: firstArrival,
      Datafrequency: frequency,
      TimeStamp: firebase.database.ServerValue.TIMESTAMP
    };

    //    Variable for firebase to link train easier
    database.ref().push(trainFirebaseData);

    //  Make sure fields are back to blank after adding a train
    clear();
  });

  database.ref().on("child_added", function(childSnapshot) {
    //  make variable to ease reference
    var snapName = childSnapshot.val().DatatrainName;
    var snapDest = childSnapshot.val().Datadest;
    var snapFreq = childSnapshot.val().Datafrequency;
    var snapArrival = childSnapshot.val().DatafirstArrival;

    //  Current Time
    var timeIs = moment();
    //  Convert Time and configure for Future use by pushing firstArrival back 1 year
    var firstArrivalConverted = moment(snapArrival, "HH:mm A").subtract(
      1,
      "years"
    );
    //  Calculate now vs First Arrival
    var diff = moment().diff(moment(firstArrivalConverted), "minutes");
    var left = diff % snapFreq;
    //  How long till train
    var timeLeft = snapFreq - left;
    var newArrival = moment()
      .add(timeLeft, "m")
      .format("HH:mm: A");

    $("#table-info").append(
      "<tr><td>" +
        snapName +
        "</td><td>" +
        snapDest +
        "</td><td>" +
        snapFreq +
        "</td><td>" +
        newArrival +
        "</td><td>" +
        timeLeft +
        "</td></tr>"
    );
  });

  function clear() {
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainTimeInput").val("");
    $("#frequencyInput").val("");
  }
});
