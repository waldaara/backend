/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const lineConfig = {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Count',
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: [43, 48, 40, 54, 67, 73, 70],
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    /**
     * Default legends are ugly and impossible to style.
     * See examples in charts.html to add your own legends
     *  */
    legend: {
      display: false,
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month',
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Value',
        },
      },
    },
  },
}

// change this to the id of your chart element in HMTL
const lineCtx = document.getElementById('line')
window.myLine = new Chart(lineCtx, lineConfig)

// Función para procesar el JSON
const countCommentsByDay = (data) => {
  const counter = {};

  Object.values(data).forEach(record => {

    const savedTime = record.saved;

    if (!savedTime) {
      return;
    }

    const dayMonth = savedTime.split(",")[0].split("/").slice(0, 2).join("/");

    if (!!counter[dayMonth]) {
      counter[dayMonth] = counter[dayMonth] + 1
    } else {
      counter[dayMonth] = 1
    }
  });

  const labels = Object.keys(counter);
  const counts = Object.values(counter);

  return { labels, counts };
}

const updatee = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {

      const { labels, counts } = countCommentsByDay(data)

      // Reset data
      window.myLine.data.labels = [];
      window.myLine.data.datasets[0].data = [];

      // New data
      window.myLine.data.labels = [...labels]
      window.myLine.data.datasets[0].data = [...counts]

      window.myLine.update();

    })
    .catch(error => console.error('Error:', error));
}

updatee();