import { CSSProperties, useEffect, useRef } from 'react';
import { init } from 'echarts';
import { uniqueId, merge } from 'lodash';
import classnames from 'classnames';
import { useDeepUpdateEffect } from '@/hooks';
import {
  useComponent,
  useChartComponentResize,
  useChartValueMapField,
  useComponentResize,
  useAnimationChange,
  useCondition,
  useChartComponentTooltip,
  useChartPerConfig,
} from '@/components/ChartComponents/Common/Component/hook';
import { ComponentProps } from '@/components/ChartComponents/Common/Component/type';
import ColorSelect from '@/components/ColorSelect';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import { radialGradientColor } from '@/components/ChartComponents/Common/utils';
import { TRadialBarConfig } from '../type';

const { getRgbaString } = ColorSelect;

const CHART_ID = 'RADIAL_BAR';

const RadialBar = (props: {
  className?: string;
  style?: CSSProperties;
  value: ComponentData.TComponentData<TRadialBarConfig>;
  global: ComponentProps['global'];
}) => {
  const { className, style, value, global } = props;
  const { screenTheme, screenType } = global;

  const {
    id,
    config: { options },
  } = value;

  const { legend, series, xAxis, yAxis, tooltip, animation, condition, grid } =
    useChartPerConfig<TRadialBarConfig>(options);

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const chartInstance = useRef<echarts.ECharts>();
  const requestRef = useRef<TFetchFragmentRef>(null);

  useComponentResize(value, () => {
    chartInstance?.current?.resize();
  });

  const {
    request,
    syncInteractiveAction,
    getValue,
    requestUrl,
    componentFilter,
    value: processedValue = [],
    componentFilterMap,
    onCondition,
  } = useComponent<TRadialBarConfig>(
    {
      component: value,
      global,
    },
    requestRef,
  );

  const {
    onCondition: propsOnCondition,
    style: conditionStyle,
    className: conditionClassName,
  } = useCondition(onCondition);

  const { seriesKeys, xAxisKeys, yAxisValues } = useChartValueMapField(
    processedValue,
    {
      map: componentFilterMap,
      fields: {
        seriesKey: 's',
        xAxisKeyKey: 'x',
        yAxisValue: 'y',
      },
    },
  );

  const onClick = (params: any) => {
    const { seriesName, name, value } = params;
    syncInteractiveAction('click', {
      x: name,
      y: value,
      s: seriesName,
    });
  };

  const initChart = () => {
    const chart = init(
      document.querySelector(`#${chartId.current!}`)!,
      screenTheme,
      {
        renderer: 'canvas',
      },
    );
    chartInstance.current = chart;
    setOption();
  };

  const getSeries = () => {
    const { itemStyle, backgroundStyle, label, ...nextSeries } = series;
    const { animation: show, animationDuration, animationEasing } = animation;

    const baseSeries = {
      ...nextSeries,
      backgroundStyle: {
        color: radialGradientColor(backgroundStyle),
      },
      label: {
        ...label,
        color: getRgbaString(label.color),
      },
      type: 'bar',
      itemStyle: {
        ...itemStyle,
        color: radialGradientColor(itemStyle.color[0]),
      },
      data: yAxisValues._defaultValue_,
      emphasis: {
        focus: 'series',
      },
      animation: show,
      animationEasing,
      animationEasingUpdate: animationEasing,
      animationDuration,
      animationDurationUpdate: animationDuration,
    };

    const realSeries = seriesKeys.length
      ? seriesKeys.map((item: any, index: number) => {
          return {
            ...baseSeries,
            itemStyle: {
              ...itemStyle,
              color: radialGradientColor(itemStyle.color[index]),
            },
            data: yAxisValues[item] || [],
            name: item,
          };
        })
      : [baseSeries];

    return realSeries;
  };

  const setOption = () => {
    const { animation, ...nextTooltip } = tooltip;

    const realSeries = getSeries();

    chartInstance.current?.setOption({
      grid: {
        ...grid,
      },
      legend: {
        ...legend,
        data: seriesKeys,
      },
      series: realSeries,
      xAxis: [
        {
          ...xAxis,
          splitLine: {
            show: false,
          },
          data: xAxisKeys,
        },
      ],
      yAxis: [yAxis],
      tooltip: {
        ...nextTooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
    });

    screenType !== 'edit' &&
      animation.show &&
      useChartComponentTooltip(chartInstance.current!, realSeries, {
        interval: animation.speed,
      });
  };

  useChartComponentResize(chartInstance.current!);

  useEffect(() => {
    initChart();
    return () => {
      chartInstance.current?.dispose();
    };
  }, [screenTheme]);

  useEffect(() => {
    chartInstance.current?.off('click');
    chartInstance.current?.on('click', onClick);
  }, [syncInteractiveAction]);

  // 数据发生变化时
  useDeepUpdateEffect(() => {
    setOption();
    chartInstance.current?.resize();
  }, [processedValue, seriesKeys, xAxisKeys, yAxisValues]);

  // 配置发生变化时
  useDeepUpdateEffect(() => {
    setOption();
    chartInstance.current?.resize();
  }, [options]);

  useAnimationChange(chartInstance.current!, animation, setOption);

  return (
    <>
      <div
        className={classnames(className, conditionClassName)}
        style={merge(
          {
            width: '100%',
            height: '100%',
          },
          style,
          conditionStyle,
        )}
        id={chartId.current}
      ></div>
      <FetchFragment
        id={id}
        url={requestUrl}
        ref={requestRef}
        reFetchData={request}
        reGetValue={getValue}
        reCondition={propsOnCondition}
        componentFilter={componentFilter}
        componentCondition={condition}
      />
    </>
  );
};

const WrapperRadialBar: typeof RadialBar & {
  id: ComponentData.TComponentSelfType;
} = RadialBar as any;

WrapperRadialBar.id = CHART_ID;

export default WrapperRadialBar;
