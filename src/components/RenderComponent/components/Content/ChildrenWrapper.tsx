import { ReactNode, useMemo, Children, cloneElement } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { get } from 'lodash';
import { useRafState } from 'ahooks';
import { getComponentStyleInScreenType } from '@/utils/Assist/Component';
import { ComponentTransformOriginChange } from '@/utils/Assist/BreakingChange';
import { mapStateToProps, mapDispatchToProps } from './connect';
import ConnectSelectChangeWrapper from '../SelectChangeWrapper';
import styles from '../../index.less';

const ChildrenWrapper = (props: {
  children?: ReactNode;
  value: ComponentData.TComponentData;
  parent: ComponentData.TComponentData | null;
  borderNone?: boolean;
  screenType: ComponentData.ScreenType;
  version: string;
  flag: ComponentData.ScreenFlagType;
}) => {
  const {
    value,
    children,
    borderNone = false,
    screenType,
    version,
    flag,
  } = props;

  const [isSelect, setIsSelect] = useRafState<boolean>(false);

  const componentScreenTypeStyle = useMemo(() => {
    return getComponentStyleInScreenType(screenType);
  }, [screenType]);

  // * 1.5版本以后设置成中心位置
  const transformOrigin = useMemo(() => {
    return ComponentTransformOriginChange(version);
  }, [version]);

  const realChildren = useMemo(() => {
    return Children.map(children, (child) => {
      const className = get(child, 'props.className');
      const value: ComponentData.TComponentData = get(child, 'props.value');
      const {
        config: {
          style: { left, top, rotate, opacity, width, height, skew },
          attr: { visible },
        },
      } = value;

      const realStyle = {
        transform: `rotate(${rotate}deg) skew(${skew?.x || 0}deg, ${
          skew?.y || 0
        }deg)`,
        transformOrigin,
        opacity,
        ...componentScreenTypeStyle,
      };

      if (!visible) realStyle.visibility = 'hidden';

      return cloneElement(child as any, {
        className: classnames(className, {
          [styles['render-component-wrapper-inner']]: !isSelect && !borderNone,
          'border-1-a': isSelect && !borderNone,
        }),
        style: borderNone
          ? // 组件
            {
              ...realStyle,
            }
          : // 组内组件
            {
              left,
              top,
              width,
              height,
              position: flag === 'H5' ? 'relative' : 'absolute',
              ...realStyle,
            },
      });
    });
  }, [
    isSelect,
    children,
    borderNone,
    componentScreenTypeStyle,
    transformOrigin,
    flag,
  ]);

  return (
    <>
      {realChildren}
      <ConnectSelectChangeWrapper value={value} onSelectChange={setIsSelect} />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenWrapper);
