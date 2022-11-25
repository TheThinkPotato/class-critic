import Chart from "react-apexcharts";

const RadialBar = (props) => {
  let scorePercent = ((props.score / 5) * 100).toFixed(2);
  const width = props.width || 180;

  function checkScore(score) {
    if (typeof score === "number") {
      return "-";
    } else {
      score = (5 * score) / 100;
      return score.toFixed(1);
    }
  }

  if (props.score < 0.01) {
    scorePercent = 1;
  }

  let state = {
    options: {
      plotOptions: {
        radialBar: {
          size: undefined,
          inverseOrder: false,
          startAngle: -180,
          endAngle: 180,
          offsetX: 0,
          offsetY: 0,

          track: {
            show: true,
            startAngle: undefined,
            endAngle: undefined,
            background: "#e2e2e2",
            strokeWidth: "97%",
            opacity: 0.9,
            margin: 3,
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5,
            },
          },
          dataLabels: {
            show: true,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: undefined,
              color: undefined,
              offsetY: -4,
            },
            value: {
              show: true,
              fontSize: "14px",
              fontFamily: undefined,
              color: undefined,
              offsetY: 0,
              // formatter: function (val) {
              //   return val + "%";
              // },
            },
            total: {
              show: true,
              label: "Score",
              color: "#000000",
              formatter: function (w) {
                return (
                  // w.globals.seriesTotals.reduce((a, b) => {
                  //   return a + b;
                  // }, 0) /
                  checkScore(w.globals.series[0])
                  // ((w.globals.series * 5) / 100).toFixed(2)
                );
              },
            },
          },
        },
      },
    },

    series: [scorePercent],
  };

  return (
    <div className="donut">
      <Chart
        options={state.options}
        series={state.series}
        type="radialBar"
        width={width}
      />
    </div>
  );
};

export default RadialBar;
