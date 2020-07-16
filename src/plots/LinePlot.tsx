import React from "react";
import PlotlyPlot from "./PlotlyPlot";
import { PlotComponentProps } from "./Types";
import { Layout, Annotations, PlotData  } from "plotly.js";

interface LinePlotDatum {
    X1: number[];
    Y1: number[];
    X2: number[];
    Y2: number[];
    X3: number[];
    Y3: number[];
    fill: PlotData['fill'];
  }

  interface Props {
    data: LinePlotDatum;
    plotTitle: string;
    xLabel: string;
    yLabel: string;
 
  }
  

// LinePlotBasic | LinePlotBasic | LinePlotBasic
export  default  function LinePlotBasic(props: Props) {
  const { xLabel, yLabel,data, plotTitle} = props;

  let layout :Partial<Layout>= {
    xaxis: {
      title: xLabel
    },
    yaxis: {
      title: yLabel
    },
    title: {
        text: plotTitle
    }

  }

 var trace1={x:data.X1, y:data.Y1}

    return (
      <
        PlotlyPlot data={[trace1]}  layout={layout} 
    
        />
      )

}

// LinePlotBasicFilled | LinePlotBasicFilled | LinePlotBasicFilled

export function LinePlotBasicFilled(props: Props) {
  const { xLabel, yLabel,data, plotTitle} = props;

  let layout :Partial<Layout>= {
    xaxis: {
      title: xLabel
    },
    yaxis: {
      title: yLabel
    },
    title: {
        text: plotTitle
    }
  

  }

 var trace1={x:data.X1, y:data.Y1, fill:data.fill}

    return (
      <
        PlotlyPlot data={[trace1]}  layout={layout} 
    
        />
      )

}



//  MultiVariate |   MultiVariate   |   MultiVariate

export function MultiVariate(props: Props) {
  const { xLabel, yLabel,data, plotTitle} = props;

  let layout :Partial<Layout>= {
    xaxis: {
      title: xLabel
    },
    yaxis: {
      title: yLabel
    },
    title: {
        text: plotTitle
    }
  }

  var trace1={x:data.X1, y:data.Y1}
  var trace2={x:data.X2, y:data.Y2}
  var trace3={x:data.X3, y:data.Y3}


    return (
      <
        PlotlyPlot data={[trace1,trace2, trace3]}  layout={layout} 
    
        />
      )

}



// MultiVariateFilled   |  MultiVariateFilled   |  MultiVariateFilled  

export function MultiVariateFilled(props: Props) {
  const { xLabel, yLabel,data, plotTitle} = props;

  let layout :Partial<Layout>= {
    xaxis: {
      title: xLabel
    },
    yaxis: {
      title: yLabel
    },
    title: {
        text: plotTitle
    }
  }

  var trace1={x:data.X1, y:data.Y1, fill: data.fill}
  var trace2={x:data.X2, y:data.Y2, fill:data.fill}
  var trace3={x:data.X3, y:data.Y3, fill:data.fill}


    return (
      <
        PlotlyPlot data={[trace1,trace2,trace3]}  layout={layout} 
    
        />
      )

}

// PlotFaceting |   PlotFaceting    |   PlotFaceting

export function PlotFaceting(props: Props) {
  const { xLabel, yLabel,data, plotTitle} = props;

  let layout :Partial<Layout>= {
    xaxis: {
      title: xLabel
    },
    yaxis: {
      title: yLabel
    },
    title: {
        text: plotTitle
    },
    grid: {
      rows: 3,
      columns: 1,
      pattern: 'independent'
    }

  }

  var trace1={x:data.X1, y:data.Y1}
  var trace2={x:data.X2, y:data.Y2, xaxis: 'x2',yaxis: 'y2'}
  var trace3={x:data.X3, y:data.Y3, xaxis: 'x3',yaxis: 'y3'}


    return (
      <
        PlotlyPlot data={[trace1,trace2,trace3]}  layout={layout} 
    
        />
      )

}


