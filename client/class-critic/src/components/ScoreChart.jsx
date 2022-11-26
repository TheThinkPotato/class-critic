import RadialBar from "./RadialBar";

const ScoreChart = (props) => {
  return (
    <div className="relative w-36">
      <div className="absolute -top-6">
        <RadialBar score={props.score} />
      </div>
    </div>
  );
};

export default ScoreChart;
