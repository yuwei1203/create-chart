import { useEffect, useRef } from 'react';
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
  useChartPerConfig,
} from '@/components/ChartComponents/Common/Component/hook';
import ColorSelect from '@/components/ColorSelect';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import { TSunBurstBasicConfig } from '../type';

const { getRgbaString } = ColorSelect;

const CHART_ID = 'SUN_BURST_BASIC';

const SunBurstBasic = (
  props: ComponentData.CommonComponentProps<TSunBurstBasicConfig>,
) => {
  const { className, style, value, global, children, wrapper: Wrapper } = props;
  const { screenTheme, screenType } = global;

  const {
    id,
    config: {
      options,
      style: { border },
    },
  } = value;

  const { series, tooltip, animation, condition } =
    useChartPerConfig<TSunBurstBasicConfig>(options);

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const chartInstance = useRef<echarts.ECharts>();
  const requestRef = useRef<TFetchFragmentRef>(null);

  useComponentResize(value, () => {
    chartInstance?.current?.resize();
  });

  const {
    request,
    syncInteractiveAction,
    linkageMethod,
    getValue,
    requestUrl,
    componentFilter,
    value: processedValue = [],
    componentFilterMap,
    onCondition,
  } = useComponent<TSunBurstBasicConfig>(
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
  } = useCondition(onCondition, screenType);

  const { value: realValue } = useChartValueMapField(processedValue, {
    map: componentFilterMap,
    fields: {
      seriesKey: '',
      xAxisKeyKey: 'name',
      yAxisValue: 'value',
    },
    deep: true,
  });

  const onClick = (params: any) => {
    const { name, value } = params;
    const target = {
      name,
      value,
    };
    syncInteractiveAction('click', target);
    linkageMethod('click-item', target);
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
    const { radius, label, center, ...nextSeries } = series;
    const { animation: show, animationDuration, animationEasing } = animation;

    const baseSeries = {
      ...nextSeries,
      radius: radius + '%',
      center: center.map((item) => `${item}%`),
      label: {
        ...label,
        color: getRgbaString(label.color),
      },
      type: 'sunburst',
      data: realValue,
      animation: show,
      animationEasing,
      animationEasingUpdate: animationEasing,
      animationDuration,
      animationDurationUpdate: animationDuration,
    };

    return baseSeries;
  };

  const setOption = () => {
    const series = getSeries();

    chartInstance.current?.setOption(
      {
        grid: {
          show: false,
        },
        series,
        tooltip: {
          ...tooltip,
          trigger: 'item',
        },
      },
      true,
    );
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
  }, [processedValue, realValue]);

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
      >
        <Wrapper border={border}>
          <div id={chartId.current} className="w-100 h-100"></div>
          {children}
        </Wrapper>
      </div>
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

const WrapperSunBurstBasic: typeof SunBurstBasic & {
  id: ComponentData.TComponentSelfType;
} = SunBurstBasic as any;

WrapperSunBurstBasic.id = CHART_ID;

export default WrapperSunBurstBasic;
