$( function() {

    // date picker from jquery
  $( "#datepicker" ).datepicker();

  // save the emotional state in the json api
  $('form').on('submit', postEmotionalState);

  function postEmotionalState(e){

    e.preventDefault();
    let date = e.target[0].value
    let anger_score_value = e.target[1].value
    let happiness_score_value = e.target[2].value
    let sadness_score_value = e.target[3].value
    let frustration_score_value = e.target[4].value
    let empathy_score_value = e.target[5].value

    $.ajax({
      type: 'POST',
      url: "http://localhost:3000/api/emotional_states",
      data: {
        date : date, 
        anger_score : anger_score_value, 
        happiness_score : happiness_score_value,
        sadness_score : sadness_score_value,
        frustration_score : frustration_score_value,
        empathy_score : empathy_score_value, 
      },
      // dataType: "text",
      success: function(resultData) { 
        alert("Save Complete");
        location.reload(); 
      }
    });
  }


  // default styling for the chart
  Chart.defaults.global.defaultFontFamily = 'Lato';
  Chart.defaults.global.defaultFontSize = 15;
  Chart.defaults.global.defaultFontColor = '#777';



  // display the charts for the last evaluation
  function DisplayLastData(chart_type){
    fetch('/api/emotional_states')
    .then((res) => res.json())
    .then((data) => {

      //finding the last data
      const maxValueOfDate = data.map(function(e) { return e.date; }).sort().reverse()[0]

      let sessionEvaluated = data.filter(function (el) {
        return el.date == maxValueOfDate;
      })

      let lastAngerScore = sessionEvaluated[0].anger_score
      let lastHappinessScore = sessionEvaluated[0].happiness_score
      let lastSadnessScore = sessionEvaluated[0].sadness_score
      let lastFrustrationScore = sessionEvaluated[0].frustration_score
      let lastEmpathyScore = sessionEvaluated[0].empathy_score

      console.log(maxValueOfDate, lastAngerScore, lastHappinessScore, lastSadnessScore, lastFrustrationScore, lastEmpathyScore);

          //config variable for the charts of last evaluation
          var configChartLastEvaluation = {
            type:`${chart_type}`, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
              data:{
                labels:['Anger', 'Happiness', 'Sadness', 'Frustration', 'Empathy'],
                datasets:[{
                  label:'Emotion',
                  data:[
                    `${lastAngerScore}`,
                    `${lastHappinessScore}`,
                    `${lastSadnessScore}`,
                    `${lastFrustrationScore}`,
                    `${lastEmpathyScore}`
                  ],

                  //backgroundColor:'green',
                  backgroundColor:[
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                  ],
                  borderWidth:1,
                  borderColor:'#777',
                  hoverBorderWidth:3,
                  hoverBorderColor:'#000'
                }]
              },
              options:{
                maintainAspectRatio: false,
                title:{
                  display:true,
                  text:`${new Date(sessionEvaluated[0].date).toString().slice(0,15)}`,
                  fontSize:18
                },
                legend:{
                  display:false,
                  position:'right',
                  labels:{
                    fontColor:'#000'
                  }
                },
                layout:{
                  padding:{
                    left:0,
                    right:0,
                    bottom:0,
                    top:0
                  }
                },
                tooltips:{
                  enabled:true
                }
              }
            };

            var ctx = document.getElementById("canvas1").getContext("2d");

            // Remove the old chart and all its event handles
            if (myChart) {
            myChart.destroy();
            }

            // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
            var temp = jQuery.extend(true, {}, configChartLastEvaluation);
            myChart = new Chart(ctx, temp);   
      });
      
  }

  // get a date range

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  function getDates(startDate, stopDate) {
      var dateArray = new Array();
      var currentDate = startDate;
      while (currentDate <= stopDate) {
          dateArray.push(new Date (currentDate));
          currentDate = currentDate.addDays(1);
      }
      return dateArray;
  }



  // Display the chart for previous periods
  function DisplayLastWeekMonthYearData(period, chartType){
    fetch('/api/emotional_states')
    .then((res) => res.json())
    .then((data) => {

      //defining an array of all the dates of last week
      let d = new Date();
      let startDay;
      if (period === "week") {
        startDay = new Date(d.setDate(d.getDate() - 7));
      };
      if (period === "month") {
        startDay = new Date(d.setDate(d.getDate() - 30));
      };
      if (period === "year") {
        startDay = new Date(d.setDate(d.getDate() - 365));
      };
      let todayDate = new Date();
      let dateRange = getDates(startDay, todayDate)
      //we can't keep the time as there wouldn't be any match in our db
      let dateRangeTruncated = []
      for (e of dateRange) {
        dateRangeTruncated.push(e.toString().slice(0, 15));
      }
      // debugger
      
      // finding the objects with those dates
      let sessionsEvaluated = data.filter(function (el) {
        let dateTruncated = new Date(el.date).toString().slice(0, 15)
        return dateRangeTruncated.includes(dateTruncated) ;
      })

      let angerArray = [];
      let happinessArray = [];
      let sadnessArray = [];
      let frustrationArray = [];
      let empathyArray = [];
      let dateArray = [];

      let sessionsEvaluatedSorted = sessionsEvaluated.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
      })

      for(session of sessionsEvaluatedSorted){
        dateArray.push(new Date(session.date).toString().slice(3,15));
        angerArray.push(session.anger_score);
        happinessArray.push(session.happiness_score);
        sadnessArray.push(session.sadness_score);
        frustrationArray.push(session.frustration_score);
        empathyArray.push(session.empathy_score);
      }

          //config variable for the charts of last week evaluations
          var configChartLastEvaluation = {
            type: `${chartType}`, // bar, horizontalBar, pie, line, doughnut, radar, polarArea
              data:{
                labels: dateArray,
                datasets:[

                {
                  label:'Anger',
                  borderColor: 'rgba(255, 99, 132, 0.6)',

                  data:angerArray
                },
                {
                  label:'Happiness',
                  borderColor: "rgba(54, 162, 235, 0.6)",
                  data:happinessArray
                },
                {
                  label:'Sadness',
                  borderColor: "rgba(255, 206, 86, 0.6)",
                  data:sadnessArray
                },
                {
                  label:'Frustration',
                  borderColor: "rgba(75, 192, 192, 0.6)",
                  data:frustrationArray
                },
                {
                  label:'Empathy',
                  borderColor: "rgba(153, 102, 255, 0.6)",
                  data:empathyArray
                },
                ],
              },
            options:{
                maintainAspectRatio: false,
            }
            };
            
            if (period === "week") {
            var ctx = document.getElementById("canvas2").getContext("2d");
            };
            if  (period === "month") {
            var ctx = document.getElementById("canvas3").getContext("2d");
            };
            if  (period === "year") {
            var ctx = document.getElementById("canvas4").getContext("2d");
            };

            // Remove the old chart and all its event handles
            if (myChart) {
            myChart.destroy();
            }

            // Chart.js modifies the object you pass in. Pass a copy of the object so we can use the original object later
            var temp = jQuery.extend(true, {}, configChartLastEvaluation);
            myChart = new Chart(ctx, temp);   
      });
      
  }


  var myChart;

  $("#bar-btn").click(function() {
    DisplayLastData('bar');
  });

  $("#horizontal-bar-btn").click(function() {
    DisplayLastData('horizontalBar');
  });

  $("#line-btn-week").click(function() {
    DisplayLastWeekMonthYearData("week", "line");
  });

  $("#line-btn-month").click(function() {
    DisplayLastWeekMonthYearData("month", "line");
  });
  $("#line-btn-year").click(function() {
    DisplayLastWeekMonthYearData("year", "line");
  });
  

} );

