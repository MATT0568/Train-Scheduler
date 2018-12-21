var config = {
    apiKey: "AIzaSyBEwW8DlzoB8jsZqJ2tmK_nWVqkQMcKV6Q",
    authDomain: "train-scheduler-0568.firebaseapp.com",
    databaseURL: "https://train-scheduler-0568.firebaseio.com",
    projectId: "train-scheduler-0568",
    storageBucket: "train-scheduler-0568.appspot.com",
    messagingSenderId: "882999280843"
};
firebase.initializeApp(config);

var database = firebase.database();

database.ref().on('child_added', function (snapshot) {
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var minutesAway = snapshot.val().minutesAway;
    var nextArrival = snapshot.val().nextArrival;
    $("#rows").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td><tr>");
});

$(document).ready(function () {
    $("#submit").on("click", function (event) {
        event.preventDefault();
        var name = $("#train").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#first").val().trim();
        var frequency = $("#frequency").val().trim();

        var minutesAway = getMinutesAway(firstTrain, frequency);
        var nextArrival = getNextArrival(firstTrain, frequency);

        database.ref().push({
            name: name,
            destination: destination,
            frequency: frequency,
            minutesAway: minutesAway,
            nextArrival: nextArrival
        });
    });
});

function getNextArrival(firstTrain, frequency) {
    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

    var tRemainder = diffTime % frequency;
    var tMinutesTillTrain = frequency - tRemainder;

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm a");

    return nextTrain;
}

function getMinutesAway(firstTrain, frequency) { 
    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    var tRemainder = diffTime % frequency;

    var tMinutesTillTrain = frequency - tRemainder;

    return tMinutesTillTrain;
}