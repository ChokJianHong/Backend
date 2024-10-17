// Base URL for your API
const baseUrl = "http://localhost:5005/dashboarddatabase";

// Function to fetch problem statistics and draw a chart
function fetchProblemStatistics() {
    fetch(`${baseUrl}/orders/problem-stats`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            drawChart(data);
        })
        .catch((error) => {
            console.error('Error fetching problem statistics:', error);
        });
}

// Function to draw the Google Chart
function drawChart(data) {
    // Load Google Charts
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(() => {
        const chartData = google.visualization.arrayToDataTable(data);

        const options = {
            title: 'Problem Statistics',
            hAxis: { title: 'Month' },
            vAxis: { title: 'Count' },
            series: {
                0: { color: '#e2431e' },  // Alarm
                1: { color: '#f1ca3a' }   // Autogate
            }
        };

        const chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(chartData, options);
    });
}

// Event listener to fetch data on page load
document.addEventListener("DOMContentLoaded", fetchProblemStatistics);

// HTML element to display the chart
document.body.innerHTML += '<div id="chart_div" style="width: 900px; height: 500px;"></div>';
