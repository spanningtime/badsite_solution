document.addEventListener("DOMContentLoaded", function(){

    // Pull data from JSON file
    fetch('/all')
        .then(
            function(res) {
                if (res.status !== 200) {
                    console.log('problem. status code: ' + res.status );
                    return;
                }

                //Response Data
                res.json().then(function(data) {
                    manipulateData(data)
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    
    let bodyHtmlArr = [];
    let textArr = [];

    function manipulateData(data) {
        // Push each bodyHtml entry into array
        for (content of data.content) {
            if (content.content.bodyHtml) {
                bodyHtml = content.content.bodyHtml
                bodyHtmlArr.push(bodyHtml)
            }
        }

        for (text of bodyHtmlArr) {
            // Removing all the anchor tags, looping through until index returns -1 which means there isn't an anchor tag
            while (text.indexOf('</a>') !== -1) {
                text = text.replace(/<a.*?a>/, '')
            }
            // Removing all non-word characters and whitespace
            text = text.replace(/[\W\d]+/g," ");
            text = text.trim();
            // Remove empties and push individual words into array
            if (text.length !== 0) {
                let wordsArr = text.split(" ");
                wordsArr.forEach((el) => {
                    //gotta get rid of the single-character non-words
                    if (el.length === 1 && (el !== 'i' || el !== 'a' || el !== 'u')) {
                        return false;
                    }
                    //gotta get rid of that one really long word!
                    if (el.length < 30) {
                        textArr.push(el)
                    }
                })
            }
        }
        buildCountObject();
    }

    let wordsArr = [];
    let countObj = {}

    function buildCountObject() {

        let word = '';
        textArr.forEach((el, i) => {
            el = el.toLowerCase();

            let count = 0;
            //If there isn't a key with the name of the word create the key and assign a value of 1
            if (countObj[el] === undefined) {
                countObj[el] = 1;
            }
            //add 1 to the value representing the occurrence of the word
            else {
                countObj[el] += 1;
            }
        })

        buildChart();
    }

    // Make some random colors for the bar graph
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    
    function buildColors() {
        let arr = [];
        let i = 0;
        while( i < 179 ) {
            let r = getRandomInt(255);
            let b = getRandomInt(255);
            let g = getRandomInt(255);
            let color = `rgba(${r}, ${g}, ${b}, 0.2)`;
            arr.push(color);
            i += 1;
        };
        return arr;
    }

    //Chart Stuff!
    function buildChart() {
        const labels = Object.keys(countObj);
        const values = Object.values(countObj)
        const ctx = document.getElementById('chart').getContext('2d');
        colorsArr = buildColors();
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Unique word occurrence taken from comments made by loyal fans of Justin Beiber',
                    data: Object.values(countObj),
                    backgroundColor: colorsArr,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

  });