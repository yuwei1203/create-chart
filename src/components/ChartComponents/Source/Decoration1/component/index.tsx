import { useMemo, useRef } from 'react';
import { uniqueId, merge } from 'lodash';
import classnames from 'classnames';
import ColorSelect from '@/components/ColorSelect';
import InternalDecoration from '@/components/Decoration/Decoration1';
import { TDecoration1Config } from '../type';
import styles from './index.less';

const { getRgbaString } = ColorSelect;

const CHART_ID = 'DECORATION_1';

const Decoration = (
  props: ComponentData.CommonComponentProps<TDecoration1Config>,
) => {
  const { className, style, value, children, wrapper: Wrapper } = props;

  const {
    config: {
      options,
      style: { border },
    },
  } = value;
  const { color } = options;

  const chartId = useRef<string>(uniqueId(CHART_ID));

  const componentClassName = useMemo(() => {
    return classnames(
      className,
      'dis-flex',
      styles['component-source-decoration-1'],
    );
  }, [className]);

  return (
    <div
      className={componentClassName}
      style={merge(
        {
          width: '100%',
          height: '100%',
        },
        style,
      )}
      id={chartId.current}
    >
      <Wrapper border={border}>
        {children}
        <InternalDecoration
          className={'w-100 h-100'}
          color={color.map((item) => getRgbaString(item))}
        ></InternalDecoration>
      </Wrapper>
    </div>
  );
};

const WrapperDecoration: typeof Decoration & {
  id: ComponentData.TComponentSelfType;
} = Decoration as any;

WrapperDecoration.id = CHART_ID;

export default WrapperDecoration;
